const API_URL = 'http://192.168.2.10:3000';

const fetchAPI = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, options);
    return await response.json();
  } catch (error) {
    console.error(`Erro em ${endpoint}:`, error);
    throw error;
  }
};

// ============ PACIENTES ============
export const getPacientes = () => fetchAPI('/getpacientes');
export const createPaciente = (data) => fetchAPI('/insertpaciente', 'POST', data);
export const updatePaciente = (id, data) => fetchAPI(`/updatepaciente/${id}`, 'PUT', data);
export const deletePaciente = (id) => fetchAPI(`/deletepaciente/${id}`, 'DELETE');

// ============ EXAMES ============
export const getExames = () => fetchAPI('/getexames');
export const createExame = (data) => fetchAPI('/insertexame', 'POST', data);
export const updateExame = (id, data) => fetchAPI(`/updateexame/${id}`, 'PUT', data);
export const deleteExame = (id) => fetchAPI(`/deleteexame/${id}`, 'DELETE');