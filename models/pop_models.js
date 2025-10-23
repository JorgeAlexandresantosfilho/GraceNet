const db = require('../config/db');

async function InsertPop(localizacao, ip_gerenciamento) {
    const [result] = await db.query(
        'INSERT INTO pop (localizacao, ip_gerenciamento) VALUES (?, ?);',
        [localizacao, ip_gerenciamento]//insert sendo feito com os parametros corretos
    );
    return result;
}

/*campos do pop para corrigir
id_torre INT AUTO_INCREMENT PRIMARY KEY,
localizacao VARCHAR(255) NOT NULL,
ip_gerenciamento VARCHAR(45) NOT NULL*/ 

async function GetPopBySerial(id_torre) {
    const [result] = await db.query(
        'SELECT * FROM pop WHERE id_torre = ?',
        [id_torre]   //voltando torre ao inves de serial, que estava sendo mais um parametro ficticio
    );
    return rows;
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

module.exports = {
    InsertPop,
    GetPopBySerial,
    UpdatePop,
    GetAllPop
}