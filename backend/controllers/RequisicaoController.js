const pool = require('../config/database');
const { convertRowToCamelCase, convertRowsToCamelCase } = require('../helpers/converter');

// LISTAR TODAS AS REQUISIÇÕES
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

// BUSCAR REQUISIÇÃO POR ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM requisicoes WHERE id = $1', [id]);

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

// BUSCAR REQUISIÇÕES POR PACIENTE
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

// CRIAR NOVA REQUISIÇÃO
exports.criar = async (req, res) => {
  try {
    const { ppacienteId, pexameIds } = req.body;

    if (!ppacienteId || !pexameIds || pexameIds.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Paciente e exames são obrigatórios'
      });
    }

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

// ATUALIZAR REQUISIÇÃO
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { ppacienteId, pexameIds, pstatus } = req.body;

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

// DELETAR REQUISIÇÃO
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

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
