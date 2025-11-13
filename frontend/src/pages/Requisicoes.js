import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";
import * as apiService from "../services/apiService.js";

export default function Requisicoes({ navigation }) {
  const [requisicoes, setRequisicoes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarRequisicoes();
    }, [])
  );

  const carregarRequisicoes = async () => {
    try {
      console.log("Buscando requisições...");
      const result = await apiService.getRequisicoes();
      console.log("Resposta:", result);

      if (!result.error) {
        setRequisicoes(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar requisições:', error);
      alert('Falha ao conectar com a API');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddRequisicao = () => {
    navigation.navigate("CadastroRequisicoes");
  };

  const handleItemPress = (requisicao) => {
    navigation.navigate("CadastroRequisicoes", { 
      isEdit: true,
      requisicaoData: requisicao
    });
  };

  const handleDeleteRequisicao = async (requisicaoId) => {
    if (confirm("Deseja realmente excluir esta requisição?")) {
      try {
        const result = await apiService.deleteRequisicao(requisicaoId);

        if (!result.error) {
          setRequisicoes(requisicoes.filter(r => r.id !== requisicaoId));
          alert("Requisição excluída com sucesso!");
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar requisição:', error);
        alert('Falha ao deletar requisição');
      }
    }
  };

  const renderTitle = (item) => item.tipo;
  const renderSubtitle = (item) => `Status: ${item.status} | Prioridade: ${item.prioridade}`;

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

        <ItemList
          data={requisicoes}
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
});