// Importar componentes React Native
import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState, useCallback } from "react"; // Para estado e callbacks
import { useFocusEffect } from "@react-navigation/native"; // Para recarregar dados ao voltar à página
// Importar componentes customizados
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";
// Importar funções da API
import * as apiService from "../services/apiService.js";

/**
 * Página Pacientes - Lista todos os pacientes cadastrados
 * Permite editar, deletar e criar novos pacientes
 */
export default function Pacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([]);

  // Recarregar dados ao voltar para esta página
  useFocusEffect(
    useCallback(() => {
      carregarPacientes();
    }, [])
  );

  // Função para buscar todos os pacientes da API
  const carregarPacientes = async () => {
    try {
      console.log("Buscando pacientes...");
      const result = await apiService.getPacientes();
      console.log("Resposta:", result);

      // Se API não retornou erro, atualiza lista de pacientes
      if (!result.error) {
        setPacientes(result.data);
      } else {
        // Se teve erro, exibe mensagem de erro
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      alert('Falha ao conectar com a API');
    }
  };

  // Função para voltar à página anterior
  const handleBack = () => {
    navigation.goBack();
  };

  // Função para navegar para a página de cadastro de novo paciente
  const handleAddPaciente = () => {
    navigation.navigate("CadastroPacientes");
  };

  // Função para editar um paciente existente
  const handleItemPress = (paciente) => {
    navigation.navigate("CadastroPacientes", { 
      pacienteId: paciente.id, 
      pacienteData: paciente,
      isEdit: true 
    });
  };

  // Função para deletar um paciente
  const handleDeletePaciente = async (pacienteId) => {
    // Solicita confirmação antes de deletar
    if (confirm("Deseja realmente excluir este paciente?")) {
      try {
        const result = await apiService.deletePaciente(pacienteId);

        // Se delete foi bem-sucedido, remove paciente da lista
        if (!result.error) {
          setPacientes(pacientes.filter(p => p.id !== pacienteId));
          alert("Paciente excluído com sucesso!");
        } else {
          // Se delete falhou, exibe mensagem de erro
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar paciente:', error);
        alert('Falha ao deletar paciente');
      }
    }
  };

  // Função para renderizar o nome do paciente na lista
  const renderTitle = (item) => item.nome;
  
  // Função para renderizar o CPF como subtítulo na lista
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