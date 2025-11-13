import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../components/Header/index.js";
import FormField from "../components/Common/FormField/index.js";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Email e senha são obrigatórios");
      return;
    }
    try {
      setLoading(true);
      // Mock login - sem conexão com backend por enquanto
      const mockUsers = [
        { id: 1, name: 'Admin', email: 'admin@local', password: '123456' },
        { id: 2, name: 'João Silva', email: 'joao@local', password: '123456' }
      ];
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        Alert.alert('Erro', 'Credenciais inválidas');
        return;
      }

      const token = 'mock_token_' + Math.random().toString(36).substr(2, 9);
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
      
      navigation.replace('Home');
    } catch (err) {
      console.error('Login error', err);
      Alert.alert('Erro', 'Falha ao fazer login');
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

          <Text style={styles.hint}>Teste: admin@local / 123456</Text>
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
  hint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
  },
});