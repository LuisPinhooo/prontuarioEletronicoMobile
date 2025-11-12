import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";

export default function CadastroExames({ navigation }) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = () => {
    console.log("Dados do exame:", formData);
    alert("Exame cadastrado com sucesso! (Visual apenas)");
    navigation.goBack();
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Header />
        
        <PageHeader
          title="Novo Exame"
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
            saveText="Salvar Exame"
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