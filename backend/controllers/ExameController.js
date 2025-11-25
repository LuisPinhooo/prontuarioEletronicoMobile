// Importar conexão com banco de dados
const pool = require('../config/database');
// Importar funções para converter snake_case para camelCase
const { convertRowToCamelCase, convertRowsToCamelCase } = require('../helpers/converter');

// Função para listar todos os exames cadastrados
exports.listarTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exames ORDER BY id DESC');
    
    res.status(200).json({
      error: false,
      data: convertRowsToCamelCase(result.rows),
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao listar exames:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar exames'
    });
  }
};

// Função para buscar um exame específico pelo ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM exames WHERE id = $1', [id]);

    // Se exame não foi encontrado, retorna erro 404
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Exame não encontrado'
      });
    }

    res.status(200).json({
      error: false,
      exame: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao buscar exame:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar exame'
    });
  }
};

// Função para criar novo exame na base de dados
exports.criar = async (req, res) => {
  try {
    const { pnome, pdescricao } = req.body;

    // Se nome do exame não foi fornecido, não é possível criar
    if (!pnome) {
      return res.status(400).json({
        error: true,
        message: 'Nome do exame é obrigatório'
      });
    }

    const result = await pool.query(
      'INSERT INTO exames (nome, descricao) VALUES ($1, $2) RETURNING *',
      [pnome, pdescricao]
    );

    res.status(201).json({
      error: false,
      message: 'Exame inserido com sucesso',
      exame: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao criar exame:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao criar exame'
    });
  }
};

// Função para atualizar dados de um exame existente
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { pnome, pdescricao } = req.body;

    // Verificar se exame existe antes de atualizar
    const exameExiste = await pool.query('SELECT id FROM exames WHERE id = $1', [id]);
    if (exameExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Exame não encontrado'
      });
    }

    const result = await pool.query(
      'UPDATE exames SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
      [pnome, pdescricao, id]
    );

    res.status(200).json({
      error: false,
      message: 'Exame atualizado com sucesso',
      exame: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao atualizar exame:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao atualizar exame'
    });
  }
};

// Função para deletar um exame da base de dados
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se exame existe antes de deletar
    const exameExiste = await pool.query('SELECT id FROM exames WHERE id = $1', [id]);
    if (exameExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Exame não encontrado'
      });
    }

    await pool.query('DELETE FROM exames WHERE id = $1', [id]);

    res.status(200).json({
      error: false,
      message: 'Exame removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar exame:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao deletar exame'
    });
  }
};