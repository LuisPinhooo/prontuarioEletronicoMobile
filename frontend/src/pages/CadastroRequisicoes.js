import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import SelectField from "../components/Common/SelectField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
import * as apiService from "../services/apiService.js";

export default function CadastroRequisicoes({ navigation, route }) {
  const [formData, setFormData] = useState({
    pacienteId: "",
    exameIds: [],
  });

  const [pacientes, setPacientes] = useState([]);
  const [exames, setExames] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [requisicaoId, setRequisicaoId] = useState(null);

  useEffect(() => {
    carregarPacientes();
    carregarExames();

    if (route?.params?.isEdit && route?.params?.requisicaoData) {
      setIsEdit(true);
      setRequisicaoId(route.params.requisicaoData.id);
      setFormData({
        pacienteId: route.params.requisicaoData.pacienteId.toString(),
        exameIds: route.params.requisicaoData.exameIds,
      });
    }
  }, [route?.params]);

  const carregarPacientes = async () => {
    try {
      const result = await apiService.getPacientes();
      if (!result.error) {
        setPacientes(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const carregarExames = async () => {
    try {
      const result = await apiService.getExames();
      if (!result.error) {
        setExames(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleToggleExame = (exameId) => {
    setFormData(prev => {
      const exameIds = prev.exameIds.includes(exameId)
        ? prev.exameIds.filter(id => id !== exameId)
        : [...prev.exameIds, exameId];
      return { ...prev, exameIds };
    });
  };

  const handleSalvar = async () => {
    if (!formData.pacienteId || formData.exameIds.length === 0) {
      alert('Selecione paciente e pelo menos um exame');
      return;
    }

    try {
      const requisicaoData = {
        ppacienteId: parseInt(formData.pacienteId),
        pexameIds: formData.exameIds.map(id => parseInt(id))
      };

      let result;
      if (isEdit) {
        result = await apiService.updateRequisicao(requisicaoId, requisicaoData);
      } else {
        result = await apiService.createRequisicao(requisicaoData);
      }

      if (!result.error) {
        alert(result.message);
        setFormData({ pacienteId: "", exameIds: [] });
        navigation.goBack();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao salvar requisição:', error);
      alert('Erro de conexão com a API');
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const pacientesOptions = pacientes.map(p => ({
    label: p.nome,
    value: p.id.toString()
  }));

  const examesOptions = exames.map(e => ({
    label: e.nome,
    value: e.id.toString()
  }));

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

          <SelectField
            label="Paciente *"
            value={formData.pacienteId}
            onValueChange={(value) => handleInputChange("pacienteId", value)}
            placeholder="Selecione um paciente"
            options={pacientesOptions}
          />

          <Text style={styles.sectionTitle}>🔬 Exames</Text>
          <Text style={styles.label}>Selecione os exames *</Text>
          <View style={styles.examesContainer}>
            {examesOptions.length === 0 ? (
              <Text style={styles.noExamesText}>Nenhum exame disponível</Text>
            ) : (
              examesOptions.map(exame => (
                <View key={exame.value} style={styles.exameItem}>
                  <Text 
                    style={[
                      styles.exameText,
                      formData.exameIds.includes(exame.value) && styles.exameTextSelected
                    ]}
                    onPress={() => handleToggleExame(exame.value)}
                  >
                    {formData.exameIds.includes(exame.value) ? '✓ ' : '○ '}
                    {exame.label}
                  </Text>
                </View>
              ))
            )}
          </View>

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
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  examesContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  exameItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  exameText: {
    fontSize: 15,
    color: "#666",
    padding: 8,
  },
  exameTextSelected: {
    color: "#2ecc71",
    fontWeight: "600",
  },
  noExamesText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    padding: 10,
  },
});