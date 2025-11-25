// Importar biblioteca para armazenar dados localmente no dispositivo
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL base da API backend
const API_URL = 'http://localhost:3000'; // Deve estar rodando na porta 3000

/**
 * Função auxiliar para fazer requisições HTTP à API
 * Cuida de adicionar token JWT automaticamente nas requisições protegidas
 */
const fetchAPI = async (endpoint, method = 'GET', data = null) => {
  try {
    // Configurar opções da requisição HTTP
    const options = {
      method,
      headers: { 
        'Content-Type': 'application/json' 
      }
    };
    
    // Adicionar token JWT no header Authorization (para rotas protegidas)
    // Rotas de autenticação (/auth) não precisam de token
    if (!endpoint.startsWith('/auth')) {
      // Recuperar token armazenado localmente
      const token = await AsyncStorage.getItem('authToken');
      // Se token existe, adicionar no header Authorization
      if (token) {
        // Adicionar token no formato "Bearer <token>"
        options.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn("Nenhum token encontrado para rota protegida:", endpoint);
      }
    }

    // Adicionar dados ao corpo da requisição se for POST/PUT
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    // Log para debug
    console.log(`[API Call] ${method} ${API_URL}${endpoint}`);
    
    // Fazer requisição para a API
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Se token expirou ou é inválido, retorna erro de sessão
    if (response.status === 401) {
      console.error("Erro 401: Token inválido ou expirado.");
      return { error: true, message: "Sessão expirada. Faça login novamente." };
    }

    return await response.json();

  } catch (error) {
    console.error(`Erro em ${endpoint}:`, error);
    return { error: true, message: "Falha de conexão com a API." };
  }
};

// ========== AUTENTICAÇÃO ==========
// Função para fazer login e receber token JWT
export const login = (email, password) => fetchAPI('/auth/login', 'POST', { email, password });
// Função para registrar novo usuário
export const register = (name, email, password) => fetchAPI('/auth/register', 'POST', { name, email, password });

// ========== GERENCIAR PACIENTES ==========
// Função para listar todos os pacientes
export const getPacientes = () => fetchAPI('/getpacientes');
// Função para buscar um paciente específico
export const getPaciente = (id) => fetchAPI(`/getpacientes/${id}`);
// Função para criar novo paciente
export const createPaciente = (data) => fetchAPI('/insertpaciente', 'POST', data);
// Função para atualizar dados de um paciente
export const updatePaciente = (id, data) => fetchAPI(`/updatepaciente/${id}`, 'PUT', data);
// Função para deletar um paciente
export const deletePaciente = (id) => fetchAPI(`/deletepaciente/${id}`, 'DELETE');

// ========== GERENCIAR EXAMES ==========
// Função para listar todos os exames
export const getExames = () => fetchAPI('/getexames');
// Função para buscar um exame específico
export const getExame = (id) => fetchAPI(`/getexames/${id}`);
// Função para criar novo exame
export const createExame = (data) => fetchAPI('/insertexame', 'POST', data);
// Função para atualizar dados de um exame
export const updateExame = (id, data) => fetchAPI(`/updateexame/${id}`, 'PUT', data);
// Função para deletar um exame
export const deleteExame = (id) => fetchAPI(`/deleteexame/${id}`, 'DELETE');

// ========== GERENCIAR REQUISIÇÕES ==========
// Função para listar todas as requisições de exames
export const getRequisicoes = () => fetchAPI('/getrequisicoes');
// Função para buscar uma requisição específica
export const getRequisicao = (id) => fetchAPI(`/getrequisicoes/${id}`);
// Função para buscar todas as requisições de um paciente
export const getRequisicoesPaciente = (pacienteId) => fetchAPI(`/getrequisicoes/paciente/${pacienteId}`);
// Função para criar nova requisição de exames
export const createRequisicao = (data) => fetchAPI('/insertrequisicao', 'POST', data);
// Função para atualizar uma requisição
export const updateRequisicao = (id, data) => fetchAPI(`/updaterequisicao/${id}`, 'PUT', data);
// Função para deletar uma requisição
export const deleteRequisicao = (id) => fetchAPI(`/deleterequisicao/${id}`, 'DELETE');

// ========== GERENCIAR RESULTADOS ==========
// Função para listar todos os resultados de exames
export const getResultados = () => fetchAPI('/getresultados');
// Função para buscar um resultado específico
export const getResultado = (id) => fetchAPI(`/getresultados/${id}`);
// Função para buscar todos os resultados de uma requisição
export const getResultadosRequisicao = (requisicaoId) => fetchAPI(`/getresultados/requisicao/${requisicaoId}`);
// Função para criar novo resultado de exame
export const createResultado = (data) => fetchAPI('/insertresultado', 'POST', data);
// Função para atualizar um resultado
export const updateResultado = (id, data) => fetchAPI(`/updateresultado/${id}`, 'PUT', data);
// Função para deletar um resultado
export const deleteResultado = (id) => fetchAPI(`/deleteresultado/${id}`, 'DELETE');