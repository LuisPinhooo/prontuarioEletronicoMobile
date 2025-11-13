import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import SelectField from "../components/Common/SelectField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
import * as apiService from "../services/apiService.js";

export default function CadastroRequisicoes({ navigation, route }) {
  const [formData, setFormData] = useState({
    pacienteId: "",
    tipo: "",
    descricao: "",
    medico: "",
    prioridade: "Normal",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [requisicaoId, setRequisicaoId] = useState(null);

  useEffect(() => {
    if (route?.params?.isEdit && route?.params?.requisicaoData) {
      setIsEdit(true);
      setRequisicaoId(route.params.requisicaoData.id);
      setFormData(route.params.requisicaoData);
    }
  }, [route?.params]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = async () => {
    if (!formData.pacienteId || !formData.tipo) {
      alert('Paciente e tipo são obrigatórios');
      return;
    }

    try {
      const requisicaoData = {
        ppacienteId: parseInt(formData.pacienteId),
        ptipo: formData.tipo,
        pdescricao: formData.descricao,
        pmedico: formData.medico,
        pprioridade: formData.prioridade
      };

      let result;
      if (isEdit) {
        result = await apiService.updateRequisicao(requisicaoId, requisicaoData);
      } else {
        result = await apiService.createRequisicao(requisicaoData);
      }

      if (!result.error) {
        alert(result.message);
        navigation.goBack();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar requisição:', error);
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
          title={isEdit ? "Editar Requisição" : "Nova Requisição"}
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>📋 Dados da Requisição</Text>

          <FormField
            label="ID do Paciente *"
            placeholder="Digite o ID do paciente"
            value={formData.pacienteId.toString()}
            onChangeText={(value) => handleInputChange("pacienteId", value)}
            keyboardType="numeric"
          />

          <FormField
            label="Tipo de Exame *"
            placeholder="Ex: Hemograma, Glicemia"
            value={formData.tipo}
            onChangeText={(value) => handleInputChange("tipo", value)}
          />

          <FormField
            label="Descrição"
            placeholder="Informações adicionais"
            value={formData.descricao}
            onChangeText={(value) => handleInputChange("descricao", value)}
            multiline={true}
            numberOfLines={4}
          />

          <FormField
            label="Médico Responsável"
            placeholder="Nome do médico"
            value={formData.medico}
            onChangeText={(value) => handleInputChange("medico", value)}
          />

          <SelectField
            label="Prioridade"
            value={formData.prioridade}
            onValueChange={(value) => handleInputChange("prioridade", value)}
            options={[
              { label: "Baixa", value: "Baixa" },
              { label: "Normal", value: "Normal" },
              { label: "Alta", value: "Alta" },
              { label: "Urgente", value: "Urgente" },
            ]}
          />

          <ActionButtons
            onSave={handleSalvar}
            onCancel={handleCancelar}
            saveText={isEdit ? "Atualizar Requisição" : "Salvar Requisição"}
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