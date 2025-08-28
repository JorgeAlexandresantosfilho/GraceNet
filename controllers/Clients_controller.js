const Clients_models = require('../models/Clients_models');

async function CreateCustomer(req, res) {
    const {cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento} = req.body;

    if(!cpf || !nome_completo || !data_nascimento || !rg || !telefone || !email || !cep || !rua || !numero || !nome_rede || !senha_rede || !plano || !vencimento){
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await Clients_models.InsertCustomer(cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento);
        res.status(201).json({ mensagem: 'Cliente inserido com sucesso.', result });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao adicionar cliente.', erro: error.message });
    }
}

async function GetCustomers(req, res){
    try {
        const users = await Clients_models.GetAllCustomer();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ Msg: 'Aconteceu um erro...', error: error.message});
    }
}

async function SearchCustomerById(req, res){
    const id = req.params.id;
    try {
        const user = await Clients_models.GetCustomerById(id);
        if (!user) return res.status(404).json({ Msg: "Cliente não encontrado." });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ Msg: "Erro, aguarde um pouco...", error: error.message });
    }
}

async function UpdateCustomer(req, res) {
    try {
        const { id_cliente, nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status } = req.body;

        const result = await Clients_models.UpdtCustomer(
            id_cliente, nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status
        );

        res.status(200).json({ msg: "Cliente atualizado com sucesso!", result });
    } catch (err) {
        res.status(500).json({ msg: "Erro ao atualizar Cliente.", erro: err.message });
    }
}

async function DeleteCustomer(req, res) {
    const id = req.params.id;
    try {
        const result = await Clients_models.DeleteCustomer(id);
        res.status(200).json({ Msg: "Cliente deletado.", result});
    } catch (error) {
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
