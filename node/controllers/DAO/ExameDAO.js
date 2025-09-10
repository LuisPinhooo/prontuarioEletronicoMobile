const dbPool = require('./db');

class ExameDAO {
    static async listar() {
        const [rows] = await dbPool.query('SELECT * FROM exame');
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await dbPool.query('SELECT * FROM exame WHERE id = ?', [id]);
        return rows[0];
    }

    static async cadastrar(exame) {
        const sql = `INSERT INTO exame (nome, descricao) VALUES (?, ?)`;
        const params = [exame.nome, exame.descricao];
        const [result] = await dbPool.query(sql, params);
        return result.insertId;
    }

    static async editar(id, exame) {
        const sql = `UPDATE exame SET nome=?, descricao=? WHERE id=?`;
        const params = [exame.nome, exame.descricao, id];
        const [result] = await dbPool.query(sql, params);
        return result.affectedRows > 0;
    }

    static async excluir(id) {
        const [result] = await dbPool.query('DELETE FROM exame WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ExameDAO;