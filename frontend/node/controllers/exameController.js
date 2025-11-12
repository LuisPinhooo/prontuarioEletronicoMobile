const ExameDAO = require('./DAO/exameDAO');

class exameController {
    static async listar(req, res) {
        console.log('Rota /api/exames chamada');
        try {
            const exames = await ExameDAO.listar();
            res.status(200).json(exames);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar exames' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const exame = await ExameDAO.buscarPorId(req.params.id);
            if (exame) {
                res.status(200).json(exame);
            } else {
                res.status(404).json({ error: 'Exame não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar exame' });
        }
    }

    static async cadastrar(req, res) {
        try {
            const id = await ExameDAO.cadastrar(req.body);
            res.status(201).json({ message: 'Exame cadastrado', id });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao cadastrar exame' });
        }
    }

    static async editar(req, res) {
        try {
            const sucesso = await ExameDAO.editar(req.params.id, req.body);
            if (sucesso) {
                res.status(200).json({ message: 'Exame atualizado' });
            } else {
                res.status(404).json({ error: 'Exame não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao editar exame' });
        }
    }

    static async excluir(req, res) {
        try {
            const sucesso = await ExameDAO.excluir(req.params.id);
            if (sucesso) {
                res.status(200).json({ message: 'Exame excluído' });
            } else {
                res.status(404).json({ error: 'Exame não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir exame' });
        }
    }
}

module.exports = exameController;