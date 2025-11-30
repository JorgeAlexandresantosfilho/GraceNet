const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function fixPermissions() {
    try {
        console.log("Iniciando correção de permissões...");

        
        const matriculaAlvo = '620567';
        const [result] = await db.query(
            'UPDATE usuarios SET perfil_id = 1 WHERE matricula = ?',
            [matriculaAlvo]
        );

        if (result.affectedRows > 0) {
            console.log(`Sucesso: Usuário com matrícula ${matriculaAlvo} agora é Administrador.`);
        } else {
            console.log(`Aviso: Usuário com matrícula ${matriculaAlvo} não encontrado.`);
        }

        
        const novoAdmin = {
            nome: 'Admin Backup',
            matricula: '999999',
            login: 'admin_backup',
            senha: 'admin123', 
            perfil_id: 1
        };

       
        const [existing] = await db.query('SELECT * FROM usuarios WHERE login = ?', [novoAdmin.login]);

        if (existing.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(novoAdmin.senha, salt);

            await db.query(
                'INSERT INTO usuarios (nome_completo, matricula, login, senha_hash, perfil_id, status_usuario) VALUES (?, ?, ?, ?, ?, ?)',
                [novoAdmin.nome, novoAdmin.matricula, novoAdmin.login, hash, novoAdmin.perfil_id, 'Ativo']
            );
            console.log(`Sucesso: Usuário '${novoAdmin.login}' criado com senha '${novoAdmin.senha}'.`);
        } else {
            console.log(`Aviso: Usuário '${novoAdmin.login}' já existe.`);
        }

        console.log("Concluído.");
        process.exit(0);

    } catch (error) {
        console.error("Erro ao executar script:", error);
        process.exit(1);
    }
}

fixPermissions();
