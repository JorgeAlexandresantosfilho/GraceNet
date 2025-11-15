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
        
        
        try {
            await db.query("SELECT senha_hash FROM usuarios LIMIT 1");
        } catch (e) {
            if (e.code === 'ER_BAD_FIELD_ERROR') {
                await db.query("ALTER TABLE usuarios ADD COLUMN senha_hash VARCHAR(255) NOT NULL;");
            }
        }
      
         try {
            await db.query("SELECT status_usuario FROM usuarios LIMIT 1");
        } catch (e) {
            if (e.code === 'ER_BAD_FIELD_ERROR') {
                await db.query("ALTER TABLE usuarios ADD COLUMN status_usuario ENUM('Ativo', 'Inativo', 'Bloqueado') DEFAULT 'Ativo' NOT NULL;");
            }
        }
       
         try {
            await db.query("SELECT senha FROM usuarios LIMIT 1");
            await db.query("ALTER TABLE usuarios DROP COLUMN senha;");
        } catch (e) {
            
        }

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
        console.error("ERRO AO BUSCAR TODOS OS USUÁRIOS:", error);
        return res.status(500).json({ msg: 'Erro ao buscar usuários.', error: error.message });
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetAllUsers 
};