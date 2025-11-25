// Importar conexão com banco de dados
const pool = require('../config/database');
// Importar funções para converter snake_case para camelCase
const { convertRowToCamelCase, convertRowsToCamelCase } = require('../helpers/converter');

// Função para listar todos os resultados de exames
exports.listarTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resultados ORDER BY id DESC');
    
    res.status(200).json({
      error: false,
      data: convertRowsToCamelCase(result.rows),
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao listar resultados:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar resultados'
    });
  }
};

// Função para buscar um resultado específico pelo ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM resultados WHERE id = $1', [id]);

    // Se resultado não foi encontrado, retorna erro 404
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Resultado não encontrado'
      });
    }

    res.status(200).json({
      error: false,
      resultado: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao buscar resultado:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar resultado'
    });
  }
};

// Função para buscar todos os resultados de uma requisição específica
exports.buscarPorRequisicao = async (req, res) => {
  try {
    const { requisicaoId } = req.params;
    const result = await pool.query('SELECT * FROM resultados WHERE requisicao_id = $1 ORDER BY id', [requisicaoId]);

    res.status(200).json({
      error: false,
      data: convertRowsToCamelCase(result.rows),
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao buscar resultados da requisição:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar resultados'
    });
  }
};

// Função para criar um novo resultado de exame
exports.criar = async (req, res) => {
  try {
    const { prequisicaoId, pexameId, presultado, pobservacoes } = req.body;

    // Se requisição ou exame não foram fornecidos, não pode criar resultado
    if (!prequisicaoId || !pexameId) {
      return res.status(400).json({
        error: true,
        message: 'Requisição e exame são obrigatórios'
      });
    }

    // Verificar se requisição existe
    const requisicaoExiste = await pool.query('SELECT id FROM requisicoes WHERE id = $1', [prequisicaoId]);
    if (requisicaoExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Requisição não encontrada'
      });
    }

    // Verificar se exame existe
    const exameExiste = await pool.query('SELECT id FROM exames WHERE id = $1', [pexameId]);
    if (exameExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Exame não encontrado'
      });
    }

    const result = await pool.query(
      'INSERT INTO resultados (requisicao_id, exame_id, resultado, observacoes) VALUES ($1, $2, $3, $4) RETURNING *',
      [prequisicaoId, pexameId, presultado, pobservacoes]
    );

    res.status(201).json({
      error: false,
      message: 'Resultado inserido com sucesso',
      resultado: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('❌ Erro ao criar resultado:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao criar resultado'
    });
  }
};

// Função para atualizar um resultado existente
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { presultado, pobservacoes } = req.body;

    // Verificar se resultado existe antes de atualizar
    const resultadoExiste = await pool.query('SELECT id FROM resultados WHERE id = $1', [id]);
    if (resultadoExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Resultado não encontrado'
      });
    }

    const result = await pool.query(
      'UPDATE resultados SET resultado = $1, observacoes = $2 WHERE id = $3 RETURNING *',
      [presultado, pobservacoes, id]
    );

    res.status(200).json({
      error: false,
      message: 'Resultado atualizado com sucesso',
      resultado: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao atualizar resultado:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao atualizar resultado'
    });
  }
};

// Função para deletar um resultado
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se resultado existe antes de deletar
    const resultadoExiste = await pool.query('SELECT id FROM resultados WHERE id = $1', [id]);
    if (resultadoExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Resultado não encontrado'
      });
    }

    await pool.query('DELETE FROM resultados WHERE id = $1', [id]);

    res.status(200).json({
      error: false,
      message: 'Resultado removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar resultado:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao deletar resultado'
    });
  }
};
