const PacienteDAO = require('./DAO/pacienteDAO');

class pacienteController {
    static async listar(req, res) {
        try {
            const pacientes = await PacienteDAO.listar();
            res.status(200).json(pacientes);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar pacientes' });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const paciente = await PacienteDAO.buscarPorId(req.params.id);
            if (paciente) {
                res.status(200).json(paciente);
            } else {
                res.status(404).json({ error: 'Paciente não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar paciente' });
        }
    }

    static async cadastrar(req, res) {
        try {
            console.log(req.body); // Adicione esta linha
            const id = await PacienteDAO.cadastrar(req.body);
            res.status(201).json({ message: 'Paciente cadastrado', id });
        } catch (error) {
             if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Já existe um paciente com este CPF.' });
        } else {
            res.status(500).json({ error: 'Erro ao cadastrar paciente' });
        }
        }
    }

    static async editar(req, res) {
        try {
            const sucesso = await PacienteDAO.editar(req.params.id, req.body);
            if (sucesso) {
                res.status(200).json({ message: 'Paciente atualizado' });
            } else {
                res.status(404).json({ error: 'Paciente não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao editar paciente' });
        }
    }

    static async excluir(req, res) {
        try {
            const sucesso = await PacienteDAO.excluir(req.params.id);
            if (sucesso) {
                res.status(200).json({ message: 'Paciente excluído' });
            } else {
                res.status(404).json({ error: 'Paciente não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao excluir paciente' });
        }
    }
}

module.exports = pacienteController;
