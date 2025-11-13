let exames = [];
let nextId = 1;

exports.listarTodos = (req, res) => {
    try {
        console.log("Listando exames");
        res.status(200).json({
            error: false,
            data: exames,
            total: exames.length
        });
    } catch (error) {
        console.error("Erro ao buscar exames: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.buscarPorId = (req, res) => {
    try {
        const { id } = req.params;
        const exame = exames.find(e => e.id == id);
        
        if (!exame) {
            return res.status(404).json({
                error: true, 
                message: "Exame não encontrado!"
            });
        }
        
        res.status(200).json({
            error: false, 
            exame: exame
        });
    } catch (error) {
        console.error("Erro ao buscar exame: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.criar = (req, res) => {
    try {
        const { pnome, pdescricao } = req.body;
        
        if (!pnome) {
            return res.status(400).json({
                error: true, 
                message: "Nome do exame é obrigatório"
            });
        }

        const novoExame = {
            id: nextId++,
            nome: pnome,
            descricao: pdescricao || '',
            dataCadastro: new Date().toISOString()
        };

        exames.push(novoExame);

        console.log("Exame inserido: ", novoExame);

        res.status(201).json({
            error: false, 
            message: "Exame inserido com sucesso",
            exame: novoExame
        });
    } catch (error) {
        console.error("Erro ao inserir exame: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.atualizar = (req, res) => {
    try {
        const { id } = req.params;
        const { pnome, pdescricao } = req.body;

        if (!pnome || !id) {
            return res.status(400).json({
                error: true, 
                message: "Informe: id e nome do exame!"
            });
        }

        const exameIndex = exames.findIndex(e => e.id == id);

        if (exameIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Não foi encontrado exame com esse ID"
            });
        }

        exames[exameIndex] = {
            ...exames[exameIndex],
            nome: pnome,
            descricao: pdescricao || exames[exameIndex].descricao,
            dataAtualizacao: new Date().toISOString()
        };

        console.log("Exame atualizado: ", exames[exameIndex]);

        res.status(200).json({
            error: false, 
            message: "Exame atualizado com sucesso!", 
            exame: exames[exameIndex]
        });
    } catch (error) {
        console.error("Erro ao atualizar exame: ", error);
        res.status(500).json({
            error: true, 
            message: "Ocorreu um erro ao tentar atualizar o exame!"
        });
    }
};

exports.deletar = (req, res) => {
    try {
        const { id } = req.params;

        const exameIndex = exames.findIndex(e => e.id == id);

        if (exameIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Erro ao remover exame, exame com o ID não encontrado"
            });
        }

        const exameRemovido = exames.splice(exameIndex, 1)[0];

        console.log("Exame removido: ", exameRemovido);

        res.status(200).json({
            error: false, 
            message: "Exame removido com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao remover exame: ", error);
        res.status(500).json({
            error: true, 
            message: "Erro ao remover exame!"
        });
    }
};