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
    'password': '123456',
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
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        df = pd.read_sql(SQL_QUERY, conn)
        return df
    except Exception as error:
        print(f"❌ Erro: {error}")
        return pd.DataFrame()
    finally:
        if conn:
            conn.close()

def run_kmeans_analysis(df, n_clusters=3):
    """Executa análise K-Means com K=3 clusters"""
    
    if df.empty:
        return {"status": "error", "message": "Sem dados"}
    
    # Remove NaN
    df_clean = df.dropna(subset=['glicose', 'colesterol'])
    
    if len(df_clean) < n_clusters:
        return {"status": "error", "message": "Dados insuficientes"}
    
    # Features para clustering
    X = df_clean[['idade', 'glicose', 'colesterol']].values
    X_scaled = StandardScaler().fit_transform(X)
    
    # K-Means com K=3
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df_clean['Cluster'] = kmeans.fit_predict(X_scaled)
    
    # Análise de clusters
    centroides = df_clean.groupby('Cluster')[['idade', 'glicose', 'colesterol']].mean()
    
    # Interpretações dos clusters
    interpretacoes = {
        0: "Alto Risco Metabólico-Cardiovascular",
        1: "Risco Intermediário/Monitoramento",
        2: "Baixo Risco (Saudável)"
    }
    
    # Ordenar por glicose (descendente) para consistência
    centroides = centroides.sort_values('glicose', ascending=False)
    
    # Tabela de centroides
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
    
    # Estatísticas da idade
    idade_stats = {
        'Média': round(df_clean['idade'].mean(), 2),
        'Mediana': round(df_clean['idade'].median(), 0),
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
    """Gera gráficos conforme documentação do projeto"""
    
    if results["status"] != "success":
        return
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    df = results["df_analysis"]
    cores = ['#e74c3c', '#f39c12', '#2ecc71']
    
    # --- GRÁFICO 1: Distribuição por Cluster ---
    fig, ax = plt.subplots(figsize=(10, 6))
    
    distribuicao = df['Cluster'].value_counts().sort_index()
    labels_pizza = [f'Cluster {c}\n({int(distribuicao[c])} pacientes)' for c in distribuicao.index]
    
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
    
    # --- GRÁFICO 2: Tabela de Centroides ---
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.axis('tight')
    ax.axis('off')
    
    centroid_data = results["tabela_centroides"]
    
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
            if i == 0:
                cell.set_facecolor('#34495e')
                cell.set_text_props(weight='bold', color='white', fontsize=11)
            else:
                cell.set_facecolor(cores[i-1])
                cell.set_text_props(weight='bold', color='white', fontsize=10)
    
    ax.set_title('ANÁLISE E PERFIS DE CLUSTER', fontsize=14, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig(f'{output_dir}/02_tabela_centroides.png', dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    print("\n🔄 Processando análise...\n")
    
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
    else:
        print(f"❌ Erro na análise: {results.get('message', 'Desconhecido')}")