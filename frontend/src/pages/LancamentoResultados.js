import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
import * as apiService from "../services/apiService.js";

export default function LancamentoResultados({ navigation, route }) {
  const [formData, setFormData] = useState({
    exameId: "",
    pacienteId: "",
    valores: "",
    observacoes: "",
    status: "Processando",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [resultadoId, setResultadoId] = useState(null);

  useEffect(() => {
    if (route?.params?.isEdit && route?.params?.resultadoData) {
      setIsEdit(true);
      setResultadoId(route.params.resultadoData.id);
      setFormData(route.params.resultadoData);
    }
  }, [route?.params]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = async () => {
    if (!formData.exameId || !formData.pacienteId) {
      alert('Exame ID e Paciente ID são obrigatórios');
      return;
    }

    try {
      const resultadoData = {
        pexameId: parseInt(formData.exameId),
        ppacienteId: parseInt(formData.pacienteId),
        pvalores: formData.valores,
        pobservacoes: formData.observacoes,
        pstatus: formData.status
      };

      let result;
      if (isEdit) {
        result = await apiService.updateResultado(resultadoId, resultadoData);
      } else {
        result = await apiService.createResultado(resultadoData);
      }

      if (!result.error) {
        alert(result.message);
        navigation.goBack();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao lançar resultado:', error);
      alert('Erro de conexão com a API');
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
          title={isEdit ? "Editar Resultado" : "Lançar Resultado"}
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>📋 Dados do Resultado</Text>

          <FormField
            label="ID do Exame *"
            placeholder="Digite o ID do exame"
            value={formData.exameId.toString()}
            onChangeText={(value) => handleInputChange("exameId", value)}
            keyboardType="numeric"
          />

          <FormField
            label="ID do Paciente *"
            placeholder="Digite o ID do paciente"
            value={formData.pacienteId.toString()}
            onChangeText={(value) => handleInputChange("pacienteId", value)}
            keyboardType="numeric"
          />

          <FormField
            label="Valores/Resultado *"
            placeholder="Digite os valores do resultado..."
            value={formData.valores}
            onChangeText={(value) => handleInputChange("valores", value)}
            multiline={true}
            numberOfLines={6}
          />

          <FormField
            label="Observações"
            placeholder="Informações adicionais"
            value={formData.observacoes}
            onChangeText={(value) => handleInputChange("observacoes", value)}
            multiline={true}
            numberOfLines={4}
          />

          <FormField
            label="Status"
            placeholder="Status do resultado"
            value={formData.status}
            onChangeText={(value) => handleInputChange("status", value)}
          />

          <ActionButtons
            onSave={handleSalvar}
            onCancel={handleCancelar}
            saveText={isEdit ? "Atualizar Resultado" : "Lançar Resultado"}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
    marginTop: 20,
    marginBottom: 15,
  },
});