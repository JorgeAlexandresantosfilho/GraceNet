const db = require('../config/db');

async function PlanInsert(nomeplano, descricao, velocidade, valor, status) {
    const [result] = await db.query(
        'INSERT INTO planos (nomeplano, descricao, velocidade, valor, status) VALUES (?,?,?,?,?);',
        [nomeplano, descricao, velocidade, valor, status]
    );
    return result;
}

async function GetPlan() {
   const sql = `
    SELECT 
        p.*, 
        (SELECT COUNT(*) FROM clientes c WHERE c.id_plano = p.id_plano) AS clientes_count
    FROM 
        planos p
    GROUP BY
        p.id_plano;
   `;
    const [rows] = await db.query(sql);
    return rows;
}

async function GetPlanName(nome_plano) {
    const sql = `
    SELECT 
        p.*, 
        (SELECT COUNT(*) FROM clientes c WHERE c.id_plano = p.id_plano) AS clientes_count
    FROM 
        planos p
    WHERE
        p.nomeplano LIKE ?
    GROUP BY
        p.id_plano;
    `;
    const [rows] = await db.query(sql, [`%${nome_plano}%`]);
    return rows;
}

async function PLanAlter(nomeplano, descricao, velocidade, valor, status, id_plano) {
    const [rows] = await db.query(`
    UPDATE planos
      SET 
        nomeplano = ?,
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
    const sql = "UPDATE planos SET status = 'Inativo' WHERE id_plano = ?";
    const [result] = await db.query(sql, [id_plano]);
    return result.affectedRows;
}


module.exports = {
    PlanInsert,
    GetPlan,
    PLanAlter,
    delPlan,
    GetPlanName
}
