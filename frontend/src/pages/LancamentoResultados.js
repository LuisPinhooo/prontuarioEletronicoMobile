import { StyleSheet, View, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import SelectField from "../components/Common/SelectField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
import * as apiService from "../services/apiService.js";

export default function LancamentoResultados({ navigation, route }) {
  const [formData, setFormData] = useState({
    requisicaoId: "",
    resultados: {},
  });

  const [requisicoes, setRequisicoes] = useState([]);
  const [requisicoesFiltradas, setRequisicoesFiltradas] = useState([]);
  const [busca, setBusca] = useState("");
  const [mostraDropdown, setMostraDropdown] = useState(false);
  const [requisicaoSelecionada, setRequisicaoSelecionada] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [exames, setExames] = useState([]);
  const [todosExames, setTodosExames] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarDados().then(() => {
        // Se veio de ListaResultados com ID da requisição
        if (route?.params?.requisicaoId) {
          const idRequisicao = route.params.requisicaoId;
          console.log("ID recebido:", idRequisicao);
          
          // Buscar a requisição no array de requisições (agora ele já tem dados)
          const reqEncontrada = requisicoes.find(r => r.id === idRequisicao);
          if (reqEncontrada) {
            handleRequisicaoSelecionada(reqEncontrada);
          }
        }
      });
    }, [route?.params?.requisicaoId])
  );

  const carregarDados = async () => {
    try {
      const reqResult = await apiService.getRequisicoes();
      const pacResult = await apiService.getPacientes();
      const exResult = await apiService.getExames();

      if (!reqResult.error) {
        setRequisicoes(reqResult.data);
        setRequisicoesFiltradas(reqResult.data);
      }
      if (!pacResult.error) {
        setPacientes(pacResult.data);
      }
      if (!exResult.error) {
        setTodosExames(exResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleBusca = (texto) => {
    setBusca(texto);
    setMostraDropdown(true);
    
    if (texto.trim() === "") {
      setRequisicoesFiltradas(requisicoes);
    } else {
      const filtradas = requisicoes.filter(r => 
        r.id.toString().includes(texto) || 
        r.pacienteId.toString().includes(texto)
      );
      setRequisicoesFiltradas(filtradas);
    }
  };

  const handleRequisicaoSelecionada = async (requisicao) => {
    setBusca(`Requisição #${requisicao.id}`);
    setMostraDropdown(false);
    
    try {
      setRequisicaoSelecionada(requisicao);

      const pacienteDados = pacientes.find(p => p.id == requisicao.pacienteId);
      setPaciente(pacienteDados);

      const examesRequisicao = todosExames.filter(e => requisicao.exameIds.includes(e.id));
      setExames(examesRequisicao);

      const resultadosResult = await apiService.getResultadosRequisicao(requisicao.id);
      const resultadosExistentes = {};
      if (!resultadosResult.error && resultadosResult.data) {
        resultadosResult.data.forEach(r => {
          resultadosExistentes[r.exameId] = r;
        });
      }

      setFormData({
        requisicaoId: requisicao.id.toString(),
        resultados: resultadosExistentes
      });
    } catch (error) {
      console.error('Erro ao carregar requisição:', error);
      alert('Erro ao carregar dados da requisição');
    }
  };

  const handleResultadoChange = (exameId, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      resultados: {
        ...prev.resultados,
        [exameId]: {
          ...prev.resultados[exameId],
          [campo]: valor,
          exameId: exameId
        }
      }
    }));
  };

  const handleSalvar = async () => {
    if (!formData.requisicaoId) {
      alert('Selecione uma requisição');
      return;
    }

    if (Object.keys(formData.resultados).length === 0) {
      alert('Preencha pelo menos um resultado');
      return;
    }

    try {
      for (const exameId in formData.resultados) {
        const resultado = formData.resultados[exameId];
        
        if (resultado.resultado && resultado.resultado.trim()) {
          const resultadoData = {
            prequisicaoId: parseInt(formData.requisicaoId),
            pexameId: parseInt(exameId),
            presultado: resultado.resultado,
            pobservacoes: resultado.observacoes || ''
          };

          let apiResult;
          if (resultado.id) {
            apiResult = await apiService.updateResultado(resultado.id, resultadoData);
          } else {
            apiResult = await apiService.createResultado(resultadoData);
          }

          if (apiResult.error) {
            alert(`Erro ao salvar resultado: ${apiResult.message}`);
            return;
          }
        }
      }

      alert('Resultados lançados com sucesso!');
      setFormData({ requisicaoId: "", resultados: {} });
      setRequisicaoSelecionada(null);
      setPaciente(null);
      setExames([]);
      setBusca("");
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar resultados:', error);
      alert('Erro de conexão com a API');
    }
  };

  const handleCancelar = () => {
    navigation.goBack();
  };

  const renderRequisicaoItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.dropdownItem}
      onPress={() => handleRequisicaoSelecionada(item)}
    >
      <Text style={styles.dropdownItemText}>
        Requisição #{item.id}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Header />
        
        <PageHeader
          title="Lançamento de Resultados"
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>📋 Buscar Requisição</Text>

          <View style={styles.buscaWrapper}>
            <TextInput
              style={styles.buscaInput}
              placeholder="Digite o ID da requisição..."
              value={busca}
              onChangeText={handleBusca}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            
            {mostraDropdown && requisicoesFiltradas.length > 0 && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  data={requisicoesFiltradas}
                  renderItem={renderRequisicaoItem}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                />
              </View>
            )}
          </View>

          {requisicaoSelecionada && paciente && (
            <>
              <Text style={styles.sectionTitle}>👤 Dados do Paciente</Text>
              <View style={styles.pacienteInfo}>
                <Text style={styles.infoLabel}>Nome:</Text>
                <Text style={styles.infoValue}>{paciente.nome}</Text>
                <Text style={styles.infoLabel}>CPF:</Text>
                <Text style={styles.infoValue}>{paciente.cpf}</Text>
              </View>

              <Text style={styles.sectionTitle}>🔬 Resultados dos Exames</Text>
              {exames.map(exame => (
                <View key={exame.id} style={styles.exameResultado}>
                  <Text style={styles.exameNome}>{exame.nome}</Text>
                  
                  <TextInput
                    style={styles.resultadoInput}
                    placeholder="Digite o resultado do exame"
                    value={formData.resultados[exame.id]?.resultado || ''}
                    onChangeText={(valor) => handleResultadoChange(exame.id, 'resultado', valor)}
                    multiline={true}
                    numberOfLines={4}
                  />

                  <TextInput
                    style={styles.observacoesInput}
                    placeholder="Observações (opcional)"
                    value={formData.resultados[exame.id]?.observacoes || ''}
                    onChangeText={(valor) => handleResultadoChange(exame.id, 'observacoes', valor)}
                    multiline={true}
                    numberOfLines={2}
                  />
                </View>
              ))}

              <ActionButtons
                onSave={handleSalvar}
                onCancel={handleCancelar}
                saveText="Lançar Resultados"
              />
            </>
          )}
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
  buscaWrapper: {
    marginBottom: 20,
  },
  buscaInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  pacienteInfo: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
  },
  exameResultado: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  exameNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 12,
  },
  resultadoInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
  observacoesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    textAlignVertical: "top",
  },
});