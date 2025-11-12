import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import MenuItem from "../components/Menu/index.js";
import Header from "../components/Header/index.js";

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text style={styles.title}>Menu Principal</Text>
          <Text style={styles.subtitle}>Escolha um módulo para prosseguir</Text>
          <View style={styles.menuGrid}>
            <MenuItem
              iconName="person-add-outline"
              text="Pacientes"
              color="#007bff"
              onPress={() => navigation.navigate("Pacientes")}
            />
            <MenuItem
              iconName="flask-outline"
              text="Exames"
              color="#00000"
              onPress={() => navigation.navigate("Exames")}
            />
            <MenuItem
              iconName="document-text-outline"
              text="Resultados"
              color="#e74c3c"
              onPress={() => navigation.navigate("Resultados")}
            />
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
    textAlign: "center",  // ← ADICIONAR
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
    textAlign: "center",  // ← ADICIONAR
  },
  menuGrid: {
    width: "100%",
  },
});