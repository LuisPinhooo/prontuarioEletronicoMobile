import { StyleSheet, View, SafeAreaView } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import ItemList from "../components/Common/ItemList/index.js";

export default function Exames({ navigation }) {
  const [exames, setExames] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarExames();
    }, [])
  );

  const carregarExames = async () => {
    try {
      console.log("Buscando exames...");
      const response = await fetch('http://localhost:3000/getexames');
      const result = await response.json();
      console.log("Resposta:", result);

      if (!result.error) {
        setExames(result.data);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
      alert('Falha ao conectar com a API');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddExame = () => {
    navigation.navigate("CadastroExames");
  };

  const handleItemPress = (exame) => {
    navigation.navigate("CadastroExames", { 
      isEdit: true,
      exameData: exame
    });
  };

  const handleDeleteExame = async (exameId) => {
    if (confirm("Deseja realmente excluir este exame?")) {
      try {
        const response = await fetch(`http://localhost:3000/deleteexame/${exameId}`, {
          method: 'DELETE'
        });
        const result = await response.json();

        if (!result.error) {
          setExames(exames.filter(e => e.id !== exameId));
          alert("Exame excluído com sucesso!");
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error('Erro ao deletar exame:', error);
        alert('Falha ao deletar exame');
      }
    }
  };

  const renderTitle = (item) => item.nome;
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