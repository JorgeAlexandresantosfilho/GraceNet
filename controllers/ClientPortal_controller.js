const Clients_models = require('../models/Clients_models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'BRUCE_WAYNE'; 
exports.Login = async (req, res) => {
    try {
        const { cpf, password } = req.body;

        if (!cpf || !password) {
            return res.status(400).json({ message: 'CPF e senha são obrigatórios.' });
        }

        const client = await Clients_models.CheckClientLogin(cpf);

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        
        if (!client.senha_portal) {
            return res.status(403).json({ message: 'Acesso não configurado. Entre em contato com o suporte.' });
        }

        const isMatch = await bcrypt.compare(password, client.senha_portal);

        if (!isMatch) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: client.id_cliente, role: 'client', nome: client.nome_completo },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: client.id_cliente,
                nome: client.nome_completo,
                cpf: client.cpf,
                role: 'client'
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

exports.GetDashboardData = async (req, res) => {
    try {
        const clientId = req.user.id;
        const client = await Clients_models.GetCustomerById(clientId);

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        
        const invoices = [
            { id: 1, vencimento: '2023-11-10', valor: 99.90, status: 'Pago' },
            { id: 2, vencimento: '2023-12-10', valor: 99.90, status: 'Pendente' }
        ];

       

        res.status(200).json({
            client: {
                nome: client.nome_completo,
                plano: client.plano,
                status: client.status,
                vencimento: client.vencimento
            },
            invoices,
            tickets
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard.' });
    }
};
