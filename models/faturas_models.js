const db = require('../config/db');

async function GetFaturasByClient(id_cliente) {
    const [rows] = await db.query(
        `SELECT * FROM faturas WHERE id_cliente = ? ORDER BY data_vencimento DESC`,
        [id_cliente]
    );
    return rows;
}

async function CreateFatura(id_cliente, valor, data_vencimento, link_boleto) {
    const [result] = await db.query(
        `INSERT INTO faturas (id_cliente, valor, data_vencimento, link_boleto) VALUES (?, ?, ?, ?)`,
        [id_cliente, valor, data_vencimento, link_boleto]
    );
    return result;
}

async function UpdateFaturaStatus(id_fatura, status, data_pagamento = null) {
    const [result] = await db.query(
        `UPDATE faturas SET status = ?, data_pagamento = ? WHERE id_fatura = ?`,
        [status, data_pagamento, id_fatura]
    );
    return result;
}

module.exports = {
    GetFaturasByClient,
    CreateFatura,
    UpdateFaturaStatus
};
