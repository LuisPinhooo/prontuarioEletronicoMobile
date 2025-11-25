// Importar componentes React Native
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
// Importar componentes customizados
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
// Importar funções da API
import * as apiService from "../services/apiService.js";

/**
 * Página ListaResultados - Lista requisições para seleção e edição de resultados
 */
export default function ListaResultados({ navigation }) {
  const [requisicoes, setRequisicoes] = useState([]);
  const [requisicoesFiltradas, setRequisicoesFiltradas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState("");

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  // Função para buscar requisições e pacientes da API
  const carregarDados = async () => {
    try {
      const reqResult = await apiService.getRequisicoes();
      const pacResult = await apiService.getPacientes();
      
      // Se conseguiu buscar requisições, atualiza lista
      if (!reqResult.error) {
        setRequisicoes(reqResult.data);
        setRequisicoesFiltradas(reqResult.data);
      }
      // Se conseguiu buscar pacientes, atualiza lista
      if (!pacResult.error) {
        setPacientes(pacResult.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Falha ao conectar com a API');
    }
  };

  // Função para filtrar requisições por ID
  const handleBusca = (texto) => {
    setBusca(texto);
    
    // Se campo de busca está vazio, mostra todas as requisições
    if (texto.trim() === "") {
      setRequisicoesFiltradas(requisicoes);
    } else {
      // Filtra requisições que contenham o texto
      const filtradas = requisicoes.filter(r => 
        r.id.toString().includes(texto) || 
        r.pacienteId.toString().includes(texto)
      );
      setRequisicoesFiltradas(filtradas);
    }
  };

  // Função para voltar à página anterior
  const handleBack = () => {
    navigation.goBack();
  };

  // Função para navegar para edição de resultados
  const handleEditarResultados = (requisicao) => {
    navigation.navigate("LancamentoResultados", { 
      requisicaoId: requisicao.id  // ← Passar só o ID
    });
  };

  // Função para obter o nome do paciente pelo ID
  const getPacienteNome = (pacienteId) => {
    // Busca paciente na lista; se não encontra, retorna 'Paciente desconhecido'
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? paciente.nome : 'Paciente desconhecido';
  };

  // Função para renderizar cada requisição na lista
  const renderRequisicao = ({ item }) => (
    <TouchableOpacity 
      style={styles.requisicaoCard}
      onPress={() => handleEditarResultados(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.requisicaoId}>Requisição #{item.id}</Text>
        <Text style={styles.pacienteName}>👤 {getPacienteNome(item.pacienteId)}</Text>
        <Text style={styles.examesCount}>🔬 {item.exameIds.length} exame(s)</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.data}>{new Date(item.dataCadastro).toLocaleDateString('pt-BR')}</Text>
      </View>
      <Text style={styles.editIcon}>✏️</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Editar Resultados"
          onBack={handleBack}
        />

        <View style={styles.buscaContainer}>
          <TextInput
            style={styles.buscaInput}
            placeholder="Buscar por ID da requisição..."
            value={busca}
            onChangeText={handleBusca}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.content}>
          {requisicoesFiltradas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma requisição disponível</Text>
          ) : (
            <FlatList
              data={requisicoesFiltradas}
              renderItem={renderRequisicao}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  buscaContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  buscaInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  requisicaoCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  requisicaoId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 5,
  },
  pacienteName: {
    fontSize: 15,
    color: "#333",
    marginBottom: 5,
  },
  examesCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  status: {
    fontSize: 13,
    color: "#999",
    marginBottom: 3,
  },
  data: {
    fontSize: 12,
    color: "#bbb",
  },
  editIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});