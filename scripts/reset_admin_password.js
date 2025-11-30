const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Using bcryptjs as seen in user_controller.js

async function resetAdminPassword() {
    try {
        const newPassword = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const [result] = await db.query(
            "UPDATE usuarios SET senha_hash = ? WHERE login = 'admin'",
            [hashedPassword]
        );

        if (result.affectedRows > 0) {
            console.log('Senha do admin resetada com sucesso para: admin123');
        } else {
            console.log('Usuário admin não encontrado. Criando um novo...');
            // Create if not exists (fallback)
            await db.query(`
                INSERT INTO usuarios(matricula, nome_completo, login, senha_hash, perfil_id, status_usuario)
                VALUES ('000001','Administrador do Sistema','admin', ?, 1, 'Ativo')
            `, [hashedPassword]);
            console.log('Usuário admin criado com senha: admin123');
        }
        process.exit(0);
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        process.exit(1);
    }
}

resetAdminPassword();
