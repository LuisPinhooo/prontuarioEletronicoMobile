const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/auth');

// Rotas públicas (não precisa de token)
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Rota protegida (precisa de token)
router.get('/verify', authMiddleware, AuthController.verifyToken);

module.exports = router;