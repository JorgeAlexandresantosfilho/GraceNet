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
        //verificando se existe login e matricula
        const existingLogin = await user_models.FindUserByLogin(login);
        if (existingLogin) {
            return res.status(409).json({ msg: 'Erro: Este Login já está cadastrado.' }); // 409 Conflict
        }
        
        //garantino o uso de matricula
        const existingMatricula = await user_models.FindUserByMatricula(matricula); 
        if (existingMatricula) {
            return res.status(409).json({ msg: 'Erro: Esta Matrícula já está cadastrada.' });
        }
        
        //insere o novo usuario
        const result = await user_models.InsertUser(nome_completo, matricula, login, senha, perfil_id);
        
        return res.status(201).json({ msg: 'Usuário criado com sucesso.', userId: result.insertId });

    } catch (error) {
        console.error("ERRO AO REGISTRAR USUÁRIO:", error);
        return res.status(500).json({ msg: 'Erro ao registrar usuário.', error: error.message });
    }
}


async function LoginUser(req, res) {
    //frontend agora vai enviar login e senha
    const { login, senha } = req.body;

    if (!login || !senha) {
        return res.status(400).json({ msg: 'Login e senha são obrigatórios.' });
    }

    try {
        //procura usuario pelo login
        const user = await user_models.FindUserByLogin(login);
        
        //usuario exite?
        if (!user) {
            return res.status(401).json({ msg: 'Login ou senha inválida.' });
        }
        
        //checa status baseado no enum
        if (user.status_usuario !== 'Ativo') {
             return res.status(403).json({ msg: 'Este usuário está Inativo ou Bloqueado.' }); // 403 Forbidden
        }

        //comparar a senha enviada com o hash salvo no banco
        const match = await bcrypt.compare(senha, user.senha_hash);

        if (!match) {
            return res.status(401).json({ msg: 'Login ou senha inválida.' });
        }

        //se a senha bater, criar um Token (JWT)
        const payload = {
            id: user.usuario_id,
            login: user.login,
            matricula: user.matricula,
            nome: user.nome_completo,
            perfil_id: user.perfil_id
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '8h' //token expira em 8 horas
        });

        // 6. Enviar o token para o frontend
        return res.status(200).json({
            msg: 'Login bem-sucedido!',
            token: token,
            user: payload //envia os dados do usuário (sem a senha)
        });

    } catch (error) {
        console.error("ERRO AO FAZER LOGIN:", error);
        return res.status(500).json({ msg: 'Erro interno no servidor.', error: error.message });
    }
}

module.exports = {
    RegisterUser,
    LoginUser
};