const dbPool = require('./db');

class PacienteDAO {
    static async listar() {
        const [rows] = await dbPool.query('SELECT * FROM paciente');
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await dbPool.query('SELECT * FROM paciente WHERE id = ?', [id]);
        return rows[0];
    }

    static async editar(id, exame) {
        const sql = `UPDATE exame SET nome=?, descricao=? WHERE id=?`;
        const params = [exame.nome, exame.descricao, id];
        const [result] = await dbPool.query(sql, params);
        return result.affectedRows > 0;
    }

    static async editar(id, paciente) {
        console.log('Chamou editar paciente', id, paciente); // Adicione aqui
        const sql = `UPDATE paciente SET nome=?, nascimento=?, cpf=?, sexo=?, telefone=?, email=?, endereco=?, convenio=?, observacoes=?
                     WHERE id=?`;
        const params = [
            paciente.nome, paciente.nascimento, paciente.cpf, paciente.sexo,
            paciente.telefone, paciente.email, paciente.endereco, paciente.convenio, paciente.observacoes, id
        ];
        const [result] = await dbPool.query(sql, params);
        if (result.affectedRows > 0) {
            console.log(`Paciente editado (ID: ${id}):`, paciente);
        }
        return result.affectedRows > 0;
    }

    static async excluir(id) {
        console.log('Chamou excluir paciente', id); // Adicione aqui
        const [result] = await dbPool.query('DELETE FROM paciente WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            console.log(`Paciente excluído (ID: ${id})`);
        }
        return result.affectedRows > 0;
    }
}

module.exports = PacienteDAO;