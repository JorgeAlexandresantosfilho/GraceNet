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

const os_models = require('../models/os_models');
const faturas_models = require('../models/faturas_models');

exports.GetDashboardData = async (req, res) => {
    try {
        const clientId = req.user.id;
        const client = await Clients_models.GetCustomerById(clientId);

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        // Fetch real invoices from database
        const invoices = await faturas_models.GetFaturasByClient(clientId);

        // Take only the last 5 for the dashboard
        const recentInvoices = invoices.slice(0, 5);

        const tickets = await os_models.GetOSByClient(clientId);

        res.status(200).json({
            client: {
                nome: client.nome_completo,
                plano: client.plano,
                status: client.status,
                vencimento: client.vencimento
            },
            invoices: recentInvoices,
            tickets
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados do dashboard.' });
    }
};

exports.GetClientInvoices = async (req, res) => {
    try {
        const clientId = req.user.id;
        const invoices = await faturas_models.GetFaturasByClient(clientId);
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar faturas.' });
    }
};

exports.ActivateAccount = async (req, res) => {
    try {
        const { cpf, data_nascimento, password } = req.body;

        if (!cpf || !data_nascimento || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const client = await Clients_models.CheckClientLogin(cpf);

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }


        const dbDate = new Date(client.data_nascimento).toISOString().split('T')[0];
        const inputDate = new Date(data_nascimento).toISOString().split('T')[0];

        if (dbDate !== inputDate) {
            return res.status(400).json({ message: 'Dados incorretos.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Clients_models.UpdateClientPassword(client.id_cliente, hashedPassword);

        res.status(200).json({ message: 'Conta ativada com sucesso! Faça login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao ativar conta.' });
    }
};

exports.RegisterNewClient = async (req, res) => {
    try {
        const { nome_completo, cpf, data_nascimento, rg, telefone, email, cep, rua, numero, plano, password } = req.body;


        if (!nome_completo || !cpf || !password || !plano) {
            return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
        }

        const existingClient = await Clients_models.CheckClientLogin(cpf);
        if (existingClient) {
            return res.status(400).json({ message: 'CPF já cadastrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const status = 1;
        const nome_rede = 'A Configurar';
        const senha_rede = 'mudar123';
        const vencimento = '10';
        const id_plano = null;
        const latitude = null;
        const longitude = null;

        await Clients_models.InsertCustomer(
            cpf, nome_completo, data_nascimento, rg, telefone, email,
            cep, rua, numero, nome_rede, senha_rede, plano,
            vencimento, status, id_plano, latitude, longitude
        );


        const newClient = await Clients_models.CheckClientLogin(cpf);
        await Clients_models.UpdateClientPassword(newClient.id_cliente, hashedPassword);

        res.status(201).json({ message: 'Cadastro realizado com sucesso! Faça login.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao realizar cadastro.' });
    }
};
