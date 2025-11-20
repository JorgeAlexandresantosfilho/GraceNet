const db = require('../config/db');

async function GetAllLogs(req, res) {
    try {
        const [rows] = await db.query('SELECT * FROM log ORDER BY data_acao DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error("ERRO AO BUSCAR LOGS:", error);
        res.status(500).json({ mensagem: 'Erro ao buscar logs.', erro: error.message });
    }
}

module.exports = {
    GetAllLogs
};
