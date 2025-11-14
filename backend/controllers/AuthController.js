const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'meu-segredo-super-seguro-para-prontuario';

// Armazenamento temporário de usuários
let users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@local',
    password: bcrypt.hashSync('123456', 10) // ← Usar hashSync em vez de async
  }
];
let nextUserId = 2;

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({
        error: true,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`✅ Login bem-sucedido: ${user.email}`);

    res.status(200).json({
      error: false,
      message: 'Login realizado com sucesso',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      error: true,
      message: 'Erro interno no servidor'
    });
  }
};

// REGISTRO (FUTURO - criar tela de cadastro no frontend)
// Por enquanto, criar usuários via Postman: POST /auth/register
// Body: { "name": "...", "email": "...", "password": "..." }
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Verificar se email já existe
    const emailExiste = users.find(u => u.email === email);
    if (emailExiste) {
      return res.status(400).json({
        error: true,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const novoUsuario = {
      id: nextUserId++,
      name: name,
      email: email,
      password: passwordHash
    };

    users.push(novoUsuario);

    console.log(`✅ Usuário registrado: ${novoUsuario.email}`);

    res.status(201).json({
      error: false,
      message: 'Usuário registrado com sucesso',
      user: {
        id: novoUsuario.id,
        name: novoUsuario.name,
        email: novoUsuario.email
      }
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      error: true,
      message: 'Erro interno no servidor'
    });
  }
};

// VERIFICAR TOKEN (útil para checar se usuário está logado)
exports.verifyToken = (req, res) => {
  // Se chegou aqui, o middleware já validou o token
  res.status(200).json({
    error: false,
    message: 'Token válido',
    user: req.user
  });
};