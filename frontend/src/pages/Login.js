// Importar componentes React Native
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react"; // Para gerenciar estado
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenar token localmente
// Importar componentes customizados
import Header from "../components/Header/index.js";
import FormField from "../components/Common/FormField/index.js";
// Importar funções da API
import * as apiService from "../services/apiService.js";

/**
 * Página de Login - Autentica o usuário na aplicação
 */
export default function Login({ navigation }) {
  // Estado para armazenar dados do formulário
  const [email, setEmail] = useState("admin@local"); // Email padrão para testes
  const [password, setPassword] = useState("123456"); // Senha padrão para testes
  const [loading, setLoading] = useState(false); // Mostrar loading durante requisição

  /**
   * Função para autenticar o usuário
   * Envia email e senha para a API e armazena o token se for bem-sucedido
   */
  const handleLogin = async () => {
    // Se email ou senha não foram preenchidos, exibe erro
    if (!email || !password) {
      Alert.alert("Erro", "Email e senha são obrigatórios");
      return;
    }
    
    try {
      setLoading(true); // Mostrar indicador de carregamento
      
      // Chamar função de login da API
      const result = await apiService.login(email, password);
      console.log("Resposta da API de Login:", result);

      // Se a API retornou erro, exibe mensagem de erro
      if (result.error) {
        Alert.alert('Erro', result.message || 'Credenciais inválidas');
        return;
      }

      // Armazenar token JWT localmente para requisições futuras
      await AsyncStorage.setItem('authToken', result.token);
      // Armazenar dados do usuário localmente
      await AsyncStorage.setItem('user', JSON.stringify(result.user));
      
      // Navegar para a página Home (substituir stack de login)
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