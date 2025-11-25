// Importar biblioteca para verificar tokens JWT
const jwt = require('jsonwebtoken');

// Chave secreta para assinar e verificar tokens JWT
// Deve ser a mesma usada no AuthController
const JWT_SECRET = process.env.JWT_SECRET || 'meu-segredo-super-seguro-para-prontuario';

// Middleware para verificar se o usuário tem um token JWT válido
// Protege rotas que requerem autenticação
const authMiddleware = (req, res, next) => {
  try {
    // Extrair o token do header Authorization
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    console.log('🔍 Auth Header recebido:', authHeader);
    
    // Se header Authorization não foi fornecido, requisição não pode continuar
    if (!authHeader) {
      return res.status(401).json({ error: true, message: 'Token não fornecido' });
    }

    // Separar o tipo de autenticação (Bearer) do token
    const parts = authHeader.split(' ');
    
    console.log('🔍 Parts:', parts);
    console.log('🔍 Token extraído:', parts[1]);
    
    // Se formato não é Bearer <token>, rejeita requisição
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: true, message: 'Formato de token inválido. Esperado: Bearer <token>' });
    }

    // Extrair apenas o token
    const token = parts[1];

    // Verificar se o token é válido usando a mesma chave secreta
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      // Se houver erro na verificação, token é inválido ou expirou
      if (err) {
        console.log('❌ Erro ao verificar token:', err.message);
        return res.status(401).json({ error: true, message: 'Token inválido ou expirado' });
      }
      
      // Token válido, adicionar dados do usuário à requisição
      console.log('✅ Token válido! Usuário:', decoded);
      req.user = decoded; // Armazenar dados do usuário para uso na rota
      next(); // Permitir que a requisição prossiga para a próxima rota
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: true, message: 'Erro interno de autenticação' });
  }
};

module.exports = authMiddleware;
