// Importar componentes React Native
import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
// Importar componentes customizados
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";
// Importar funções da API
import * as apiService from "../services/apiService.js";

/**
 * Página Exames - Lista todos os exames cadastrados
 * Permite editar, deletar e criar novos exames
 */
export default function Exames({ navigation }) {
  const [exames, setExames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarExames();
    }, [])
  );

  // Função para buscar todos os exames da API
  const carregarExames = async () => {
    try {
      console.log("Buscando exames...");
      const result = await apiService.getExames();
      console.log("Resposta:", result);

      // Se API não retornou erro, atualiza lista de exames
      if (!result.error) {
        setExames(result.data);
      } else {
        // Se teve erro, exibe mensagem de erro
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      alert('Falha ao conectar com a API');
    }
  };

  // Função para voltar à página anterior
  const handleBack = () => {
    navigation.goBack();
  };

  // Função para navegar para cadastro de novo exame
  const handleAddExame = () => {
    navigation.navigate("CadastroExames");
  };

  // Função para editar um exame existente
  const handleItemPress = (exame) => {
    navigation.navigate("CadastroExames", { 
      isEdit: true,
      exameData: exame
    });
  };

  // Função para deletar um exame
  const handleDeleteExame = async (exameId) => {
    // Solicita confirmação antes de deletar
    if (confirm("Deseja realmente excluir este exame?")) {
      try {
        const result = await apiService.deleteExame(exameId);

        // Se delete foi bem-sucedido, remove exame da lista
        if (!result.error) {
          setExames(exames.filter(e => e.id !== exameId));
          alert("Exame excluído com sucesso!");
        } else {
          // Se delete falhou, exibe mensagem de erro
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar exame:', error);
        alert('Falha ao deletar exame');
      }
    }
  };

  // Função para renderizar o nome do exame na lista
  const renderTitle = (item) => item.nome;
  // Função para renderizar a descrição como subtítulo
  const renderSubtitle = (item) => item.descricao || "Sem descrição";

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