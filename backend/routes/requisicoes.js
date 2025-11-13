const express = require('express');
const router = express.Router();
const RequisicaoController = require('../controllers/RequisicaoController');

router.get('/getrequisicoes', RequisicaoController.listarTodos);
router.get('/getrequisicoes/:id', RequisicaoController.buscarPorId);
router.get('/getrequisicoes/paciente/:pacienteId', RequisicaoController.buscarPorPaciente);
router.post('/insertrequisicao', RequisicaoController.criar);
router.put('/updaterequisicao/:id', RequisicaoController.atualizar);
router.delete('/deleterequisicao/:id', RequisicaoController.deletar);

module.exports = router;
