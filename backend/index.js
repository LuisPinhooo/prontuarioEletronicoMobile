// Configuração de variáveis de ambiente
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar todas as rotas da aplicação
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/auth');
const pacientesRoutes = require('./routes/pacientes');
const examesRoutes = require('./routes/exames');
const requisicoeRoutes = require('./routes/requisicoes');
const resultadosRoutes = require('./routes/resultados');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middlewares de segurança e parsing
app.use(cors()); // Permitir requisições de diferentes origens
app.use(bodyParser.json()); // Parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parsear URL encoded

// Rota de teste para verificar se API está funcionando
app.get("/", (req, res) => {
    res.json({ 
        status: "Ok", 
        message: "API Prontuário Eletrônico funcionando!",
        version: "1.0.0"
    });
});

// Rotas de Autenticação (públicas - não precisam de token)
app.use('/auth', authRoutes);

// Rotas protegidas que requerem token JWT válido
app.use(authMiddleware, pacientesRoutes); // Gerenciar pacientes
app.use(authMiddleware, examesRoutes); // Gerenciar exames
app.use(authMiddleware, requisicoeRoutes); // Gerenciar requisições
app.use(authMiddleware, resultadosRoutes); // Gerenciar resultados

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
