import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";
import * as apiService from "../services/apiService.js";

export default function ListaResultados({ navigation }) {
  const [resultados, setResultados] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarResultados();
    }, [])
  );

  const carregarResultados = async () => {
    try {
      console.log("Buscando resultados...");
      const result = await apiService.getResultados();
      console.log("Resposta:", result);

      if (!result.error) {
        setResultados(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      alert('Falha ao conectar com a API');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleItemPress = (resultado) => {
    navigation.navigate("LancamentoResultados", { 
      resultadoId: resultado.id, 
      resultadoData: resultado,
      isEdit: true 
    });
  };

  const handleDeleteResultado = async (resultadoId) => {
    if (confirm("Deseja realmente excluir este resultado?")) {
      try {
        const result = await apiService.deleteResultado(resultadoId);

        if (!result.error) {
          setResultados(resultados.filter(r => r.id !== resultadoId));
          alert("Resultado excluído com sucesso!");
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar resultado:', error);
        alert('Falha ao deletar resultado');
      }
    }
  };

  const renderTitle = (item) => `Exame ID: ${item.exameId}`;
  const renderSubtitle = (item) => `Status: ${item.status} | ${item.dataCadastro?.substring(0, 10)}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Resultados"
          onBack={handleBack}
        />

        <ItemList
          data={resultados}
          onItemPress={handleItemPress}
          onDelete={handleDeleteResultado}
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