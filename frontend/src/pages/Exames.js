import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Exames({ navigation }) {
  const [exames, setExames] = useState([
    { id: 1, nome: "Hemograma Completo", descricao: "Análise completa do sangue" },
    { id: 2, nome: "Glicemia em Jejum", descricao: "Medição do nível de glicose" },
    { id: 3, nome: "Colesterol Total", descricao: "Dosagem de colesterol no sangue" },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddExame = () => {
    navigation.navigate("CadastroExames");
  };

  const handleItemPress = (exame) => {
    // Clique no card = Editar exame
    navigation.navigate("CadastroExames", { 
      exameId: exame.id, 
      exameData: exame,
      isEdit: true 
    });
  };

  const handleDeleteExame = (exameId) => {
    if (confirm("Deseja realmente excluir este exame?")) {
      setExames(exames.filter(e => e.id !== exameId));
      alert("Exame excluído com sucesso!");
    }
  };

  const renderTitle = (item) => item.nome;
  const renderSubtitle = (item) => item.descricao;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Exames"
          onBack={handleBack}
          onAdd={handleAddExame}
          addButtonText="Novo Exame"
        />

        <ItemList
          data={exames}
          onItemPress={handleItemPress}
          onDelete={handleDeleteExame}
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