import argparse
import csv
import random
import re
import sys
from dataclasses import dataclass
from typing import Iterable, Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

try:
    from rich.console import Console
    from rich.table import Table
except ImportError:  # pragma: no cover - optional dependency
    Console = None
    Table = None


USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
]

BASE_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Connection": "keep-alive",
}

BLOCKED_TOKENS = ("captcha", "robô", "robot check", "verificação")


@dataclass
class ProductInfo:
    site: str
    url: str
    name: Optional[str]
    price: Optional[float]
    availability: Optional[str]
    status: str
    message: Optional[str] = None


def build_headers() -> dict:
    headers = dict(BASE_HEADERS)
    headers["User-Agent"] = random.choice(USER_AGENTS)
    return headers


def normalize_price(raw_value: Optional[str]) -> Optional[float]:
    if not raw_value:
        return None
    cleaned = re.sub(r"[^\d,\.]", "", raw_value).strip()
    if not cleaned:
        return None
    if "," in cleaned and "." in cleaned:
        if cleaned.rfind(",") > cleaned.rfind("."):
            cleaned = cleaned.replace(".", "").replace(",", ".")
        else:
            cleaned = cleaned.replace(",", "")
    else:
        cleaned = cleaned.replace(",", ".")
    try:
        return float(cleaned)
    except ValueError:
        return None


def format_price(value: Optional[float]) -> str:
    if value is None:
        return "-"
    formatted = f"{value:,.2f}"
    return formatted.replace(",", "X").replace(".", ",").replace("X", ".")


def normalize_availability(raw_value: Optional[str]) -> Optional[str]:
    if not raw_value:
        return None
    text = raw_value.strip()
    lowered = text.lower()
    if "instock" in lowered or "in stock" in lowered or "disponível" in lowered or "em estoque" in lowered:
        return "Disponível"
    if "outofstock" in lowered or "out of stock" in lowered or "indisponível" in lowered or "esgotado" in lowered:
        return "Indisponível"
    return text


def first_text(soup: BeautifulSoup, selectors: Iterable[str]) -> Optional[str]:
    for selector in selectors:
        element = soup.select_one(selector)
        if element:
            text = element.get_text(strip=True)
            if text:
                return text
    return None


def first_attr(soup: BeautifulSoup, selectors: Iterable[str], attr: str) -> Optional[str]:
    for selector in selectors:
        element = soup.select_one(selector)
        if element and element.has_attr(attr):
            value = element.get(attr)
            if value:
                return value.strip()
    return None


def is_response_blocked(status_code: int, body: str) -> bool:
    if status_code in {403, 429, 503}:
        return True
    lowered = body.lower()
    return any(token in lowered for token in BLOCKED_TOKENS)


class BaseScraper:
    site_name = ""
    domains: tuple[str, ...] = ()
    requires_browser = False

    def parse(self, soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str]]:
        raise NotImplementedError

    def scrape(self, url: str, timeout: int) -> ProductInfo:
        try:
            response = requests.get(url, headers=build_headers(), timeout=timeout)
        except requests.RequestException as exc:
            return ProductInfo(
                site=self.site_name,
                url=url,
                name=None,
                price=None,
                availability=None,
                status="error",
                message=str(exc),
            )

        soup = BeautifulSoup(response.text, "html.parser")
        if is_response_blocked(response.status_code, response.text):
            return ProductInfo(
                site=self.site_name,
                url=url,
                name=None,
                price=None,
                availability=None,
                status="blocked",
                message=self.blocked_message(),
            )

        name, price_raw, availability_raw = self.parse(soup)
        price = normalize_price(price_raw)
        availability = normalize_availability(availability_raw)

        missing = []
        if not name:
            missing.append("nome")
        if price is None:
            missing.append("preço")
        if not availability:
            missing.append("disponibilidade")

        status = "ok" if not missing else "partial"
        message = None
        if missing:
            message = f"Campos ausentes: {', '.join(missing)}"
            if self.requires_browser:
                message += " (talvez precise de Playwright/Selenium)"

        return ProductInfo(
            site=self.site_name,
            url=url,
            name=name,
            price=price,
            availability=availability,
            status=status,
            message=message,
        )

    def blocked_message(self) -> str:
        if self.requires_browser:
            return "Possível bloqueio/anti-bot. Considere Playwright ou Selenium."
        return "Possível bloqueio/anti-bot."


class AmazonScraper(BaseScraper):
    site_name = "Amazon"
    domains = ("amazon.com.br",)
    requires_browser = True

    def parse(self, soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str]]:
        name = first_text(soup, ["#productTitle", "h1#title span", "h1 span"])
        price = first_text(
            soup,
            [
                "#priceblock_ourprice",
                "#priceblock_dealprice",
                "#priceblock_saleprice",
                "span.a-price span.a-offscreen",
                "#price_inside_buybox",
            ],
        )
        availability = first_text(soup, ["#availability span", "#outOfStock", "#availability"])
        return name, price, availability


class ShopeeScraper(BaseScraper):
    site_name = "Shopee"
    domains = ("shopee.com.br",)
    requires_browser = True

    def parse(self, soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str]]:
        name = first_attr(soup, ["meta[property='og:title']", "meta[name='description']"], "content")
        price = first_attr(
            soup,
            [
                "meta[property='product:price:amount']",
                "meta[property='og:price:amount']",
                "meta[name='twitter:data1']",
            ],
            "content",
        )
        availability = first_attr(soup, ["meta[property='product:availability']"], "content")
        return name, price, availability


