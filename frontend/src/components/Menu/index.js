// Importar componentes React Native
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
// Importar biblioteca de ícones
import { Ionicons } from "@expo/vector-icons";

/**
 * Componente MenuItem - Botão de menu com ícone e texto
 * Usado para criar opções de navegação estilizadas
 */
export default function MenuItem({ iconName, text, color, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={40} color={color} />
        </View>
        <Text style={styles.menuText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  menuItem: {
    width: "90%",
    maxWidth: 300,
    backgroundColor: "#2ecc71",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});