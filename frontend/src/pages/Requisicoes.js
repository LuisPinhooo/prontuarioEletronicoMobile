// Importar componentes React Native
import { StyleSheet, View, SafeAreaView, TextInput } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
// Importar componentes customizados
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";
// Importar funções da API
import * as apiService from "../services/apiService.js";

/**
 * Página Requisicoes - Lista todas as requisições de exames
 * Permite editar, deletar e criar novas requisições
 */
export default function Requisicoes({ navigation }) {
  const [requisicoes, setRequisicoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [requisicoesFiltradas, setRequisicoesFiltradas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarRequisicoes();
    }, [])
  );

  // Função para buscar todas as requisições da API
  const carregarRequisicoes = async () => {
    try {
      console.log("Buscando requisições...");
      const result = await apiService.getRequisicoes();
      console.log("Resposta:", result);

      // Se API não retornou erro, atualiza lista de requisições
      if (!result.error) {
        setRequisicoes(result.data);
        setRequisicoesFiltradas(result.data);
        setBusca("");
      } else {
        // Se teve erro, exibe mensagem de erro
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar requisições:', error);
      alert('Falha ao conectar com a API');
    }
  };

  // Função para filtrar requisições por ID ou Paciente
  const handleBusca = (texto) => {
    setBusca(texto);
    
    // Se campo de busca está vazio, mostra todas as requisições
    if (texto.trim() === "") {
      setRequisicoesFiltradas(requisicoes);
    } else {
      // Filtra requisições que contenham o texto na busca
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

  // Função para criar nova requisição
  const handleAddRequisicao = () => {
    navigation.navigate("CadastroRequisicoes");
  };

  // Função para editar uma requisição existente
  const handleItemPress = (requisicao) => {
    navigation.navigate("CadastroRequisicoes", { 
      isEdit: true,
      requisicaoData: requisicao
    });
  };

  // Função para deletar uma requisição
  const handleDeleteRequisicao = async (requisicaoId) => {
    // Solicita confirmação antes de deletar
    if (confirm("Deseja realmente excluir esta requisição?")) {
      try {
        const result = await apiService.deleteRequisicao(requisicaoId);

        // Se delete foi bem-sucedido, remove requisição das listas
        if (!result.error) {
          setRequisicoes(requisicoes.filter(r => r.id !== requisicaoId));
          setRequisicoesFiltradas(requisicoesFiltradas.filter(r => r.id !== requisicaoId));
          alert("Requisição excluída com sucesso!");
        } else {
          // Se delete falhou, exibe mensagem de erro
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar requisição:', error);
        alert('Falha ao deletar requisição');
      }
    }
  };

  // Função para renderizar ID da requisição na lista
  const renderTitle = (item) => `Requisição #${item.id}`;
  // Função para renderizar informações da requisição como subtítulo
  const renderSubtitle = (item) => `Paciente: ${item.pacienteId} | Exames: ${item.exameIds.length} | Status: ${item.status}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Requisições"
          onBack={handleBack}
          onAdd={handleAddRequisicao}
          addButtonText="Nova Requisição"
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

        <ItemList
          data={requisicoesFiltradas}
          onItemPress={handleItemPress}
          onDelete={handleDeleteRequisicao}
          renderTitle={renderTitle}
          renderSubtitle={renderSubtitle}
        />
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
});