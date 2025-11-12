import { StyleSheet, View, SafeAreaView } from "react-native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Pacientes({ navigation }) {
  const pacientesMock = [
    { id: 1, nome: "João Silva", cpf: "123.456.789-00" },
    { id: 2, nome: "Maria Santos", cpf: "987.654.321-00" },
    { id: 3, nome: "Pedro Oliveira", cpf: "456.789.123-00" },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddPaciente = () => {
    navigation.navigate("CadastroPacientes");
  };

  const handleItemPress = (paciente) => {
    // Futuramente: navegar para detalhes do paciente
    console.log("Paciente selecionado:", paciente);
  };

  const renderTitle = (item) => item.nome;
  const renderSubtitle = (item) => `CPF: ${item.cpf}`;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Pacientes"
          onBack={handleBack}
          onAdd={handleAddPaciente}
          addButtonText="Novo Paciente"
        />

        <ItemList
          data={pacientesMock}
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