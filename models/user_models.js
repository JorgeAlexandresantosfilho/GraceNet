const db = require('../config/db');
const bcrypt = require('bcryptjs');

async function InsertUser(nome_completo, matricula, login, senha, perfil_id = null) {
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const [result] = await db.query(
        'INSERT INTO usuarios (nome_completo, matricula, login, senha_hash, perfil_id, status_usuario) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_completo, matricula, login, senha_hash, perfil_id, 'Ativo']
    );
    return result;
}

async function FindUserByLogin(login) {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE login = ?',
        [login]
    );
    return rows[0];
}

async function FindUserByMatricula(matricula) {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE matricula = ?',
        [matricula]
    );
    return rows[0];
}

async function GetAllUsers() {
    const [rows] = await db.query(
        "SELECT usuario_id, nome_completo, perfil_id FROM usuarios WHERE status_usuario = 'Ativo' ORDER BY nome_completo ASC"
    );
    return rows;
}

module.exports = {
    InsertUser,
    FindUserByLogin,
    FindUserByMatricula,
    GetAllUsers 
};