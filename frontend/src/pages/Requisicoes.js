import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Requisicoes({ navigation }) {
    const [requisicoes, setRequisicoes] = useState([
      { 
        id: 1, 
        numero: "1",
        data: "10/11/2025",
        status: "Pendente",
        medico: "Dr. Carlos Santos"
      },
      { 
        id: 2, 
        numero: "2", 
        data: "09/11/2025",
        status: "Em andamento",
        medico: "Dra. Ana Paula"
      },
      { 
        id: 3, 
        numero: "3",
        data: "08/11/2025", 
        status: "Pendente",
        medico: "Dr. Fernando Lima"
      },
    ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddRequisicao = () => {
    navigation.navigate("CadastroRequisicoes");
  };

  const handleItemPress = (requisicao) => {
    // Clique no card = Editar requisição
    navigation.navigate("CadastroRequisicoes", { 
      requisicaoId: requisicao.id, 
      requisicaoData: requisicao,
      isEdit: true 
    });
  };

  const handleDeleteRequisicao = (requisicaoId) => {
    if (confirm("Deseja realmente excluir esta requisição?")) {
      setRequisicoes(requisicoes.filter(r => r.id !== requisicaoId));
      alert("Requisição excluída com sucesso!");
    }
  };

  const renderTitle = (item) => `Requisição ${item.numero}`;
  const renderSubtitle = (item) => `${item.data} - ${item.status} - ${item.medico}`;

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