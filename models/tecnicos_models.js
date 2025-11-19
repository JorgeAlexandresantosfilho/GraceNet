const db = require('../config/db');

async function InsertTecnico(nome, matricula, equipe, status) {
    const [result] = await db.query(
        'INSERT INTO tecnicos (nome, matricula, equipe, status) VALUES (?, ?, ?, ?)',
        [nome, matricula, equipe, status]
    );
    return result;
}

async function GetAllTecnicos() {
    const [rows] = await db.query('SELECT * FROM tecnicos ORDER BY nome ASC');
    return rows;
}

async function GetTecnicoById(id) {
    const [rows] = await db.query('SELECT * FROM tecnicos WHERE id_tecnico = ?', [id]);
    return rows[0];
}

async function UpdateTecnico(id, nome, matricula, equipe, status) {
    const [result] = await db.query(
        'UPDATE tecnicos SET nome = ?, matricula = ?, equipe = ?, status = ? WHERE id_tecnico = ?',
        [nome, matricula, equipe, status, id]
    );
    return result;
}

async function DeleteTecnico(id) {
    const [result] = await db.query('DELETE FROM tecnicos WHERE id_tecnico = ?', [id]);
    return result;
}

module.exports = {
    InsertTecnico,
    GetAllTecnicos,
    GetTecnicoById,
    UpdateTecnico,
    DeleteTecnico
};
