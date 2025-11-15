const user_models = require('../models/user_models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'BRUCE_WAYNE';

async function RegisterUser(req, res) {
    const { nome_completo, matricula, login, senha, perfil_id } = req.body;
    if (!nome_completo || !matricula || !login || !senha) {
        return res.status(400).json({ msg: 'Campos (nome, matricula, login, senha) são obrigatórios.' });
    }
    try {
        const existingLogin = await user_models.FindUserByLogin(login);
        if (existingLogin) {
            return res.status(409).json({ msg: 'Erro: Este Login já está cadastrado.' });
        }
        const existingMatricula = await user_models.FindUserByMatricula(matricula);
        if (existingMatricula) {
            return res.status(409).json({ msg: 'Erro: Esta Matrícula já está cadastrada.' });
        }
        
        const result = await user_models.InsertUser(nome_completo, matricula, login, senha, perfil_id);
        
  
        
        return res.status(201).json({ msg: 'Usuário criado com sucesso.', userId: result.insertId });

    } catch (error) {
        console.error("ERRO AO REGISTRAR USUÁRIO:", error);
        return res.status(500).json({ msg: 'Erro ao registrar usuário.', error: error.message });
    }
}

async function LoginUser(req, res) {
    const { login, senha } = req.body;
    if (!login || !senha) {
        return res.status(400).json({ msg: 'Login e senha são obrigatórios.' });
    }
    try {
        const user = await user_models.FindUserByLogin(login);
        if (!user) {
            return res.status(401).json({ msg: 'Login ou senha inválida.' });
        }
        if (user.status_usuario !== 'Ativo') {
             return res.status(403).json({ msg: 'Este usuário está Inativo ou Bloqueado.' });
        }
        const match = await bcrypt.compare(senha, user.senha_hash);
        if (!match) {
            return res.status(401).json({ msg: 'Login ou senha inválida.' });
        }
        const payload = {
            id: user.usuario_id,
            login: user.login,
            matricula: user.matricula,
            nome: user.nome_completo,
            perfil_id: user.perfil_id
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
        return res.status(200).json({
            msg: 'Login bem-sucedido!',
            token: token,
            user: payload
        });
    } catch (error) {
        console.error("ERRO AO FAZER LOGIN:", error);
        return res.status(500).json({ msg: 'Erro interno no servidor.', error: error.message });
    }
}

async function GetAllUsers(req, res) {
    try {
        const users = await user_models.GetAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error("ERRO AO BUSCAR USUÁRIOS:", error);
        return res.status(500).json({ msg: 'Erro ao buscar usuários.', error: error.message });
    }
}



async function GetAllUsersForAdmin(req, res) {
    try {
        const users = await user_models.GetAllUsersForAdmin();
        return res.status(200).json(users);
    } catch (error) {
        console.error("ERRO AO BUSCAR TODOS OS USUÁRIOS (ADMIN):", error);
        return res.status(500).json({ msg: 'Erro ao buscar usuários.', error: error.message });
    }
}

async function GetUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await user_models.FindUserById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(`ERRO AO BUSCAR USUÁRIO ID ${id}:`, error);
        return res.status(500).json({ msg: 'Erro ao buscar usuário.', error: error.message });
    }
}


async function UpdateUser(req, res) {
    const { id } = req.params;
    const { nome_completo, matricula, login, perfil_id, status_usuario } = req.body;

    if (!nome_completo || !matricula || !login || !status_usuario) {
        return res.status(400).json({ msg: 'Campos (nome, matricula, login, status) são obrigatórios.' });
    }

    try {
        const result = await user_models.UpdateUser(id, nome_completo, matricula, login, perfil_id, status_usuario);
        return res.status(200).json({ msg: 'Usuário atualizado com sucesso.', result });
    } catch (error) {
        console.error(`ERRO AO ATUALIZAR USUÁRIO ID ${id}:`, error);
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ msg: 'Erro: Login ou Matrícula já está em uso por outro usuário.' });
        }
        return res.status(500).json({ msg: 'Erro ao atualizar usuário.', error: error.message });
    }
}


async function DeleteUser(req, res) {
    const { id } = req.params;
    try {
       
        const result = await user_models.DeleteUser(id);
        return res.status(200).json({ msg: 'Usuário inativado com sucesso.', result });
    } catch (error) {
        console.error(`ERRO AO INATIVAR USUÁRIO ID ${id}:`, error);
        return res.status(500).json({ msg: 'Erro ao inativar usuário.', error: error.message });
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetAllUsers,
    GetAllUsersForAdmin, 
    GetUserById,         
    UpdateUser,         
    DeleteUser           
};