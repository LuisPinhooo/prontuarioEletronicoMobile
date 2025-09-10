// 1. Importar os módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// 2. Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Configurar o Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 4. Configurar a Conexão com o Banco de Dados MySQL
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prontuario', // Assegure-se que este é o nome correto do seu banco de dados
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // O .promise() permite usar async/await

// 5. Rota Inicial da API
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API do Sistema de Laboratório de Microbiologia - Conectada ao BD' });
});


// --- ROTAS CRUD PARA PACIENTES ---
// ROTA: Buscar todos os pacientes
app.get('/api/pacientes', async (req, res) => {
    try {
        const sql = "SELECT * FROM pacientes ORDER BY nome ASC";
        const [rows] = await dbPool.execute(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
// ROTA: Buscar um paciente pelo ID
app.get('/api/pacientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM pacientes WHERE id = ?';
        const [rows] = await dbPool.execute(sql, [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: `Paciente com ID ${id} não encontrado.` });
        }
    } catch (error) {
        console.error('Erro ao buscar paciente por ID:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
// ROTA: Criar um novo paciente
app.post('/api/pacientes', async (req, res) => {
    const { nome, dataNascimento, email } = req.body;
    const cpf = req.body.cpf ? String(req.body.cpf).replace(/\D/g, '') : null;
    if (!nome || !cpf || !dataNascimento) {
        return res.status(400).json({ message: 'Dados incompletos. Nome, CPF e Data de Nascimento são obrigatórios.' });
    }
    try {
        const sql = 'INSERT INTO pacientes (nome, cpf, data_nascimento, email) VALUES (?, ?, ?, ?)';
        const [result] = await dbPool.execute(sql, [nome, cpf, dataNascimento, email]);
        const novoPaciente = { id: result.insertId, nome, cpf, dataNascimento, email };
        res.status(201).json({ message: 'Paciente cadastrado com sucesso!', paciente: novoPaciente });
    } catch (error) {
        console.error('Erro ao inserir paciente:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
// ROTA PARA ATUALIZAR UM PACIENTE (PUT)
app.put('/api/pacientes/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID da URL
    const { nome, data_nascimento, email } = req.body; // Pega os novos dados do corpo da requisição
    const cpf = req.body.cpf ? String(req.body.cpf).replace(/\D/g, '') : null;

    // Validação simples
    if (!nome || !cpf || !data_nascimento) {
        return res.status(400).json({ message: 'Dados incompletos. Nome, CPF e Data de Nascimento são obrigatórios.' });
    }

    try {
        const sql = 'UPDATE pacientes SET nome = ?, cpf = ?, data_nascimento = ?, email = ? WHERE id = ?';
        const [result] = await dbPool.execute(sql, [nome, cpf, data_nascimento, email, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Paciente com ID ${id} atualizado com sucesso.` });
        } else {
            res.status(404).json({ message: `Paciente com ID ${id} não encontrado.` });
        }
    } catch (error) {
        console.error('Erro ao atualizar paciente:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// ROTA PARA EXCLUIR UM PACIENTE (DELETE)
app.delete('/api/pacientes/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID da URL

    try {
        const sql = 'DELETE FROM pacientes WHERE id = ?';
        const [result] = await dbPool.execute(sql, [id]);

        if (result.affectedRows > 0) {
            // Se uma linha foi afetada, a exclusão funcionou.
            res.status(200).json({ message: `Paciente com ID ${id} excluído com sucesso.` });
        } else {
            // Se nenhuma linha foi afetada, o paciente com aquele ID não foi encontrado.
            res.status(404).json({ message: `Paciente com ID ${id} não encontrado.` });
        }
    } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// --- ROTAS CRUD PARA EXAMES ---
app.post('/api/exames', async (req, res) => {
    const { paciente_id, tipo_exame } = req.body;

    if (!paciente_id || !tipo_exame) {
        return res.status(400).json({ message: 'ID do paciente e tipo de exame são obrigatórios.' });
    }

    let connection;
    try {
        connection = await dbPool.getConnection();
        await connection.beginTransaction();

        const sqlExame = 'INSERT INTO exames (paciente_id, tipo_exame) VALUES (?, ?)';
        const [exameResult] = await connection.execute(sqlExame, [paciente_id, tipo_exame]);
        const novoExameId = exameResult.insertId;

        const sqlDados = 'INSERT INTO analises_dados (exame_id) VALUES (?)';
        await connection.execute(sqlDados, [novoExameId]);

        await connection.commit();

        res.status(201).json({
            message: 'Exame iniciado com sucesso!',
            exame_id: novoExameId
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao iniciar exame:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/exames/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT * FROM exames e
            LEFT JOIN analises_dados ad ON e.id = ad.exame_id
            WHERE e.id = ?
        `;
        const [rows] = await dbPool.execute(sql, [id]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: `Exame com ID ${id} não encontrado.` });
        }
    } catch (error) {
        console.error('Erro ao buscar exame por ID:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

app.put('/api/exames/:id', async (req, res) => {
    const { id } = req.params;
    const dadosFormulario = req.body;

    delete dadosFormulario.salvar_progresso;
    delete dadosFormulario.finalizar_analise;

    const { status, resultado_final, ...dadosAnalise } = dadosFormulario;

    let connection;
    try {
        connection = await dbPool.getConnection();
        await connection.beginTransaction();

        const camposAnaliseParaAtualizar = Object.keys(dadosAnalise);
        if (camposAnaliseParaAtualizar.length > 0) {
            const setClause = camposAnaliseParaAtualizar.map(key => `${key} = ?`).join(', ');
            const values = camposAnaliseParaAtualizar.map(key => dadosAnalise[key]);
            const sqlAnalise = `UPDATE analises_dados SET ${setClause} WHERE exame_id = ?`;
            await connection.execute(sqlAnalise, [...values, id]);
        }

        const camposExameParaAtualizar = [];
        const valoresExameParaAtualizar = [];

        if (status) {
            camposExameParaAtualizar.push('status = ?');
            valoresExameParaAtualizar.push(status);
            if (status === 'finalizado') {
                camposExameParaAtualizar.push('data_finalizado = ?');
                valoresExameParaAtualizar.push(new Date());
            }
        }

        if (resultado_final !== undefined) {
            camposExameParaAtualizar.push('resultado_final = ?');
            valoresExameParaAtualizar.push(resultado_final);
        }

        if (camposExameParaAtualizar.length > 0) {
            const sqlExame = `UPDATE exames SET ${camposExameParaAtualizar.join(', ')} WHERE id = ?`;
            await connection.execute(sqlExame, [...valoresExameParaAtualizar, id]);
        }
        
        await connection.commit();
        res.status(200).json({ message: `Exame com ID ${id} atualizado com sucesso.` });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error(`Erro ao atualizar exame com ID ${id}:`, error);
        res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/api/pacientes/:paciente_id/exames', async (req, res) => {
    const { paciente_id } = req.params;
    try {
        const sql = 'SELECT id, tipo_exame, status, data_inicio, data_finalizado FROM exames WHERE paciente_id = ? ORDER BY data_inicio DESC';
        const [rows] = await dbPool.execute(sql, [paciente_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao listar exames do paciente:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

// 6. Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor da API rodando na porta ${PORT}`);
    console.log(`Acesse em: http://localhost:${PORT}`);
});