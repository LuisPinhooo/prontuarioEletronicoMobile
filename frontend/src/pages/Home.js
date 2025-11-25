// Importar componentes React Native
import { StyleSheet, View, Text, SafeAreaView } from "react-native";
// Importar componentes customizados
import MenuItem from "../components/Menu/index.js";
import Header from "../components/Header/index.js";

/**
 * Página Home - Menu principal com acesso aos módulos
 * Permite navegar para Pacientes, Exames, Requisições e Resultados
 */
export default function Home({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header /> {/* Cabeçalho com informações do usuário */}
        <View style={styles.content}>
          {/* Título da página */}
          <Text style={styles.title}>Menu Principal</Text>
          <Text style={styles.subtitle}>Escolha um módulo para prosseguir</Text>
          {/* Grid com botões de navegação */}
          <View style={styles.menuGrid}>
            {/* Botão para gerenciar Pacientes */}
            <MenuItem
              iconName="person-add-outline"
              text="Pacientes"
              color="#007bff"
              onPress={() => navigation.navigate("Pacientes")}
            />
            {/* Botão para gerenciar Exames */}
            <MenuItem
              iconName="flask-outline"
              text="Exames"
              color="#00000"
              onPress={() => navigation.navigate("Exames")}
            />
            {/* Botão para visualizar Resultados */}
            <MenuItem
              iconName="document-text-outline"
              text="Resultados"
              color="#e74c3c"
              onPress={() => navigation.navigate("Resultados")}
            />
            {/* Botão para gerenciar Requisições */}
            <MenuItem
              iconName="clipboard-outline"
              text="Requisições"
              color="#f1c40f"
              onPress={() => navigation.navigate("Requisicoes")}
            />
          </View>
        </View>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",  
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
    textAlign: "center",  
  },
  menuGrid: {
    width: "100%",
  },
});