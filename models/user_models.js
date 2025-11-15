const db = require('../config/db');
const bcrypt = require('bcryptjs');


async function InsertUser(nome_completo, matricula, login, senha, perfil_id = null, telefone = null, email = null) {
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    const [result] = await db.query(
        `INSERT INTO usuarios 
        (nome_completo, matricula, login, senha_hash, perfil_id, status_usuario, telefone, email) 
        VALUES (?, ?, ?, ?, ?, 'Ativo', ?, ?)`,
        [nome_completo, matricula, login, senha_hash, perfil_id, telefone, email]
    );

    return result;
}


async function FindUserByLogin(login) {
    const [rows] = await db.query(
        `SELECT * FROM usuarios WHERE login = ?`,
        [login]
    );
    return rows[0];
}


async function FindUserByMatricula(matricula) {
    const [rows] = await db.query(
        `SELECT * FROM usuarios WHERE matricula = ?`,
        [matricula]
    );
    return rows[0];
}


async function GetAllUsers() {
    const [rows] = await db.query(
        `SELECT usuario_id, nome_completo, perfil_id 
         FROM usuarios WHERE status_usuario = 'Ativo'`
    );
    return rows;
}


async function GetAllUsersForAdmin() {
    const [rows] = await db.query(
        `SELECT usuario_id, nome_completo, matricula, login, perfil_id, 
                email, telefone, status_usuario 
         FROM usuarios ORDER BY nome_completo ASC`
    );
    return rows;
}


async function FindUserById(usuario_id) {
    const [rows] = await db.query(
        `SELECT usuario_id, nome_completo, matricula, login, perfil_id, 
                email, telefone, foto_perfil, ultimo_login, status_usuario 
         FROM usuarios WHERE usuario_id = ?`,
        [usuario_id]
    );
    return rows[0];
}


async function UpdateUser(usuario_id, nome_completo, matricula, login, perfil_id, status_usuario, telefone, email, foto_perfil) {
    const [result] = await db.query(
        `UPDATE usuarios SET 
            nome_completo = ?, 
            matricula = ?, 
            login = ?, 
            perfil_id = ?, 
            status_usuario = ?, 
            telefone = ?, 
            email = ?,
            foto_perfil = ?
         WHERE usuario_id = ?`,
        [nome_completo, matricula, login, perfil_id, status_usuario, telefone, email, foto_perfil, usuario_id]
    );

    return result;
}


async function UpdateLastLogin(usuario_id) {
    await db.query(
        `UPDATE usuarios SET ultimo_login = NOW() WHERE usuario_id = ?`,
        [usuario_id]
    );
}


async function ChangePassword(usuario_id, senhaAtual, novaSenha) {
    const [rows] = await db.query(
        `SELECT senha_hash FROM usuarios WHERE usuario_id = ?`,
        [usuario_id]
    );

    if (!rows.length) return false;

    const senhaHashAtual = rows[0].senha_hash;

    const match = await bcrypt.compare(senhaAtual, senhaHashAtual);
    if (!match) return false;

    const salt = await bcrypt.genSalt(10);
    const novaHash = await bcrypt.hash(novaSenha, salt);

    await db.query(
        `UPDATE usuarios SET senha_hash = ? WHERE usuario_id = ?`,
        [novaHash, usuario_id]
    );

    return true;
}

module.exports = {
    InsertUser,
    FindUserByLogin,
    FindUserByMatricula,
    GetAllUsers,
    GetAllUsersForAdmin,
    FindUserById,
    UpdateUser,
    DeleteUser: async function(usuario_id) {
        return await db.query(
            "UPDATE usuarios SET status_usuario = 'Inativo' WHERE usuario_id = ?",
            [usuario_id]
        );
    },
    UpdateLastLogin,
    ChangePassword
};
