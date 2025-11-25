// Importar componentes React Native
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
// Importar componentes customizados
import Header from "../components/Header/index.js";

/**
 * Página Sobre - Informações gerais sobre o projeto
 */
export default function Sobre({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>📋 Sobre o Projeto</Text>
            
            <Text style={styles.sectionTitle}>O que é?</Text>
            <Text style={styles.text}>
              Sistema de Prontuário Eletrônico Mobile é uma aplicação desenvolvida para gerenciar dados de pacientes, exames e resultados de forma digital e integrada.
            </Text>

            <Text style={styles.sectionTitle}>Finalidade</Text>
            <Text style={styles.text}>
              Facilitar o acesso e gerenciamento de informações clínicas, permitindo que profissionais de saúde visualizem dados de pacientes, solicitem exames e analisem resultados em tempo real através de uma interface intuitiva.
            </Text>

            <Text style={styles.sectionTitle}>Disciplinas Envolvidas</Text>
            <Text style={styles.text}>
              • Dsesenvolvimento de aplicativos móveis (React Native){"\n"}
              • Data Science {"\n"}
            </Text>

            <Text style={styles.sectionTitle}>👨‍🏫 Tutor</Text>
            <Text style={styles.text}>
              Alex Nunes
            </Text>

            <Text style={styles.sectionTitle}>👥 Desenvolvedores/Alunos</Text>
            <Text style={styles.text}>
              • Luís Fernando da Silva Pinho{"\n"}
              • João Paulo Pimenta{"\n"}
              • Alexandre Coimbra Moresca
            </Text>

            <Text style={styles.sectionTitle}>📅 Versão</Text>
            <Text style={styles.text}>
              v1.0 - 2025
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2ecc71",
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
});