const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ error: true, message: 'Token não fornecido' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: true, message: 'Formato de token inválido' });

    const token = parts[1];
    const secret = process.env.JWT_SECRET || 'changeme_secret';

    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).json({ error: true, message: 'Token inválido ou expirado' });
      // attach user info to request (id, email)
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: true, message: 'Erro interno de autenticação' });
  }
};

module.exports = authMiddleware;
