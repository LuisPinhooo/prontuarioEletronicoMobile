const jwt = require('jsonwebtoken');

// ✅ USAR O MESMO SEGREDO DO AuthController
const JWT_SECRET = process.env.JWT_SECRET || 'meu-segredo-super-seguro-para-prontuario';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    console.log('🔍 Auth Header recebido:', authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ error: true, message: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    
    console.log('🔍 Parts:', parts);
    console.log('🔍 Token extraído:', parts[1]);
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: true, message: 'Formato de token inválido. Esperado: Bearer <token>' });
    }

    const token = parts[1];

    // ✅ USAR JWT_SECRET em vez de 'secret'
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('❌ Erro ao verificar token:', err.message);
        return res.status(401).json({ error: true, message: 'Token inválido ou expirado' });
      }
      
      console.log('✅ Token válido! Usuário:', decoded);
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: true, message: 'Erro interno de autenticação' });
  }
};

module.exports = authMiddleware;
