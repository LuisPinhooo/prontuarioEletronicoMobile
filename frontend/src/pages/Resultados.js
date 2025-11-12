import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import MenuItem from "../components/Menu/index.js";
import Header from "../components/Header/index.js";
import PageHeader from "../components/Common/PageHeader/index.js";

export default function Resultados({ navigation }) {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <PageHeader
          title="Resultados de Exames"
          onBack={handleBack}
        />
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>Escolha uma opção para continuar</Text>
          <View style={styles.menuGrid}>
            <MenuItem
              iconName="add-circle-outline"
              text="Lançar Resultado"
              color="#000000"
              onPress={() => navigation.navigate("LancamentoResultados")}
            />
            <MenuItem
              iconName="create-outline"
              text="Editar Resultado"
              color="#f39c12"
              onPress={() => navigation.navigate("ListaResultados")}
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