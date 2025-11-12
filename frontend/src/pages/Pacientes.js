import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Pacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([
    { id: 1, nome: "João Silva", cpf: "123.456.789-00" },
    { id: 2, nome: "Maria Santos", cpf: "987.654.321-00" },
    { id: 3, nome: "Pedro Oliveira", cpf: "456.789.123-00" },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddPaciente = () => {
    navigation.navigate("CadastroPacientes");
  };

  const handleItemPress = (paciente) => {
    // Clique no card = Editar paciente
    navigation.navigate("CadastroPacientes", { 
      pacienteId: paciente.id, 
      pacienteData: paciente,
      isEdit: true 
    });
  };

  const handleDeletePaciente = (pacienteId) => {
    if (confirm("Deseja realmente excluir este paciente?")) {
      setPacientes(pacientes.filter(p => p.id !== pacienteId));
      alert("Paciente excluído com sucesso!");
    }
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
          data={pacientes}
          onItemPress={handleItemPress}
          onDelete={handleDeletePaciente}
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