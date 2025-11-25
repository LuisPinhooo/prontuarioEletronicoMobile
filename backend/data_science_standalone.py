import pandas as pd
import numpy as np
import psycopg2
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import json
import sys
import os
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib import rcParams

rcParams['font.sans-serif'] = ['Arial']
rcParams['axes.unicode_minus'] = False
sns.set_style("whitegrid")

# --- 1. CONFIGURAÇÃO DO BANCO ---
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 50000,
    'user': 'postgres',
    'password': '9090',
    'database': 'prontuario_eletronico'
}

# --- 2. CONSULTA SQL ---
SQL_QUERY = """
    SELECT
        p.id AS paciente_id,
        p.nome,
        DATE_PART('year', AGE(CURRENT_DATE, p.data_nascimento)) AS idade,
        AVG(CASE WHEN e.id = 1 THEN r.resultado ELSE NULL END) AS glicose,
        AVG(CASE WHEN e.id = 2 THEN r.resultado ELSE NULL END) AS colesterol
    FROM pacientes p
    LEFT JOIN requisicoes req ON p.id = req.paciente_id
    LEFT JOIN resultados r ON req.id = r.requisicao_id
    LEFT JOIN exames e ON r.exame_id = e.id
    GROUP BY p.id, p.nome, p.data_nascimento;
"""

def fetch_data():
    """Busca dados dos pacientes no banco PostgreSQL"""
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        df = pd.read_sql(SQL_QUERY, conn)
        return df
    except Exception as error:
        print(f"❌ Erro: {error}")
        return pd.DataFrame()
    finally:
        # Fecha conexão se foi estabelecida com sucesso
        if conn:
            conn.close()

def run_kmeans_analysis(df, n_clusters=3):
    """Agrupa pacientes em 3 clusters de risco usando K-Means"""
    
    # Valida se há dados para análise
    if df.empty:
        return {"status": "error", "message": "Sem dados"}
    
    # Remove linhas com valores ausentes
    df_clean = df.dropna(subset=['glicose', 'colesterol'])
    
    # Verifica se há dados suficientes para formar clusters
    if len(df_clean) < n_clusters:
        return {"status": "error", "message": "Dados insuficientes"}
    
    # Normaliza dados (idade, glicose, colesterol)
    X = df_clean[['idade', 'glicose', 'colesterol']].values
    X_scaled = StandardScaler().fit_transform(X)
    
    # Aplica K-Means para segmentar pacientes
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df_clean['Cluster'] = kmeans.fit_predict(X_scaled)
    
    # Calcula média de cada variável por cluster
    centroides = df_clean.groupby('Cluster')[['idade', 'glicose', 'colesterol']].mean()
    
    # Classifica clusters por nível de risco
    interpretacoes = {
        0: "Alto Risco Metabólico-Cardiovascular",
        1: "Risco Intermediário/Monitoramento",
        2: "Baixo Risco (Saudável)"
    }
    
    # Ordena por glicose para consistência
    centroides = centroides.sort_values('glicose', ascending=False)
    
    # Formata dados dos clusters para saída
    tabela_centroides = []
    for idx, (cluster_id, row) in enumerate(centroides.iterrows()):
        tabela_centroides.append({
            "Cluster": int(cluster_id),
            "Média Idade (Anos)": round(row['idade'], 1),
            "Média Glicose (mg/dL)": round(row['glicose'], 1),
            "Média Colesterol (Total)": round(row['colesterol'], 1),
            "Perfil Clínico": interpretacoes.get(idx, "Desconhecido"),
            "Quantidade Pacientes": int(len(df_clean[df_clean['Cluster'] == cluster_id]))
        })
    
    # Calcula estatísticas descritivas da idade
    idade_stats = {
        'Média': round(df_clean['idade'].mean(), 2),
        'Mediana': round(df_clean['idade'].median(), 0),
        # Se moda existe, converte para int; caso contrário, retorna 'N/A'
        'Moda': int(df_clean['idade'].mode()[0]) if not df_clean['idade'].mode().empty else 'N/A',
        'Desvio Padrão': round(df_clean['idade'].std(), 2),
        'Variância': round(df_clean['idade'].var(), 2),
        'Mínimo': int(df_clean['idade'].min()),
        'Máximo': int(df_clean['idade'].max())
    }
    
    return {
        "status": "success",
        "medidas_estatisticas_idade": idade_stats,
        "tabela_centroides": tabela_centroides,
        "total_pacientes_analisados": len(df_clean),
        "df_analysis": df_clean,
        "centroides": centroides
    }

