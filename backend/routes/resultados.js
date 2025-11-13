const express = require('express');
const router = express.Router();
const ResultadoController = require('../controllers/ResultadoController');

router.get('/getresultados', ResultadoController.listarTodos);
router.get('/getresultados/:id', ResultadoController.buscarPorId);
router.get('/getresultados/requisicao/:requisicaoId', ResultadoController.buscarPorRequisicao);
router.post('/insertresultado', ResultadoController.criar);
router.put('/updateresultado/:id', ResultadoController.atualizar);
router.delete('/deleteresultado/:id', ResultadoController.deletar);

module.exports = router;