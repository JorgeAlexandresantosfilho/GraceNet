const db = require('../config/db');

async function addOS(titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) {
    const [result] = await db.query(
        'INSERT INTO suportes (titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico]
    );
    return result;
}


async function GetOS(os_id) {
    const [rows] = await db.query('SELECT * FROM suportes WHERE os_id = ?',
        [os_id]
    );
       return rows;
}

module.exports = {
    addOS,
    GetOS
}