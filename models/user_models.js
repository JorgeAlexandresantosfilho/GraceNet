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



async function FindUserById(usuario_id) {
    const [rows] = await db.query(
        'SELECT usuario_id, nome_completo, matricula, login, perfil_id, status_usuario FROM usuarios WHERE usuario_id = ?',
        [usuario_id]
    );
    return rows[0];
}


async function GetAllUsersForAdmin() {
    const [rows] = await db.query(
        `SELECT usuario_id, nome_completo, matricula, login, perfil_id, status_usuario 
         FROM usuarios 
         ORDER BY nome_completo ASC`
    );
    return rows;
}


async function UpdateUser(usuario_id, nome_completo, matricula, login, perfil_id, status_usuario) {
    const [result] = await db.query(
        `UPDATE usuarios 
         SET nome_completo = ?, matricula = ?, login = ?, perfil_id = ?, status_usuario = ?
         WHERE usuario_id = ?`,
        [nome_completo, matricula, login, perfil_id, status_usuario, usuario_id]
    );
    return result;
}


async function DeleteUser(usuario_id) {
    const [result] = await db.query(
        "UPDATE usuarios SET status_usuario = 'Inativo' WHERE usuario_id = ?",
        [usuario_id]
    );
    return result;
}

module.exports = {
    InsertUser,
    FindUserByLogin,
    FindUserByMatricula,
    GetAllUsers,
    FindUserById,
    GetAllUsersForAdmin, 
    UpdateUser, 
    DeleteUser  
};