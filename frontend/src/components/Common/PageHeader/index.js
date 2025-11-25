// Importar componentes React Native
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
// Importar biblioteca de ícones
import { Ionicons } from "@expo/vector-icons";

/**
 * Componente PageHeader - Cabeçalho de página com botão voltar e botão adicionar
 * Exibido no topo de cada página principal
 */
export default function PageHeader({ title, onBack, onAdd, addButtonText }) {
  return (
    <View style={styles.container}>
      {/* Row com botão voltar e título */}
      <View style={styles.headerRow}>
        {/* Botão para voltar à página anterior */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {/* Botão adicionar (opcional) */}
      {onAdd && (
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>{addButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});