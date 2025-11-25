// Importar componentes React Native
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
// Importar biblioteca de ícones
import { Ionicons } from "@expo/vector-icons";

/**
 * Componente ActionButtons - Botões de ação (Salvar e Cancelar)
 * Usado em formulários para confirmar ou descartar ações
 */
export default function ActionButtons({ 
  onSave, 
  onCancel, 
  saveText = "Salvar", 
  cancelText = "Cancelar",
  saveIcon = "checkmark-circle" 
}) {
  return (
    <View style={styles.container}>
      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Ionicons name={saveIcon} size={24} color="#fff" />
        <Text style={styles.saveButtonText}>{saveText}</Text>
      </TouchableOpacity>

      {/* Botão Cancelar */}
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>{cancelText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});