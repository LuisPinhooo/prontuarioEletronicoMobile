let pacientes = [];
let nextId = 1;

exports.listarTodos = (req, res) => {
    try {
        console.log("Listando pacientes");
        res.status(200).json({
            error: false,
            data: pacientes,
            total: pacientes.length
        });
    } catch (error) {
        console.error("Erro ao buscar pacientes: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.buscarPorId = (req, res) => {
    try {
        const { id } = req.params;
        const paciente = pacientes.find(p => p.id == id);
        
        if (!paciente) {
            return res.status(404).json({
                error: true, 
                message: "Paciente não encontrado!"
            });
        }
        
        res.status(200).json({
            error: false, 
            paciente: paciente
        });
    } catch (error) {
        console.error("Erro ao buscar paciente: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.criar = (req, res) => {
    try {
        const { 
            pnome, 
            pcpf, 
            ptelefone, 
            pemail, 
            pendereco, 
            pdataNascimento,
            psexo,
            ppeso,
            paltura,
            phistoricoFamiliar,
            phabitosVida
        } = req.body;
        
        if (!pnome || !pcpf) {
            return res.status(400).json({
                error: true, 
                message: "Nome e CPF são obrigatórios"
            });
        }

        const cpfExiste = pacientes.find(p => p.cpf === pcpf);
        if (cpfExiste) {
            return res.status(400).json({
                error: true, 
                message: "CPF já cadastrado"
            });
        }

        const novoPaciente = {
            id: nextId++,
            nome: pnome,
            cpf: pcpf,
            telefone: ptelefone || '',
            email: pemail || '',
            endereco: pendereco || '',
            dataNascimento: pdataNascimento || '',
            sexo: psexo || '',
            peso: ppeso || '',
            altura: paltura || '',
            historicoFamiliar: phistoricoFamiliar || '',
            habitosVida: phabitosVida || '',
            dataCadastro: new Date().toISOString()
        };

        pacientes.push(novoPaciente);

        console.log("Paciente inserido: ", novoPaciente);

        res.status(201).json({
            error: false, 
            message: "Paciente inserido com sucesso",
            paciente: novoPaciente
        });
    } catch (error) {
        console.error("Erro ao inserir paciente: ", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor" });
    }
};

exports.atualizar = (req, res) => {
    try {
        const { id } = req.params;
        const { pnome, pcpf, ptelefone, pemail, pendereco, pdataNascimento, psexo, ppeso, paltura, phistoricoFamiliar, phabitosVida } = req.body;

        if (!pnome || !pcpf || !id) {
            return res.status(400).json({
                error: true, 
                message: "Informe: id, nome e CPF!"
            });
        }

        const pacienteIndex = pacientes.findIndex(p => p.id == id);

        if (pacienteIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Não foi encontrado paciente com esse ID"
            });
        }

        pacientes[pacienteIndex] = {
            ...pacientes[pacienteIndex],
            nome: pnome,
            cpf: pcpf,
            telefone: ptelefone || pacientes[pacienteIndex].telefone,
            email: pemail || pacientes[pacienteIndex].email,
            endereco: pendereco || pacientes[pacienteIndex].endereco,
            dataNascimento: pdataNascimento || pacientes[pacienteIndex].dataNascimento,
            sexo: psexo || pacientes[pacienteIndex].sexo,
            peso: ppeso || pacientes[pacienteIndex].peso,
            altura: paltura || pacientes[pacienteIndex].altura,
            historicoFamiliar: phistoricoFamiliar || pacientes[pacienteIndex].historicoFamiliar,
            habitosVida: phabitosVida || pacientes[pacienteIndex].habitosVida,
            dataAtualizacao: new Date().toISOString()
        };

        console.log("Paciente atualizado: ", pacientes[pacienteIndex]);

        res.status(200).json({
            error: false, 
            message: "Paciente atualizado com sucesso!", 
            paciente: pacientes[pacienteIndex]
        });
    } catch (error) {
        console.error("Erro ao atualizar paciente: ", error);
        res.status(500).json({
            error: true, 
            message: "Ocorreu um erro ao tentar atualizar o paciente!"
        });
    }
};

exports.deletar = (req, res) => {
    try {
        const { id } = req.params;

        const pacienteIndex = pacientes.findIndex(p => p.id == id);

        if (pacienteIndex === -1) {
            return res.status(404).json({
                error: true, 
                message: "Erro ao remover paciente, paciente com o ID não encontrado"
            });
        }

        const pacienteRemovido = pacientes.splice(pacienteIndex, 1)[0];

        console.log("Paciente removido: ", pacienteRemovido);

        res.status(200).json({
            error: false, 
            message: "Paciente removido com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao remover paciente: ", error);
        res.status(500).json({
            error: true, 
            message: "Erro ao remover paciente!"
        });
    }
};