const db = require('../config/db');

async function InsertPop(serial) {
    const [result] = await db.query(
        'INSERT INTO pop (serial) VALUES (?)',
        [serial]
    );
    return result;
}

async function GetPopBySerial(serial) {
    const [result] = await db.query(
        'SELECT * FROM pop WHERE serial = ?',
        [serial]
    );
    return result;
}

async function GetAllPop() {
    const [result] = await db.query(
        'SELECT * FROM pop'
    );
    return result;
}

async function UpdatePop(localizacao, ip_gerenciamento) {
    const [result] = await db.query(
        'UPDATE pop SET localizacao = ?, ip_gerenciamento = ?',
        [localizacao, ip_gerenciamento]
    );
    return result;
}

async function DeletePop(serial) {
    const [result] = await db.query(
        'DELETE FROM pop WHERE serial = ?',
        [serial]
    );
    return result;  
}

module.exports = {
    InsertPop,
    GetPopBySerial,
    UpdatePop,
    DeletePop,
    GetAllPop
    
}