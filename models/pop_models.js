const db = require('../config/db');


async function InsertPop(localizacao, ip_gerenciamento) {
    const [result] = await db.query(
        'INSERT INTO pop (localizacao, ip_gerenciamento) VALUES (?, ?)',
        [localizacao, ip_gerenciamento]
    );
    return result;
}


async function GetPopById(id_torre) {
    const [result] = await db.query(
        'SELECT * FROM pop WHERE id_torre = ?',
        [id_torre]
    );
    return result[0]; 
}


async function GetAllPop() {
    const [result] = await db.query('SELECT * FROM pop');
    return result;
}


async function UpdatePop(id_torre, localizacao, ip_gerenciamento) {
    const [result] = await db.query(
        'UPDATE pop SET localizacao = ?, ip_gerenciamento = ? WHERE id_torre = ?',
        [localizacao, ip_gerenciamento, id_torre]
    );
    return result;
}

module.exports = {
    InsertPop,
    GetPopById,
    UpdatePop,
    GetAllPop
};
