require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rotas
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const pacientesRoutes = require('./routes/pacientes');
const examesRoutes = require('./routes/exames');
const requisicoeRoutes = require('./routes/requisicoes');
const resultadosRoutes = require('./routes/resultados');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de teste
app.get("/", (req, res) => {
    res.json({ 
        status: "Ok", 
        message: "API Prontuário Eletrônico funcionando!",
        version: "1.0.0"
    });
});

// Rotas de Autenticação (NÃO PROTEGIDAS - não precisa de token)
app.use('/auth', authRoutes);

// Rotas Protegidas (PRECISAM DE TOKEN)
app.use(authMiddleware, pacientesRoutes);
app.use(authMiddleware, examesRoutes);
app.use(authMiddleware, requisicoeRoutes);
app.use(authMiddleware, resultadosRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: true, message: "Algo deu errado!" });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: true, message: "Rota não encontrada" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 API disponível em: http://localhost:${PORT}`);
    console.log(`🔐 Rotas de Autenticação: http://localhost:${PORT}/auth`);
    console.log(`📋 Usuário Master: admin@local / 123456`);
});
