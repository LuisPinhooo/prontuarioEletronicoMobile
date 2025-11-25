// Importar bibliotecas React e React Native
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

/**
 * Componente Header - Cabeçalho com menu hambúrguer e título
 * Exibido no topo de todas as páginas da aplicação
 */
export default function Header() {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {/* Botão Hambúrguer para abrir Drawer */}
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      {/* Conteúdo do header com título e subtítulo */}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Sistema de Prontuário Eletrônico</Text>
        <Text style={styles.headerSubtitle}>Bem-vindo(a)!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2ecc71",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    textAlign: "center",
    marginTop: 4,
  },
});