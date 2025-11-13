require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Importar controllers
const PacienteController = require('./controllers/PacienteController');
const ExameController = require('./controllers/ExameController');
const RequisicaoController = require('./controllers/RequisicaoController');
const ResultadoController = require('./controllers/ResultadoController');

// Importar rotas
const pacientesRoutes = require('./routes/pacientes');
const examesRoutes = require('./routes/exames');
const requisicoesRoutes = require('./routes/requisicoes');
const resultadosRoutes = require('./routes/resultados');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Mock data (dados locais)
let users = [
  { id: 1, name: 'Admin', email: 'admin@local', password: '123456' },
  { id: 2, name: 'João Silva', email: 'joao@local', password: '123456' }
];

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: true, message: 'Credenciais inválidas' });
  }
  const token = 'mock_token_' + Math.random().toString(36).substr(2, 9);
  res.json({ error: false, token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: true, message: 'Usuário já existe' });
  }
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.status(201).json({ error: false, message: 'Usuário criado com sucesso', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// Rotas de Pacientes
app.use('/', pacientesRoutes);

// Rotas de Exames
app.use('/', examesRoutes);

// Rotas de Requisições
app.use('/', requisicoesRoutes);

// Rotas de Resultados
app.use('/', resultadosRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: true, message: 'Rota não encontrada' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
