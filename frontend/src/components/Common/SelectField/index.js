import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function SelectField({ label, value, options, onValueChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder || "Selecione";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={!selectedOption ? styles.placeholder : styles.text}>
          {displayText}
        </Text>
        <Text>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.options}>
          {options.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.option}
              onPress={() => {
                onValueChange(item.value);
                setIsOpen(false);
              }}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  button: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  placeholder: {
    fontSize: 14,
    color: "#999",
  },
  options: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});