// Importar componentes React Native
import { StyleSheet, View, Text, TextInput } from "react-native";

/**
 * Componente FormField - Campo de entrada de texto customizado
 * Usado em formulários de cadastro e edição
 */
export default function FormField({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false, 
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "sentences"
}) {
  return (
    <View style={styles.container}>
      {/* Label do campo */}
      <Text style={styles.label}>{label}</Text>
      {/* Input de texto */}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputMultiline: {
    height: 100,
  },
});