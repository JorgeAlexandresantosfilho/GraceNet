const db = require('../config/db');

async function InsertEquip(tipo, modelo, fabricante, numero_serie, mac_adress, ip_gerenciado, firmware, status, localizacao) {
    const [result] = await db.query(
        'INSERT INTO equipamentos (tipo, modelo, fabricante, numero_serie, mac_adress, ip_gerenciado, firmware, status, localizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [tipo, modelo, fabricante, numero_serie, mac_adress, ip_gerenciado, firmware, status, localizacao]
    );
    return result;
}

async function GetAllEquip() {
    const [result] = await db.query('SELECT * FROM equipamentos');
    return result;
}

async function GetEquipBySerial(numero_serie) {
    const [result] = await db.query('SELECT * FROM equipamentos WHERE numero_serie = ?', [numero_serie]);
    return result[0];
}

async function UpdateEquip(numero_serie, tipo, modelo, fabricante, mac_adress, ip_gerenciado, firmware, status, localizacao) {
    const [result] = await db.query(
        'UPDATE equipamentos SET tipo = ?, modelo = ?, fabricante = ?, mac_adress = ?, ip_gerenciado = ?, firmware = ?, status = ?, localizacao = ? WHERE numero_serie = ?',
        [tipo, modelo, fabricante, mac_adress, ip_gerenciado, firmware, status, localizacao, numero_serie]
    );
    return result;
}

async function DeleteEquip(numero_serie) {
    const [result] = await db.query('DELETE FROM equipamentos WHERE numero_serie = ?', [numero_serie]);
    return result;
}

module.exports = {
    InsertEquip,
    GetAllEquip,
    GetEquipBySerial,
    UpdateEquip,
    DeleteEquip
};
