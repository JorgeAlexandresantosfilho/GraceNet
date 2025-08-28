const db = require('../config/db');

async function InsertCustomer(cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, id_plano) {
    const [result] = await db.execute(
        'CALL sp_cliente_inserir(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, id_plano]
    );
    return result[0];
}

async function GetAllCustomer() {
    const [rows] = await db.query('SELECT * FROM clientes');
    return rows;
}

async function GetCustomerById(id) {
    const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    return rows[0];
}

async function UpdtCustomer(id_cliente, nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano) {
    const [rows] = await db.query(
        'CALL sp_cliente_atualizar(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id_cliente, nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano]
    );
    return rows[0];
}

async function DeleteCustomer(id) {
    const [result] = await db.query('CALL sp_cliente_deletar(?)', [id]);
    return result[0];
}

module.exports = {
    InsertCustomer,
    GetAllCustomer,
    GetCustomerById,
    UpdtCustomer,
    DeleteCustomer
};
