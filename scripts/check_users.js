const db = require('../config/db');

async function checkUsers() {
    try {
        const [rows] = await db.query("SELECT usuario_id, nome_completo, login, matricula, perfil_id FROM usuarios WHERE login IN ('admin_backup', '620567') OR matricula = '620567'");
        console.log("Users found:", JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkUsers();
