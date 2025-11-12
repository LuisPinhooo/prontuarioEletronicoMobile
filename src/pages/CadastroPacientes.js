import { StyleSheet, View, SafeAreaView, ScrollView, Text } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";
import FormField from "../components/Common/FormField/index.js";
import SelectField from "../components/Common/SelectField/index.js";  // ← NOVO
import ActionButtons from "../components/Common/ActionButtons/index.js";

export default function CadastroPacientes({ navigation }) {
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

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSalvar = () => {
    console.log("Dados do formulário:", formData);
    alert("Paciente cadastrado com sucesso! (Visual apenas)");
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
          title="Novo Paciente"
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

          <FormField
            label="Sexo *"
            placeholder="Masculino / Feminino"
            value={formData.sexo}
            onChangeText={(value) => handleInputChange("sexo", value)}
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
            saveText="Salvar Paciente"
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