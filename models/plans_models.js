const db = require('../config/db');

async function PlanInsert(nomeplano, descricao, velocidade, valor, status, atualizado_em, criado_em) {
    const [result] = await db.query(
        'INSERT INTO planos (?,?,?,?,?,?,?);'
        [nomeplano, descricao, velocidade, valor, status, atualizado_em, criado_em]
    );
    return result;
}

async function GetPlan() {
    [row] = await db.query(
        'SELECT * FROM planos'
    );
    return [row];
}

async function PLanAlter(id_cliente, nomeplano, descricao, velocidade, valor, status, atualizado_em) {
    const [rows] = await db.query(`
    UPDATE planos
      SET 
        nome_plano = ?,
        descricao = ?,
        velocidade = ?,
        valor = ?,
        status = ?,
        atualizado_em = ?
    WHERE 
        id_cliente = ?; `,
    [id_cliente, nomeplano, descricao, velocidade, valor, status, atualizado_em]);
    return rows;
}

async function delPlan(id_plano) {
    const [result] = await db.query('DELETE FROM planos WHERE id_plano = ?' [id_plano]);
    return result[0];
}


module.exports = {
    
}