import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import SelectField from "../components/Common/SelectField/index.js";
import ActionButtons from "../components/Common/ActionButtons/index.js";
import * as apiService from "../services/apiService.js";

export default function CadastroPacientes({ navigation, route }) {
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    sexo: "",
    telefone: "",
    email: "",
    endereco: "",
    peso: "",
    altura: "",
    historicoFamiliar: "",
    habitosVida: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [pacienteId, setPacienteId] = useState(null);

  useEffect(() => {
    if (route?.params?.isEdit && route?.params?.pacienteData) {
      setIsEdit(true);
      setPacienteId(route.params.pacienteData.id);
      setFormData(route.params.pacienteData);
    }
  }, [route?.params]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = async () => {
    // Validação MÍNIMA - apenas campos obrigatórios não vazios
    if (!formData.nome.trim() || !formData.cpf.trim()) {
      alert('Nome e CPF são obrigatórios');
      return;
    }

    try {
      const pacienteData = {
        pnome: formData.nome,
        pcpf: formData.cpf,
        ptelefone: formData.telefone,
        pemail: formData.email,
        pendereco: formData.endereco,
        pdataNascimento: formData.dataNascimento,
        psexo: formData.sexo,
        ppeso: formData.peso,
        paltura: formData.altura,
        phistoricoFamiliar: formData.historicoFamiliar,
        phabitosVida: formData.habitosVida
      };

      let result;
      if (isEdit) {
        result = await apiService.updatePaciente(pacienteId, pacienteData);
      } else {
        result = await apiService.createPaciente(pacienteData);
      }

      if (!result.error) {
        alert(result.message);
        setFormData({
          nome: "",
          dataNascimento: "",
          cpf: "",
          sexo: "",
          telefone: "",
          email: "",
          endereco: "",
          peso: "",
          altura: "",
          historicoFamiliar: "",
          habitosVida: "",
        });
        navigation.goBack();
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      alert('Erro de conexão. Verifique se a API está rodando na porta 3000.');
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
          title={isEdit ? "Editar Paciente" : "Novo Paciente"}
          onBack={handleCancelar}
        />

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>📋 Dados Pessoais</Text>
          
          <FormField
            label="Nome Completo *"
            placeholder="Digite o nome completo"
            value={formData.nome}
            onChangeText={(value) => handleInputChange("nome", value)}
          />

          <FormField
            label="Data de Nascimento *"
            placeholder="DD/MM/AAAA"
            value={formData.dataNascimento}
            onChangeText={(value) => handleInputChange("dataNascimento", value)}
            keyboardType="numeric"
          />

          <FormField
            label="CPF *"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChangeText={(value) => handleInputChange("cpf", value)}
            keyboardType="numeric"
          />

          <SelectField
            label="Sexo *"
            value={formData.sexo}
            onValueChange={(value) => handleInputChange("sexo", value)}
            placeholder="Selecione uma opção"
            options={[
              { label: "Masculino", value: "Masculino" },
              { label: "Feminino", value: "Feminino" },
            ]}
          />

          <Text style={styles.sectionTitle}>📞 Contato</Text>

          <FormField
            label="Telefone *"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChangeText={(value) => handleInputChange("telefone", value)}
            keyboardType="phone-pad"
          />

          <FormField
            label="Email *"
            placeholder="email@exemplo.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormField
            label="Endereço Completo *"
            placeholder="Rua, número, bairro, cidade - UF"
            value={formData.endereco}
            onChangeText={(value) => handleInputChange("endereco", value)}
            multiline={true}
            numberOfLines={4}
          />

          <Text style={styles.sectionTitle}>🏥 Dados Clínicos</Text>

          <FormField
            label="Peso (kg) *"
            placeholder="Ex: 70.5"
            value={formData.peso}
            onChangeText={(value) => handleInputChange("peso", value)}
            keyboardType="decimal-pad"
          />

          <FormField
            label="Altura (m) *"
            placeholder="Ex: 1.75"
            value={formData.altura}
            onChangeText={(value) => handleInputChange("altura", value)}
            keyboardType="decimal-pad"
          />

          <SelectField
            label="Histórico Familiar de Doenças *"
            value={formData.historicoFamiliar}
            onValueChange={(value) => handleInputChange("historicoFamiliar", value)}
            placeholder="Selecione uma opção"
            options={[
              { label: "Sim", value: "Sim" },
              { label: "Não", value: "Não" },
            ]}
          />

          <SelectField
            label="Hábitos de Vida *"
            value={formData.habitosVida}
            onValueChange={(value) => handleInputChange("habitosVida", value)}
            placeholder="Selecione uma opção"
            options={[
              { label: "Ruim", value: "Ruim" },
              { label: "Regular", value: "Regular" },
              { label: "Bom", value: "Bom" },
              { label: "Excelente", value: "Excelente" },
            ]}
          />

          <ActionButtons
            onSave={handleSalvar}
            onCancel={handleCancelar}
            saveText={isEdit ? "Atualizar Paciente" : "Salvar Paciente"}
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