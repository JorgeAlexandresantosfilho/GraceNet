const Clients_models = require('../models/Clients_models');

async function CreateCustomer(req, res) {

    const {
        cpf, nome_completo, data_nascimento, telefone, email, plano, vencimento, status
    } = req.body;

    const {
        rg = '',
        cep = '',
        rua = '',
        numero = '',
        nome_rede = '',
        senha_rede = '',
        id_plano = null,
        latitude = null,
        longitude = null
    } = req.body;


    if (!cpf || !nome_completo || !data_nascimento || !telefone || !email || !plano || !vencimento || status === undefined) {
        return res.status(400).json({ mensagem: 'Campos (cpf, nome_completo, data_nascimento, telefone, email, plano, vencimento, status) são obrigatórios.' });
    }
    if (senha_rede && senha_rede < 8) {
        return res.status(400).json({ mensagem: 'Erro: A senha deve ter no mínimo 8 caracteres.' })
    }

    try {
        const result = await Clients_models.InsertCustomer(
            cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero,
            nome_rede, senha_rede,
            plano, vencimento, status,
            id_plano, latitude, longitude
        );
        res.status(201).json({ mensagem: 'Cliente inserido com sucesso.', result });
    } catch (error) {
        console.error("ERRO AO CRIAR CLIENTE:", error);
        res.status(500).json({ mensagem: 'Erro ao adicionar cliente.', erro: error.message });
    }
}

async function GetCustomers(req, res) {
    try {
        const users = await Clients_models.GetAllCustomer();
        res.status(200).json(users);
    } catch (error) {
        console.error("ERRO AO BUSCAR CLIENTES:", error);
        res.status(500).json({ Msg: 'Aconteceu um erro...', error: error.message });
    }
}

async function SearchCustomerById(req, res) {
    const id = req.params.id;//espera o resultado, pede o id ao banco 
    try {
        const user = await Clients_models.GetCustomerById(id);
        if (!user) return res.status(404).json({ Msg: "Cliente não encontrado." });
        res.status(200).json(user);
    } catch (error) {
        console.error(`ERRO AO BUSCAR CLIENTE ID ${id}:`, error);
        res.status(500).json({ Msg: "Erro, aguarde um pouco...", error: error.message });
    }
}


async function UpdateCustomer(req, res) {
    try {
        const { id } = req.params;


        const {
            nome_completo, telefone, email, cep = '', rua = '', numero = '',
            nome_rede = '', senha_rede = '', plano, vencimento, status, id_plano = null,
            latitude = null, longitude = null
        } = req.body;

        const result = await Clients_models.UpdtCustomer(
            id, nome_completo, telefone, email, cep, rua, numero,
            nome_rede, senha_rede,
            plano, vencimento, status, id_plano, latitude, longitude
        );
        res.status(200).json({ msg: "Cliente atualizado com sucesso!", result });
    } catch (err) {
        console.error(`ERRO AO ATUALIZAR CLIENTE ID ${req.params.id}:`, err);
        res.status(500).json({ msg: "Erro ao atualizar Cliente.", erro: err.message });
    }
}



async function DeleteCustomer(req, res) {
    const id = req.params.id;
    try {
        const result = await Clients_models.DeleteCustomer(id);
        res.status(200).json({ Msg: "Cliente deletado.", result });
    } catch (error) {
        console.error(`ERRO AO DELETAR CLIENTE ID ${id}:`, error);
        res.status(500).json({ Msg: "Erro espere um momento...", error: error.message });
    }
}

module.exports = {
    CreateCustomer,
    GetCustomers,
    UpdateCustomer,
    DeleteCustomer,
    SearchCustomerById
};