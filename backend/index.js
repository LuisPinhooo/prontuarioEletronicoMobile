const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const pacientesRoutes = require('./routes/pacientes');
const examesRoutes = require('./routes/exames');

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

// Rotas de Pacientes
app.use(pacientesRoutes);

// Rotas de Exames
app.use(examesRoutes);

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
});