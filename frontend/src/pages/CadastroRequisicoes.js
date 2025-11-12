import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";

export default function CadastroRequisicoes({ navigation }) {
  const [formData, setFormData] = useState({
    paciente: "",
    exame: "",
    medicoSolicitante: "",
    observacoes: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = () => {
    console.log("Dados da requisição:", formData);
    alert("Requisição cadastrada com sucesso! (Visual apenas)");
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
          title="Nova Requisição"
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <FormField
            label="Nome do Paciente *"
            placeholder="Digite o nome do paciente"
            value={formData.paciente}
            onChangeText={(value) => handleInputChange("paciente", value)}
          />

          <FormField
            label="Exame Solicitado *"
            placeholder="Digite o nome do exame"
            value={formData.exame}
            onChangeText={(value) => handleInputChange("exame", value)}
          />

          <FormField
            label="Médico Solicitante *"
            placeholder="Digite o nome do médico"
            value={formData.medicoSolicitante}
            onChangeText={(value) => handleInputChange("medicoSolicitante", value)}
          />

          <FormField
            label="Observações"
            placeholder="Informações adicionais sobre a requisição"
            value={formData.observacoes}
            onChangeText={(value) => handleInputChange("observacoes", value)}
            multiline={true}
            numberOfLines={4}
          />

          <ActionButtons
            onSave={handleSalvar}
            onCancel={handleCancelar}
            saveText="Salvar Requisição"
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