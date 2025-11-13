import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
import * as apiService from "../services/apiService.js";

export default function CadastroExames({ navigation, route }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [exameId, setExameId] = useState(null);

  useEffect(() => {
    if (route?.params?.isEdit && route?.params?.exameData) {
      setIsEdit(true);
      setExameId(route.params.exameData.id);
      setFormData({
        nome: route.params.exameData.nome,
        descricao: route.params.exameData.descricao,
      });
    }
  }, [route?.params]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = async () => {
    if (!formData.nome.trim()) {
      alert('Nome do exame é obrigatório');
      return;
    }
  
    try {
      console.log("Enviando dados:", formData);
      
      const exameData = {
        pnome: formData.nome,
        pdescricao: formData.descricao
      };

      let result;
      if (isEdit) {
        result = await apiService.updateExame(exameId, exameData);
      } else {
        result = await apiService.createExame(exameData);
      }

      console.log("Resposta:", result);
  
      if (!result.error) {
        alert(result.message);
        setFormData({ nome: "", descricao: "" });
        navigation.goBack();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      alert('Erro: ' + error.message);
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Header />
        
        <PageHeader
          title={isEdit ? "Editar Exame" : "Novo Exame"}
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <FormField
            label="Nome do Exame *"
            placeholder="Digite o nome do exame"
            value={formData.nome}
            onChangeText={(value) => handleInputChange("nome", value)}
          />

          <FormField
            label="Descrição *"
            placeholder="Descreva o exame e suas características"
            value={formData.descricao}
            onChangeText={(value) => handleInputChange("descricao", value)}
            multiline={true}
            numberOfLines={6}
          />

          <ActionButtons
            onSave={handleSalvar}
            onCancel={handleCancelar}
            saveText={isEdit ? "Atualizar Exame" : "Salvar Exame"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  form: {
    padding: 20,
  },
});