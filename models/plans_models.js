const db = require('../config/db');

async function PlanInsert(nomeplano, descricao, velocidade, valor, status) {
    const [result] = await db.query(
        'INSERT INTO planos (nomeplano, descricao, velocidade, valor, status) VALUES (?,?,?,?,?);',
        [nomeplano, descricao, velocidade, valor, status]
    );
    return result;
}

async function GetPlan() {
   const [rows] = await db.query(
        'SELECT * FROM planos'
    );
    return rows;
}

async function GetPlanName(nome_plano) {
    const [rows] = await db.query('SELECT * FROM planos WHERE nome_plano LIKE ?', [`%${nome_plano}%`]);
    return rows;
}

async function PLanAlter(nomeplano, descricao, velocidade, valor, status, id_plano) {
    const [rows] = await db.query(`
    UPDATE planos
      SET 
        nome_plano = ?,
        descricao = ?,
        velocidade = ?,
        valor = ?,
        status = ?
    WHERE 
        id_plano = ?; `,
    [nomeplano, descricao, velocidade, valor, status, id_plano]);
    return rows;
}

async function delPlan(id_plano) {
    const [result] = await db.query('DELETE FROM planos WHERE id_plano = ?', [id_plano]);
    return result.affectedRows;
}


module.exports = {
    PlanInsert,
    GetPlan,
    PLanAlter,
    delPlan,
    GetPlanName
}