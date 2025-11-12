import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import Header from "../components/Header/index.js";
import FormField from "../components/Common/FormField/index.js";

export default function Login({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = () => {
    if (usuario === "admin" && senha === "123456") {
      navigation.replace("Home");
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>

          <FormField
            label="Usuário"
            placeholder="admin"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />

          <FormField
            label="Senha"
            placeholder="123456"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});