class MagaluScraper(BaseScraper):
    site_name = "Magalu"
    domains = ("magazineluiza.com.br", "magalu.com")

    def parse(self, soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str]]:
        name = first_text(soup, ["h1[data-testid='product-title']", "h1.header-product__title", "h1"])
        price = first_text(
            soup,
            [
                "p[data-testid='price-value']",
                "span[data-testid='price-value']",
                "div[data-testid='product-price'] span",
                "span.price-template__text",
            ],
        )
        availability = first_attr(soup, ["link[itemprop='availability']"], "href") or first_attr(
            soup,
            ["meta[itemprop='availability']"],
            "content",
        )
        return name, price, availability


class MercadoLivreScraper(BaseScraper):
    site_name = "Mercado Livre"
    domains = ("mercadolivre.com.br", "mercadolivre.com")

    def parse(self, soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str]]:
        name = first_text(soup, ["h1.ui-pdp-title", "h1"])
        fraction = first_text(soup, ["span.andes-money-amount__fraction"])
        centavos = first_text(soup, ["span.andes-money-amount__cents"])
        price = None
        if fraction:
            price = f"{fraction},{centavos}" if centavos else fraction
        if not price:
            price = first_attr(soup, ["meta[itemprop='price']", "meta[property='product:price:amount']"], "content")
        availability = first_text(
            soup,
            ["p.ui-pdp-stock-information__title", "span.ui-pdp-buybox__quantity__available"],
        )
        if not availability:
            availability = first_attr(soup, ["link[itemprop='availability']"], "href") or first_attr(
                soup,
                ["meta[itemprop='availability']"],
                "content",
            )
        return name, price, availability


SCRAPERS: tuple[BaseScraper, ...] = (
    AmazonScraper(),
    ShopeeScraper(),
    MagaluScraper(),
    MercadoLivreScraper(),
)


def scraper_for_url(url: str) -> Optional[BaseScraper]:
    hostname = urlparse(url).netloc.lower()
    for scraper in SCRAPERS:
        if any(domain in hostname for domain in scraper.domains):
            return scraper
    return None


def render_results(results: Iterable[ProductInfo]) -> None:
    results = list(results)
    if Console and Table:
        console = Console()
        table = Table(title="Price Monitor")
        table.add_column("Site")
        table.add_column("Produto")
        table.add_column("Preço (R$)", justify="right")
        table.add_column("Disponibilidade")
        table.add_column("Status")
        table.add_column("Mensagem")
        for item in results:
            table.add_row(
                item.site,
                item.name or "-",
                format_price(item.price),
                item.availability or "-",
                item.status,
                item.message or "-",
            )
        console.print(table)
        return

    headers = ["Site", "Produto", "Preço (R$)", "Disponibilidade", "Status", "Mensagem"]
    rows = [
        [
            item.site,
            item.name or "-",
            format_price(item.price),
            item.availability or "-",
            item.status,
            item.message or "-",
        ]
        for item in results
    ]
    widths = [len(header) for header in headers]
    for row in rows:
        for index, cell in enumerate(row):
            widths[index] = max(widths[index], len(str(cell)))
    separator = f"+{'+'.join('-' * (width + 2) for width in widths)}+"
    print(separator)
    print("|" + "|".join(f" {header:<{widths[i]}} " for i, header in enumerate(headers)) + "|")
    print(separator)
    for row in rows:
        print("|" + "|".join(f" {str(cell):<{widths[i]}} " for i, cell in enumerate(row)) + "|")
    print(separator)


def export_csv(results: Iterable[ProductInfo], path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(
            csvfile,
            fieldnames=["site", "url", "name", "price", "availability", "status", "message"],
        )
        writer.writeheader()
        for item in results:
            writer.writerow(
                {
                    "site": item.site,
                    "url": item.url,
                    "name": item.name,
                    "price": item.price,
                    "availability": item.availability,
                    "status": item.status,
                    "message": item.message,
                }
            )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Price Monitor MVP para e-commerce.")
    parser.add_argument(
        "urls",
        nargs="*",
        help="URLs de produtos (Amazon, Shopee, Magalu, Mercado Livre).",
    )
    parser.add_argument("--csv", dest="csv_path", help="Salva resultados em CSV.")
    parser.add_argument("--timeout", type=int, default=20, help="Timeout das requisições (segundos).")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if not args.urls:
        print("Informe pelo menos uma URL de produto.", file=sys.stderr)
        print("Exemplo:", file=sys.stderr)
        print("  python price_monitor.py https://www.amazon.com.br/produto-exemplo", file=sys.stderr)
        print("  python price_monitor.py https://www.magazineluiza.com.br/produto-exemplo", file=sys.stderr)
        return

    results = []
    for url in args.urls:
        scraper = scraper_for_url(url)
        if not scraper:
            results.append(
                ProductInfo(
                    site="Desconhecido",
                    url=url,
                    name=None,
                    price=None,
                    availability=None,
                    status="error",
                    message="Domínio não suportado.",
                )
            )
            continue
        results.append(scraper.scrape(url, timeout=args.timeout))

    render_results(results)
    if args.csv_path:
        export_csv(results, args.csv_path)
        print(f"CSV salvo em: {args.csv_path}")


if __name__ == "__main__":
    main()
