const express = require('express');
const router = express.Router();
const ExameController = require('../controllers/ExameController');

router.get('/getexames', ExameController.listarTodos);
router.get('/getexames/:id', ExameController.buscarPorId);
router.post('/insertexame', ExameController.criar);
router.put('/updateexame/:id', ExameController.atualizar);
router.delete('/deleteexame/:id', ExameController.deletar);

module.exports = router;