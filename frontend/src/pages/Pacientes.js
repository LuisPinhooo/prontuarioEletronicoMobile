import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";
import * as apiService from "../services/apiService.js";

export default function Pacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarPacientes();
    }, [])
  );

  const carregarPacientes = async () => {
    try {
      console.log("Buscando pacientes...");
      const result = await apiService.getPacientes();
      console.log("Resposta:", result);

      if (!result.error) {
        setPacientes(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      alert('Falha ao conectar com a API');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddPaciente = () => {
    navigation.navigate("CadastroPacientes");
  };

  const handleItemPress = (paciente) => {
    navigation.navigate("CadastroPacientes", { 
      pacienteId: paciente.id, 
      pacienteData: paciente,
      isEdit: true 
    });
  };

  const handleDeletePaciente = async (pacienteId) => {
    if (confirm("Deseja realmente excluir este paciente?")) {
      try {
        const result = await apiService.deletePaciente(pacienteId);

        if (!result.error) {
          setPacientes(pacientes.filter(p => p.id !== pacienteId));
          alert("Paciente excluído com sucesso!");
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Falha ao deletar paciente');
      }
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