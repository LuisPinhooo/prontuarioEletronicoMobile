// Importar conexão com banco de dados
const pool = require('../config/database');
// Importar funções para converter snake_case para camelCase
const { convertRowToCamelCase, convertRowsToCamelCase } = require('../helpers/converter');

// Função para listar todas as requisições de exames
exports.listarTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requisicoes ORDER BY id DESC');
    
    res.status(200).json({
      error: false,
      data: convertRowsToCamelCase(result.rows), // ← UMA LINHA SÓ!
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao listar requisições:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar requisições'
    });
  }
};

// Função para buscar uma requisição específica pelo ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM requisicoes WHERE id = $1', [id]);

    // Se requisição não foi encontrada, retorna erro 404
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Requisição não encontrada'
      });
    }

    res.status(200).json({
      error: false,
      requisicao: convertRowToCamelCase(result.rows[0]) // ← UMA LINHA SÓ!
    });
  } catch (error) {
    console.error('Erro ao buscar requisição:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar requisição'
    });
  }
};

// Função para buscar todas as requisições de um paciente específico
exports.buscarPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const result = await pool.query('SELECT * FROM requisicoes WHERE paciente_id = $1 ORDER BY id DESC', [pacienteId]);

    res.status(200).json({
      error: false,
      data: convertRowsToCamelCase(result.rows), // ← UMA LINHA SÓ!
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao buscar requisições do paciente:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar requisições'
    });
  }
};

// Função para criar uma nova requisição de exames para um paciente
exports.criar = async (req, res) => {
  try {
    const { ppacienteId, pexameIds } = req.body;

    // Se paciente ou exames não foram fornecidos, não pode criar requisição
    if (!ppacienteId || !pexameIds || pexameIds.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Paciente e exames são obrigatórios'
      });
    }

    // Verificar se paciente existe antes de criar requisição
    const pacienteExiste = await pool.query('SELECT id FROM pacientes WHERE id = $1', [ppacienteId]);
    if (pacienteExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Paciente não encontrado'
      });
    }

    const result = await pool.query(
      'INSERT INTO requisicoes (paciente_id, exame_ids, status) VALUES ($1, $2, $3) RETURNING *',
      [ppacienteId, JSON.stringify(pexameIds), 'Pendente']
    );

    res.status(201).json({
      error: false,
      message: 'Requisição criada com sucesso',
      requisicao: convertRowToCamelCase(result.rows[0]) // ← UMA LINHA SÓ!
    });
  } catch (error) {
    console.error('❌ Erro ao criar requisição:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao criar requisição'
    });
  }
};

// Função para atualizar uma requisição existente
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { ppacienteId, pexameIds, pstatus } = req.body;

    // Verificar se requisição existe antes de atualizar
    const requisicaoExiste = await pool.query('SELECT id FROM requisicoes WHERE id = $1', [id]);
    if (requisicaoExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Requisição não encontrada'
      });
    }

    const result = await pool.query(
      'UPDATE requisicoes SET paciente_id = $1, exame_ids = $2, status = $3 WHERE id = $4 RETURNING *',
      [ppacienteId, JSON.stringify(pexameIds), pstatus || 'Pendente', id]
    );

    res.status(200).json({
      error: false,
      message: 'Requisição atualizada com sucesso',
      requisicao: convertRowToCamelCase(result.rows[0]) // ← UMA LINHA SÓ!
    });
  } catch (error) {
    console.error('Erro ao atualizar requisição:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao atualizar requisição'
    });
  }
};

// Função para deletar uma requisição
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se requisição existe antes de deletar
    const requisicaoExiste = await pool.query('SELECT id FROM requisicoes WHERE id = $1', [id]);
    if (requisicaoExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Requisição não encontrada'
      });
    }

    await pool.query('DELETE FROM requisicoes WHERE id = $1', [id]);

    res.status(200).json({
      error: false,
      message: 'Requisição removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar requisição:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao deletar requisição'
    });
  }
};
