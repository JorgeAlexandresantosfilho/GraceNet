const db = require('../config/db');

async function addOS(titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) {
    const [result] = await db.query(
        'INSERT INTO suportes (titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico]
    );
    return result;
}


async function GetOS(codigo_os) {
    const [rows] = await db.query('SELECT * FROM suportes WHERE codigo_os = ?',
        [codigo_os]
    );
       return rows;
}

async function GetAllOS() {
    const [rows] = await db.query('SELECT * FROM suportes');
    return rows;
}

async function UpdateOS(os_id, titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico)  {
    const [rows] = await db.query('UPDATE suportes SET titulo = ?, descricao_problema = ?, inicio_desejado = ?, conclusao_desejada = ?, status = ?, prioridade = ?, id_cliente = ?, id_tecnico = ? WHERE os_id = ?',
         [titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico, os_id]);
    return rows;
}


module.exports = {
    addOS,
    GetOS,
    GetAllOS,
    UpdateOS
}