import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../components/Header/index.js";
import FormField from "../components/Common/FormField/index.js";
import * as apiService from "../services/apiService.js"; // 1. Importar o apiService

export default function Login({ navigation }) {
  const [email, setEmail] = useState("admin@local"); // Valor padrão para facilitar o teste
  const [password, setPassword] = useState("123456"); // Valor padrão para facilitar o teste
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Email e senha são obrigatórios");
      return;
    }
    
    try {
      setLoading(true);
      
      // 2. Chamar a API de login
      const result = await apiService.login(email, password);
      console.log("Resposta da API de Login:", result);

      // 3. Verificar se a API retornou um erro
      if (result.error) {
        Alert.alert('Erro', result.message || 'Credenciais inválidas');
        return;
      }

      // 4. Salvar o token REAL e os dados do usuário
      await AsyncStorage.setItem('authToken', result.token);
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      
      // 5. Navegar para a Home
      navigation.replace('Home');

    } catch (err) {
      console.error('Login error', err);
      Alert.alert('Erro', 'Falha ao conectar com o servidor de login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />
        
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>

          <FormField
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <FormField
            label="Senha"
            placeholder="sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
          </TouchableOpacity>

          <Text style={styles.hint}>Usuário Master: admin@local / 123456</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// (Estilos permanecem os mesmos)
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
  hint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
  },
});