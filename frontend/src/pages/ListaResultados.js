import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function ListaResultados({ navigation }) {
  const [resultados, setResultados] = useState([
    { 
      id: 1, 
      requisicao: "Requisição 1",
      dataLancamento: "11/11/2025",
      status: "Liberado",
      laboratorio: "Lab. Central"
    },
    { 
      id: 2, 
      requisicao: "Requisição 2", 
      dataLancamento: "10/11/2025",
      status: "Liberado",
      laboratorio: "Imagem Center"
    },
    { 
      id: 3, 
      requisicao: "Requisição 3",
      dataLancamento: "09/11/2025", 
      status: "Em análise",
      laboratorio: "Lab. Unidos"
    },
  ]);

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

  const handleDeleteResultado = (resultadoId) => {
    if (confirm("Deseja realmente excluir este resultado?")) {
      setResultados(resultados.filter(r => r.id !== resultadoId));
      alert("Resultado excluído com sucesso!");
    }
  };

  const renderTitle = (item) => item.requisicao;
  const renderSubtitle = (item) => `${item.dataLancamento} - ${item.status} - ${item.laboratorio}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Editar Resultados"
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