// Importar conexão com banco de dados
const pool = require('../config/database');
// Importar funções para converter snake_case para camelCase
const { convertRowToCamelCase, convertRowsToCamelCase } = require('../helpers/converter');

// Função para listar todos os pacientes cadastrados
exports.listarTodos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pacientes ORDER BY id DESC');
    
    res.status(200).json({
      error: false,
      data: convertRowsToCamelCase(result.rows),
      total: result.rowCount
    });
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar pacientes'
    });
  }
};

// Função para buscar um paciente específico pelo ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pacientes WHERE id = $1', [id]);

    // Se paciente não foi encontrado no banco, retorna erro 404
    if (result.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Paciente não encontrado'
      });
    }

    res.status(200).json({
      error: false,
      paciente: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao buscar paciente'
    });
  }
};

// Função para criar novo paciente na base de dados
exports.criar = async (req, res) => {
  try {
    const {
      pnome,
      pcpf,
      ptelefone,
      pemail,
      pendereco,
      pdataNascimento,
      psexo,
      ppeso,
      paltura,
      phistoricoFamiliar,
      phabitosVida
    } = req.body;

    // Se nome ou CPF não foram fornecidos, não é possível criar o paciente
    if (!pnome || !pcpf) {
      return res.status(400).json({
        error: true,
        message: 'Nome e CPF são obrigatórios'
      });
    }

    // Verificar se CPF já está cadastrado (evita duplicatas)
    const cpfExiste = await pool.query('SELECT id FROM pacientes WHERE cpf = $1', [pcpf]);
    if (cpfExiste.rowCount > 0) {
      return res.status(400).json({
        error: true,
        message: 'CPF já cadastrado'
      });
    }

    const result = await pool.query(
      `INSERT INTO pacientes 
       (nome, cpf, telefone, email, endereco, data_nascimento, sexo, peso, altura, historico_familiar, habitos_vida) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [pnome, pcpf, ptelefone, pemail, pendereco, pdataNascimento, psexo, ppeso, paltura, phistoricoFamiliar, phabitosVida]
    );

    res.status(201).json({
      error: false,
      message: 'Paciente inserido com sucesso',
      paciente: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao criar paciente'
    });
  }
};

// Função para atualizar dados de um paciente existente
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      pnome,
      pcpf,
      ptelefone,
      pemail,
      pendereco,
      pdataNascimento,
      psexo,
      ppeso,
      paltura,
      phistoricoFamiliar,
      phabitosVida
    } = req.body;

    // Verificar se paciente existe antes de atualizar
    const pacienteExiste = await pool.query('SELECT id FROM pacientes WHERE id = $1', [id]);
    if (pacienteExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Paciente não encontrado'
      });
    }

    // Verificar se novo CPF já está cadastrado para outro paciente
    const cpfExiste = await pool.query('SELECT id FROM pacientes WHERE cpf = $1 AND id != $2', [pcpf, id]);
    if (cpfExiste.rowCount > 0) {
      return res.status(400).json({
        error: true,
        message: 'CPF já cadastrado para outro paciente'
      });
    }

    const result = await pool.query(
      `UPDATE pacientes 
       SET nome = $1, cpf = $2, telefone = $3, email = $4, endereco = $5, 
           data_nascimento = $6, sexo = $7, peso = $8, altura = $9, 
           historico_familiar = $10, habitos_vida = $11
       WHERE id = $12
       RETURNING *`,
      [pnome, pcpf, ptelefone, pemail, pendereco, pdataNascimento, psexo, ppeso, paltura, phistoricoFamiliar, phabitosVida, id]
    );

    res.status(200).json({
      error: false,
      message: 'Paciente atualizado com sucesso',
      paciente: convertRowToCamelCase(result.rows[0])
    });
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao atualizar paciente'
    });
  }
};

// Função para deletar um paciente da base de dados
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se paciente existe antes de deletar
    const pacienteExiste = await pool.query('SELECT id FROM pacientes WHERE id = $1', [id]);
    if (pacienteExiste.rowCount === 0) {
      return res.status(404).json({
        error: true,
        message: 'Paciente não encontrado'
      });
    }

    await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);

    res.status(200).json({
      error: false,
      message: 'Paciente removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({
      error: true,
      message: 'Erro ao deletar paciente'
    });
  }
};