def generate_graphics(results, output_dir="graficos"):
    """Gera 3 gráficos: scatterplot, pizza e tabela de clusters"""
    
    # Se análise não foi bem-sucedida, não gera gráficos
    if results["status"] != "success":
        return
    
    # Cria diretório se não existir
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    df = results["df_analysis"]
    cores = ['#c23b22', '#d35400', '#27ae60']  # Vermelho, Laranja, Verde
    
    # --- GRÁFICO 0: Scatterplot K-Means (Glicose vs Colesterol) ---
    fig, ax = plt.subplots(figsize=(12, 8))
    
    # Plota pontos de cada cluster
    for cluster in df['Cluster'].unique():
        cluster_data = df[df['Cluster'] == cluster]
        ax.scatter(cluster_data['glicose'], cluster_data['colesterol'], 
                   s=150, c=cores[int(cluster)], marker='D', 
                   edgecolors='black', linewidth=1.5,
                   label=f'Cluster {int(cluster)}', alpha=0.7)
    
    # Marca os centroides dos clusters
    centroides = results["centroides"]
    for idx, (cluster_id, row) in enumerate(centroides.iterrows()):
        ax.scatter(row['glicose'], row['colesterol'], 
                   s=400, marker='o', c='black', edgecolors='white', 
                   linewidth=2, zorder=5, alpha=0.9)
    
    ax.set_xlabel('Glicose (mg/dL)', fontsize=12, fontweight='bold')
    ax.set_ylabel('Colesterol Total (mg/dL)', fontsize=12, fontweight='bold')
    ax.set_title('Análise K-Means: Glicose vs Colesterol', fontsize=14, fontweight='bold', pad=20)
    ax.legend(fontsize=11, loc='best')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/00_scatterplot_kmeans.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # --- GRÁFICO 1: Gráfico de pizza com distribuição dos clusters ---
    fig, ax = plt.subplots(figsize=(10, 6))
    
    distribuicao = df['Cluster'].value_counts().sort_index()
    labels_pizza = [f'Cluster {c}\n({int(distribuicao[c])} pacientes)' for c in distribuicao.index]
    
    # Plota pizza com percentuais
    wedges, texts, autotexts = ax.pie(distribuicao, labels=labels_pizza, colors=cores,
                                        autopct='%1.1f%%', startangle=90,
                                        textprops={'fontsize': 10, 'fontweight': 'bold'})
    
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(11)
    
    ax.set_title('Distribuição de Pacientes por Cluster', fontsize=13, fontweight='bold', pad=20)
    plt.tight_layout()
    plt.savefig(f'{output_dir}/01_distribuicao_clusters.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    # --- GRÁFICO 2: Tabela com resumo dos centroides ---
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.axis('tight')
    ax.axis('off')
    
    centroid_data = results["tabela_centroides"]
    
    # Formata dados da tabela
    tabela_dados = []
    for c in centroid_data:
        tabela_dados.append([
            f"Cluster {c['Cluster']}",
            f"{c['Quantidade Pacientes']}",
            f"{c['Média Idade (Anos)']}",
            f"{c['Média Glicose (mg/dL)']}",
            f"{c['Média Colesterol (Total)']}",
            c['Perfil Clínico']
        ])
    
    table_centroides = ax.table(cellText=tabela_dados,
                                colLabels=['Cluster', 'Nº Pac.', 'Idade', 'Glicose', 'Colesterol', 'Perfil Clínico'],
                                cellLoc='center', loc='center',
                                colWidths=[0.1, 0.08, 0.1, 0.12, 0.13, 0.37])
    
    table_centroides.auto_set_font_size(False)
    table_centroides.set_fontsize(10)
    table_centroides.scale(1, 2.5)
    
    for i in range(len(tabela_dados) + 1):
        for j in range(6):
            cell = table_centroides[(i, j)]
            # Primeira linha é cabeçalho (cinza escuro)
            if i == 0:
                cell.set_facecolor('#34495e')
                cell.set_text_props(weight='bold', color='white', fontsize=11)
            # Demais linhas usam cores dos clusters
            else:
                cell.set_facecolor(cores[i-1])
                cell.set_text_props(weight='bold', color='white', fontsize=10)
    
    ax.set_title('ANÁLISE E PERFIS DE CLUSTER', fontsize=14, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/02_tabela_centroides.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    print("\n🔄 Processando análise...\n")
    
    # Se argumento --simulate for passado, usa dados simulados; caso contrário, busca do banco
    if len(sys.argv) > 1 and sys.argv[1].lower() == '--simulate':
        np.random.seed(42)
        df_simulado = pd.DataFrame({
            'paciente_id': range(1, 11),
            'nome': [f'Paciente {i}' for i in range(1, 11)],
            'idade': [62, 65, 60, 32, 28, 35, 48, 50, 45, 40],
            'glicose': [120.3, 125, 115, 85.9, 80, 90, 100.5, 105, 95, 98],
            'colesterol': [235.1, 240, 230, 175.0, 170, 180, 198.7, 200, 195, 190]
        })
        results = run_kmeans_analysis(df_simulado)
    else:
        df_real = fetch_data()
        results = run_kmeans_analysis(df_real)
    
    # Se análise foi bem-sucedida, exibe resultados e gera gráficos
    if results["status"] == "success":
        # Exibir medidas estatísticas
        print("="*60)
        print("📈 MEDIDAS ESTATÍSTICAS - IDADE")
        print("="*60)
        for chave, valor in results["medidas_estatisticas_idade"].items():
            print(f"{chave:.<30} {valor}")
        
        print("\n✅ Gerando gráficos...\n")
        generate_graphics(results)
        
        try:
            output_data = {
                "status": "success",
                "total_pacientes_analisados": results["total_pacientes_analisados"],
                "medidas_estatisticas_idade": results["medidas_estatisticas_idade"],
                "tabela_centroides": results["tabela_centroides"]
            }
            
            with open('ds_output_final.json', 'w', encoding='utf-8') as f:
                json.dump(output_data, f, indent=4, ensure_ascii=False)
            
            print("✅ Análise concluída!")
            print("✅ Gráficos salvos em: graficos/")
            print("✅ JSON salvo em: ds_output_final.json")
        except Exception as e:
            print(f"❌ Erro: {e}")
    # Se análise falhar, exibe mensagem de erro
    else:
        print(f"❌ Erro na análise: {results.get('message', 'Desconhecido')}")