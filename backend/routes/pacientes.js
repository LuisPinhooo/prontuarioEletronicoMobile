const express = require('express');
const router = express.Router();
const PacienteController = require('../controllers/PacienteController');

router.get('/getpacientes', PacienteController.listarTodos);
router.get('/getpacientes/:id', PacienteController.buscarPorId);
router.post('/insertpaciente', PacienteController.criar);
router.put('/updatepaciente/:id', PacienteController.atualizar);
router.delete('/deletepaciente/:id', PacienteController.deletar);

module.exports = router;