let requisicoes = [];
let nextId = 1;

exports.listarTodos = (req, res) => {
    try {
        console.log("Listando requisições");
        res.status(200).json({
            error: false,
            data: requisicoes,
            total: requisicoes.length
        });
    } catch (error) {
        console.error("Erro ao buscar requisições: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.buscarPorId = (req, res) => {
    try {
        const { id } = req.params;
        const requisicao = requisicoes.find(r => r.id == id);
        
        if (!requisicao) {
            return res.status(404).json({
                error: true, 
                message: "Requisição não encontrada!"
            });
        }
        
        res.status(200).json({
            error: false, 
            requisicao: requisicao
        });
    } catch (error) {
        console.error("Erro ao buscar requisição: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.buscarPorPaciente = (req, res) => {
    try {
        const { pacienteId } = req.params;
        const reqsPaciente = requisicoes.filter(r => r.pacienteId == pacienteId);
        
        res.status(200).json({
            error: false, 
            data: reqsPaciente,
            total: reqsPaciente.length
        });
    } catch (error) {
        console.error("Erro ao buscar requisições do paciente: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.criar = (req, res) => {
    try {
        const { ppacienteId, ptipo, pdescricao, pmedico, pprioridade } = req.body;
        
        if (!ppacienteId || !ptipo) {
            return res.status(400).json({
                error: true, 
                message: "Paciente ID e tipo são obrigatórios"
            });
        }

        const novaRequisicao = {
            id: nextId++,
            pacienteId: ppacienteId,
            tipo: ptipo,
            descricao: pdescricao || '',
            medico: pmedico || '',
            prioridade: pprioridade || 'Normal',
            status: 'Pendente',
            dataCadastro: new Date().toISOString()
        };

        requisicoes.push(novaRequisicao);

        console.log("Requisição inserida: ", novaRequisicao);

        res.status(201).json({
            error: false, 
            message: "Requisição inserida com sucesso",
            requisicao: novaRequisicao
        });
    } catch (error) {
        console.error("Erro ao inserir requisição: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.atualizar = (req, res) => {
    try {
        const { id } = req.params;
        const { ppacienteId, ptipo, pdescricao, pmedico, pprioridade, pstatus } = req.body;

        if (!ppacienteId || !ptipo || !id) {
            return res.status(400).json({
                error: true, 
                message: "Informe: id, pacienteId e tipo!"
            });
        }

        const requisicaoIndex = requisicoes.findIndex(r => r.id == id);

        if (requisicaoIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Não foi encontrada requisição com esse ID"
            });
        }

        requisicoes[requisicaoIndex] = {
            ...requisicoes[requisicaoIndex],
            pacienteId: ppacienteId,
            tipo: ptipo,
            descricao: pdescricao || requisicoes[requisicaoIndex].descricao,
            medico: pmedico || requisicoes[requisicaoIndex].medico,
            prioridade: pprioridade || requisicoes[requisicaoIndex].prioridade,
            status: pstatus || requisicoes[requisicaoIndex].status,
            dataAtualizacao: new Date().toISOString()
        };

        console.log("Requisição atualizada: ", requisicoes[requisicaoIndex]);

        res.status(200).json({
            error: false, 
            message: "Requisição atualizada com sucesso!", 
            requisicao: requisicoes[requisicaoIndex]
        });
    } catch (error) {
        console.error("Erro ao atualizar requisição: ", error);
        res.status(500).json({
            error: true, 
            message: "Ocorreu um erro ao tentar atualizar a requisição!"
        });
    }
};

exports.deletar = (req, res) => {
    try {
        const { id } = req.params;

        const requisicaoIndex = requisicoes.findIndex(r => r.id == id);

        if (requisicaoIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Erro ao remover requisição, requisição com o ID não encontrado"
            });
        }

        const requisicaoRemovida = requisicoes.splice(requisicaoIndex, 1)[0];

        console.log("Requisição removida: ", requisicaoRemovida);

        res.status(200).json({
            error: false, 
            message: "Requisição removida com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao remover requisição: ", error);
        res.status(500).json({
            error: true, 
            message: "Erro ao remover requisição!"
        });
    }
};
