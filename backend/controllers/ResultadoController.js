let resultados = [];
let nextId = 1;

exports.listarTodos = (req, res) => {
    try {
        console.log("Listando resultados");
        res.status(200).json({
            error: false,
            data: resultados,
            total: resultados.length
        });
    } catch (error) {
        console.error("Erro ao buscar resultados: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.buscarPorId = (req, res) => {
    try {
        const { id } = req.params;
        const resultado = resultados.find(r => r.id == id);
        
        if (!resultado) {
            return res.status(404).json({
                error: true, 
                message: "Resultado não encontrado!"
            });
        }
        
        res.status(200).json({
            error: false, 
            resultado: resultado
        });
    } catch (error) {
        console.error("Erro ao buscar resultado: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.buscarPorExame = (req, res) => {
    try {
        const { exameId } = req.params;
        const resExame = resultados.filter(r => r.exameId == exameId);
        
        res.status(200).json({
            error: false, 
            data: resExame,
            total: resExame.length
        });
    } catch (error) {
        console.error("Erro ao buscar resultados do exame: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.criar = (req, res) => {
    try {
        const { pexameId, ppacienteId, pvalores, pobservacoes, pstatus } = req.body;
        
        if (!pexameId || !ppacienteId) {
            return res.status(400).json({
                error: true, 
                message: "Exame ID e Paciente ID são obrigatórios"
            });
        }

        const novoResultado = {
            id: nextId++,
            exameId: pexameId,
            pacienteId: ppacienteId,
            valores: pvalores || '',
            observacoes: pobservacoes || '',
            status: pstatus || 'Processando',
            dataCadastro: new Date().toISOString()
        };

        resultados.push(novoResultado);

        console.log("Resultado inserido: ", novoResultado);

        res.status(201).json({
            error: false, 
            message: "Resultado inserido com sucesso",
            resultado: novoResultado
        });
    } catch (error) {
        console.error("Erro ao inserir resultado: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.atualizar = (req, res) => {
    try {
        const { id } = req.params;
        const { pexameId, ppacienteId, pvalores, pobservacoes, pstatus } = req.body;

        if (!pexameId || !ppacienteId || !id) {
            return res.status(400).json({
                error: true, 
                message: "Informe: id, exameId e pacienteId!"
            });
        }

        const resultadoIndex = resultados.findIndex(r => r.id == id);

        if (resultadoIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Não foi encontrado resultado com esse ID"
            });
        }

        resultados[resultadoIndex] = {
            ...resultados[resultadoIndex],
            exameId: pexameId,
            pacienteId: ppacienteId,
            valores: pvalores || resultados[resultadoIndex].valores,
            observacoes: pobservacoes || resultados[resultadoIndex].observacoes,
            status: pstatus || resultados[resultadoIndex].status,
            dataAtualizacao: new Date().toISOString()
        };

        console.log("Resultado atualizado: ", resultados[resultadoIndex]);

        res.status(200).json({
            error: false, 
            message: "Resultado atualizado com sucesso!", 
            resultado: resultados[resultadoIndex]
        });
    } catch (error) {
        console.error("Erro ao atualizar resultado: ", error);
        res.status(500).json({
            error: true, 
            message: "Ocorreu um erro ao tentar atualizar o resultado!"
        });
    }
};

exports.deletar = (req, res) => {
    try {
        const { id } = req.params;

        const resultadoIndex = resultados.findIndex(r => r.id == id);

        if (resultadoIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Erro ao remover resultado, resultado com o ID não encontrado"
            });
        }

        const resultadoRemovido = resultados.splice(resultadoIndex, 1)[0];

        console.log("Resultado removido: ", resultadoRemovido);

        res.status(200).json({
            error: false, 
            message: "Resultado removido com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao remover resultado: ", error);
        res.status(500).json({
            error: true, 
            message: "Erro ao remover resultado!"
        });
    }
};
