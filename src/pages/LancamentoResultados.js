import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";

export default function LancamentoResultados({ navigation }) {
  const [formData, setFormData] = useState({
    requisicao: "",
    resultado: "",
    observacoes: "",
  });

  // Requisições mockadas para seleção
  const requisicoesDisponiveis = [
    "João Silva - Hemograma Completo",
    "Maria Oliveira - Raio-X Tórax",
    "Pedro Santos - Ultrassom Abdominal",
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = () => {
    console.log("Resultado lançado:", formData);
    alert("Resultado lançado com sucesso! (Visual apenas)");
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
          title="Lançar Resultado"
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <FormField
            label="Requisição *"
            placeholder="Digite o nome do paciente e exame"
            value={formData.requisicao}
            onChangeText={(value) => handleInputChange("requisicao", value)}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 Dica</Text>
            <Text style={styles.infoText}>
              Digite o nome do paciente para buscar as requisições disponíveis
            </Text>
          </View>

          <FormField
            label="Resultado do Exame *"
            placeholder="Digite o resultado do exame..."
            value={formData.resultado}
            onChangeText={(value) => handleInputChange("resultado", value)}
            multiline={true}
            numberOfLines={8}
          />

          <FormField
            label="Observações"
            placeholder="Informações adicionais sobre o resultado"
            value={formData.observacoes}
            onChangeText={(value) => handleInputChange("observacoes", value)}
            multiline={true}
            numberOfLines={4}
          />

          <ActionButtons
            onSave={handleSalvar}
            onCancel={handleCancelar}
            saveText="Lançar Resultado"
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
  infoBox: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: "#1565c0",
  },
});