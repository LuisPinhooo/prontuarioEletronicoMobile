// Importar componentes React Native
import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
// Importar componentes customizados
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import SelectField from "../components/Common/SelectField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
// Importar funções da API
import * as apiService from "../services/apiService.js";

/**
 * Página CadastroRequisicoes - Criar nova requisição ou editar existente
 */
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

    // Se está em modo edição, carrega dados da requisição existente
    if (route?.params?.isEdit && route?.params?.requisicaoData) {
      setIsEdit(true);
      setRequisicaoId(route.params.requisicaoData.id);
      setFormData({
        pacienteId: route.params.requisicaoData.pacienteId.toString(),
        exameIds: route.params.requisicaoData.exameIds,
      });
    }
  }, [route?.params]);

  // Função para buscar todos os pacientes da API
  const carregarPacientes = async () => {
    try {
      const result = await apiService.getPacientes();
      // Se obteve dados com sucesso, atualiza lista de pacientes
      if (!result.error) {
        setPacientes(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  // Função para buscar todos os exames da API
  const carregarExames = async () => {
    try {
      const result = await apiService.getExames();
      // Se obteve dados com sucesso, atualiza lista de exames
      if (!result.error) {
        setExames(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    }
  };

  // Função para atualizar dados do formulário
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Função para adicionar ou remover exame da requisição
  const handleToggleExame = (exameId) => {
    setFormData(prev => {
      // Se exame já está selecionado, remove; senão, adiciona
      const exameIds = prev.exameIds.includes(exameId)
        ? prev.exameIds.filter(id => id !== exameId)
        : [...prev.exameIds, exameId];
      return { ...prev, exameIds };
    });
  };

  // Função para salvar ou atualizar requisição
  const handleSalvar = async () => {
    // Valida se paciente e pelo menos um exame foram selecionados
    if (!formData.pacienteId || formData.exameIds.length === 0) {
      alert('Selecione paciente e pelo menos um exame');
      return;
    }

    try {
      const requisicaoData = {
        ppacienteId: parseInt(formData.pacienteId),
        pexameIds: formData.exameIds.map(id => parseInt(id))
      };

      // Se está em modo edição, atualiza; senão, cria nova requisição
      let result;
      if (isEdit) {
        result = await apiService.updateRequisicao(requisicaoId, requisicaoData);
      } else {
        result = await apiService.createRequisicao(requisicaoData);
      }

      // Se sucesso, limpa formulário e volta à lista
      if (!result.error) {
        alert(result.message);
        setFormData({ pacienteId: "", exameIds: [] });
        navigation.goBack();
      } else {
        // Se erro, exibe mensagem
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao salvar requisição:', error);
      alert('Erro de conexão com a API');
    }
  };

  // Função para cancelar e voltar à lista
  const handleCancelar = () => {
    navigation.goBack();
  };

  // Criar array de opções para o select de pacientes
  const pacientesOptions = pacientes.map(p => ({
    label: p.nome,
    value: p.id.toString()
  }));

  // Criar array de opções para o select de exames
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
            {/* Se não há exames disponíveis, exibe mensagem */}
            {examesOptions.length === 0 ? (
              <Text style={styles.noExamesText}>Nenhum exame disponível</Text>
            ) : (
              // Lista todos os exames para seleção
              examesOptions.map(exame => (
                <View key={exame.value} style={styles.exameItem}>
                  <Text 
                    style={[
                      styles.exameText,
                      // Se exame está selecionado, muda a cor
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