const user_models = require('../models/user_models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'BRUCE_WAYNE';


async function RegisterUser(req, res) {
    const { nome_completo, matricula, login, senha, perfil_id, telefone, email } = req.body;

    if (!nome_completo || !matricula || !login || !senha) {
        return res.status(400).json({ msg: 'Campos obrigatórios faltando.' });
    }

    try {
        const existingLogin = await user_models.FindUserByLogin(login);
        if (existingLogin) return res.status(409).json({ msg: 'Login já existe.' });

        const existingMatricula = await user_models.FindUserByMatricula(matricula);
        if (existingMatricula) return res.status(409).json({ msg: 'Matrícula já existe.' });

        const result = await user_models.InsertUser(
            nome_completo,
            matricula,
            login,
            senha,
            perfil_id,
            telefone,
            email
        );

        return res.status(201).json({ msg: 'Usuário criado com sucesso', userId: result.insertId });

    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao registrar usuário.', error });
    }
}


async function LoginUser(req, res) {
    const { login, senha } = req.body;

    try {
        const user = await user_models.FindUserByLogin(login);
        if (!user) return res.status(401).json({ msg: "Login ou senha inválidos." });

        const match = await bcrypt.compare(senha, user.senha_hash);
        if (!match) return res.status(401).json({ msg: "Login ou senha inválidos." });

        await user_models.UpdateLastLogin(user.usuario_id);

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

        return res.json({ token, user: payload });

    } catch (err) {
        return res.status(500).json({ msg: 'Erro interno.', err });
    }
}


async function GetAllUsers(req, res) {
    try {
        const users = await user_models.GetAllUsers();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ msg: "Erro ao buscar usuários.", error });
    }
}


async function GetAllUsersForAdmin(req, res) {
    try {
        const users = await user_models.GetAllUsersForAdmin();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ msg: "Erro ao buscar usuários.", error });
    }
}


async function GetUserById(req, res) {
    try {
        const user = await user_models.FindUserById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'Usuário não encontrado.' });

        return res.json(user);

    } catch (err) {
        return res.status(500).json({ msg: 'Erro interno.', err });
    }
}


async function UpdateUser(req, res) {
    const { id } = req.params;
    const {
        nome_completo,
        matricula,
        login,
        perfil_id,
        status_usuario,
        telefone,
        email,
        foto_perfil
    } = req.body;

    try {
        await user_models.UpdateUser(
            id,
            nome_completo,
            matricula,
            login,
            perfil_id,
            status_usuario,
            telefone,
            email,
            foto_perfil
        );

        return res.json({ msg: "Usuário atualizado com sucesso." });

    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao atualizar usuário.', error });
    }
}


async function ChangePassword(req, res) {
    const { usuario_id, senhaAtual, novaSenha } = req.body;

    try {
        const ok = await user_models.ChangePassword(usuario_id, senhaAtual, novaSenha);

        if (!ok) return res.status(401).json({ msg: "Senha atual incorreta." });

        return res.json({ msg: "Senha alterada com sucesso." });

    } catch {
        return res.status(500).json({ msg: "Erro ao alterar senha." });
    }
}


async function DeleteUser(req, res) {
    try {
        await user_models.DeleteUser(req.params.id);
        return res.json({ msg: "Usuário inativado com sucesso." });

    } catch (error) {
        return res.status(500).json({ msg: "Erro ao inativar usuário.", error });
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetAllUsers,
    GetAllUsersForAdmin,
    GetUserById,
    UpdateUser,
    DeleteUser,
    ChangePassword
};
