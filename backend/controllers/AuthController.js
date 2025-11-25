// Importar bibliotecas para autenticação
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT
const bcrypt = require('bcryptjs'); // Para fazer hash seguro de senhas

// Chave secreta para assinar tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'meu-segredo-super-seguro-para-prontuario';

// Array temporário armazenando usuários (em produção usar banco de dados)
let users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@local',
    password: bcrypt.hashSync('123456', 10) // ← Usar hashSync em vez de async
  }
];
let nextUserId = 2;

// Função para fazer login - autentica usuário e retorna token JWT
exports.login = async (req, res) => {
  try {
    // Extrair email e senha do corpo da requisição
    const { email, password } = req.body;

    // Se email ou senha não foram fornecidos, retorna erro
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário no array pelo email
    const user = users.find(u => u.email === email);
    // Se usuário não existe, retorna erro de credenciais inválidas
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Credenciais inválidas'
      });
    }

    // Comparar senha fornecida com hash armazenado no banco
    const senhaValida = await bcrypt.compare(password, user.password);
    // Se senha está incorreta, retorna erro
    if (!senhaValida) {
      return res.status(401).json({
        error: true,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT com dados do usuário (válido por 24 horas)
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

// Função para registrar novo usuário na aplicação
// Pode ser usado via Postman: POST /auth/register
// Body: { "name": "...", "email": "...", "password": "..." }
exports.register = async (req, res) => {
  try {
    // Extrair dados de cadastro do corpo da requisição
    const { name, email, password } = req.body;

    // Se algum campo obrigatório está vazio, retorna erro
    if (!name || !email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Verificar se email já está cadastrado na base de dados
    const emailExiste = users.find(u => u.email === email);
    if (emailExiste) {
      return res.status(400).json({
        error: true,
        message: 'Email já cadastrado'
      });
    }

    // Criar hash seguro da senha (custo 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar novo objeto de usuário
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

// Função para verificar se um token JWT é válido
// Middleware já validou o token, apenas retorna os dados
exports.verifyToken = (req, res) => {
  // Se chegou aqui, o middleware auth já validou o token com sucesso
  res.status(200).json({
    error: false,
    message: 'Token válido',
    user: req.user
  });
};