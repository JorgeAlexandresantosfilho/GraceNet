const db = require('../config/db');

async function GetAllPerfis() {
    const [rows] = await db.query(
        'SELECT * FROM perfis_acesso ORDER BY nome_perfil ASC'
    );
    return rows;
}

module.exports = {
    GetAllPerfis
};