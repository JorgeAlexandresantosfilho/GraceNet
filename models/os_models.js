const db = require('../config/db');

async function addOS(titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) {
    const [result] = await db.query(
        'INSERT INTO suportes (titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico]
    );
    return result;
}

async function GetOS(codigo_os) {
    const [rows] = await db.query(
        `SELECT s.*, c.nome_completo, c.telefone, c.plano 
         FROM suportes s
         LEFT JOIN clientes c ON s.id_cliente = c.id_cliente
         WHERE s.os_id = ?`,
        [codigo_os]
    );
    return rows[0];
}

async function GetAllOS() {
    const [rows] = await db.query(
       `SELECT s.os_id, s.titulo, s.status, s.prioridade, s.id_cliente, s.id_tecnico,
               s.descricao_problema, s.inicio_desejado, s.conclusao_desejada,
               c.nome_completo, c.telefone, c.plano 
        FROM suportes s
        LEFT JOIN clientes c ON s.id_cliente = c.id_cliente
        ORDER BY s.status ASC, 
                 FIELD(s.prioridade, 'Alta', 'Média', 'Baixa') ASC, 
                 s.os_id DESC`
    );
    return rows;
}

async function UpdateOS(os_id, titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico) {
    const [rows] = await db.query(
        'UPDATE suportes SET titulo = ?, descricao_problema = ?, inicio_desejado = ?, conclusao_desejada = ?, status = ?, prioridade = ?, id_cliente = ?, id_tecnico = ? WHERE os_id = ?',
        [titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico, os_id]
    );
    return rows;
}

module.exports = {
    addOS,
    GetOS,
    GetAllOS,
    UpdateOS
}