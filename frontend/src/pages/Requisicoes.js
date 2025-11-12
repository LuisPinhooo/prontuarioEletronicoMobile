import { StyleSheet, View, SafeAreaView } from "react-native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Requisicoes({ navigation }) {
  const requisicoesMock = [
    { 
      id: 1, 
      nome: "João Silva - Colesterol Total", 
      descricao: "Dr. Carlos Santos - 10/11/2025 - Pendente" 
    },
    { 
      id: 2, 
      nome: "Maria Oliveira - Uréia", 
      descricao: "Dra. Ana Paula - 09/11/2025 - Em andamento" 
    },
    { 
      id: 3, 
      nome: "Pedro Santos - Glicose em Jejum", 
      descricao: "Dr. Fernando Lima - 08/11/2025 - Pendente" 
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddRequisicao = () => {
    navigation.navigate("CadastroRequisicoes");
  };

  const handleItemPress = (requisicao) => {
    // Futuramente: navegar para detalhes da requisição
    console.log("Requisição selecionada:", requisicao);
  };

  const renderTitle = (item) => item.nome;
  const renderSubtitle = (item) => item.descricao;

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
          data={requisicoesMock}
          onItemPress={handleItemPress}
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