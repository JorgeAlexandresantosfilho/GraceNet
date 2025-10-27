const db = require('../config/db');

async function InsertCustomer(cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano) {
    const [result] = await db.execute(
        'INSERT INTO clientes (cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano]
    );
    return result;
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
    const sql = `
        UPDATE clientes
        SET nome_completo = ?, telefone = ?, email = ?, cep = ?, rua = ?, numero = ?,
            nome_rede = ?, senha_rede = ?, plano = ?, vencimento = ?, status = ?, id_plano = ?
        WHERE id_cliente = ?;
    `;
    const values = [nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano, id_cliente];
    const [rows] = await db.query(sql, values);
    return rows;
}

async function DeleteCustomer(id) {
    const sql = "UPDATE clientes SET status = 0 WHERE id_cliente = ?"; 
    const [result] = await db.query(sql, [id]);
    return result; 
}
module.exports = {
    InsertCustomer,
    GetAllCustomer,
    GetCustomerById,
    UpdtCustomer,
    DeleteCustomer
};