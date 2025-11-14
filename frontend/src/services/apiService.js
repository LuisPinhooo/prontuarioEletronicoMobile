import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000'; // ← Porta 3000 (mesma do backend)

const fetchAPI = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: { 
        'Content-Type': 'application/json' 
      }
    };
    
    // Adicionar o Token no Cabeçalho (se não for rota de auth)
    if (!endpoint.startsWith('/auth')) {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn("Nenhum token encontrado para rota protegida:", endpoint);
      }
    }

    if (data) {
      options.body = JSON.stringify(data);
    }
    
    console.log(`[API Call] ${method} ${API_URL}${endpoint}`);
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Tratar resposta 401 (Token Expirado/Inválido)
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

// ============ AUTH ============
export const login = (email, password) => fetchAPI('/auth/login', 'POST', { email, password });
export const register = (name, email, password) => fetchAPI('/auth/register', 'POST', { name, email, password });

// ============ PACIENTES ============
export const getPacientes = () => fetchAPI('/getpacientes');
export const getPaciente = (id) => fetchAPI(`/getpacientes/${id}`);
export const createPaciente = (data) => fetchAPI('/insertpaciente', 'POST', data);
export const updatePaciente = (id, data) => fetchAPI(`/updatepaciente/${id}`, 'PUT', data);
export const deletePaciente = (id) => fetchAPI(`/deletepaciente/${id}`, 'DELETE');

// ============ EXAMES ============
export const getExames = () => fetchAPI('/getexames');
export const getExame = (id) => fetchAPI(`/getexames/${id}`);
export const createExame = (data) => fetchAPI('/insertexame', 'POST', data);
export const updateExame = (id, data) => fetchAPI(`/updateexame/${id}`, 'PUT', data);
export const deleteExame = (id) => fetchAPI(`/deleteexame/${id}`, 'DELETE');

// ============ REQUISIÇÕES ============
export const getRequisicoes = () => fetchAPI('/getrequisicoes');
export const getRequisicao = (id) => fetchAPI(`/getrequisicoes/${id}`);
export const getRequisicoesPaciente = (pacienteId) => fetchAPI(`/getrequisicoes/paciente/${pacienteId}`);
export const createRequisicao = (data) => fetchAPI('/insertrequisicao', 'POST', data);
export const updateRequisicao = (id, data) => fetchAPI(`/updaterequisicao/${id}`, 'PUT', data);
export const deleteRequisicao = (id) => fetchAPI(`/deleterequisicao/${id}`, 'DELETE');

// ============ RESULTADOS ============
export const getResultados = () => fetchAPI('/getresultados');
export const getResultado = (id) => fetchAPI(`/getresultados/${id}`);
export const getResultadosRequisicao = (requisicaoId) => fetchAPI(`/getresultados/requisicao/${requisicaoId}`);
export const createResultado = (data) => fetchAPI('/insertresultado', 'POST', data);
export const updateResultado = (id, data) => fetchAPI(`/updateresultado/${id}`, 'PUT', data);
export const deleteResultado = (id) => fetchAPI(`/deleteresultado/${id}`, 'DELETE');