const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'BRUCE_WAYNE';

async function debugLogin() {
    try {
        console.log('--- Starting Login Debug ---');
        const login = 'admin';
        const senha = 'admin123';

        console.log(`Attempting login for: ${login}`);

        // 1. Fetch User
        console.log('1. Fetching user from DB...');
        const [rows] = await db.query(`SELECT * FROM usuarios WHERE login = ?`, [login]);
        const user = rows[0];

        if (!user) {
            console.error('ERROR: User not found!');
            process.exit(1);
        }
        console.log('User found:', { ...user, senha_hash: 'HIDDEN' });
        console.log('Hash length:', user.senha_hash ? user.senha_hash.length : 'NULL');

        // 2. Compare Password
        console.log('2. Comparing password...');
        if (!user.senha_hash) {
            console.error('ERROR: senha_hash is missing!');
            process.exit(1);
        }

        try {
            const match = await bcrypt.compare(senha, user.senha_hash);
            console.log('Password match result:', match);
            if (!match) {
                console.error('ERROR: Password does not match!');
            }
        } catch (bcryptError) {
            console.error('ERROR during bcrypt.compare:', bcryptError);
        }

        // 3. Update Last Login
        console.log('3. Updating last login...');
        try {
            await db.query(`UPDATE usuarios SET ultimo_login = NOW() WHERE usuario_id = ?`, [user.usuario_id]);
            console.log('Last login updated.');
        } catch (dbError) {
            console.error('ERROR during UpdateLastLogin:', dbError);
        }

        // 4. Sign Token
        console.log('4. Signing JWT...');
        try {
            const payload = {
                usuario_id: user.usuario_id,
                nome_completo: user.nome_completo,
                login: user.login,
                matricula: user.matricula,
                perfil_id: user.perfil_id,
                email: user.email,
                telefone: user.telefone,
                foto_perfil: user.foto_perfil,
                ultimo_login: user.ultimo_login
            };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
            console.log('Token generated successfully.');
        } catch (jwtError) {
            console.error('ERROR during jwt.sign:', jwtError);
        }

        console.log('--- Debug Finished ---');
        process.exit(0);

    } catch (error) {
        console.error('CRITICAL ERROR:', error);
        process.exit(1);
    }
}

debugLogin();
