import { StyleSheet, View, SafeAreaView } from "react-native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Exames({ navigation }) {
  const examesMock = [
    { id: 1, nome: "Hemograma Completo", descricao: "Análise completa do sangue" },
    { id: 2, nome: "Glicemia em Jejum", descricao: "Medição do nível de glicose" },
    { id: 3, nome: "Colesterol Total", descricao: "Dosagem de colesterol no sangue" },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddExame = () => {
    navigation.navigate("CadastroExames");
  };

  const handleItemPress = (exame) => {
    // Futuramente: navegar para detalhes do exame
    console.log("Exame selecionado:", exame);
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
          data={examesMock}
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