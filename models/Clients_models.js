const db = require('../config/db');

async function InsertCustomer(cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano, latitude, longitude) {
    const [result] = await db.execute(
        'INSERT INTO clientes (cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [cpf, nome_completo, data_nascimento, rg, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano, latitude, longitude]
    );
    return result;
}

async function GetAllCustomer() {
    const [rows] = await db.query('SELECT * FROM clientes ORDER BY id_cliente DESC');
    return rows;
}

async function GetCustomerById(id) {
    const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    return rows[0];
}

async function UpdtCustomer(id_cliente, nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano, latitude, longitude) {
    const sql = `
        UPDATE clientes
        SET nome_completo = ?, telefone = ?, email = ?, cep = ?, rua = ?, numero = ?,
            nome_rede = ?, senha_rede = ?, plano = ?, vencimento = ?, status = ?, id_plano = ?,
            latitude = ?, longitude = ?
        WHERE id_cliente = ?;
    `;
    const values = [nome_completo, telefone, email, cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano, latitude, longitude, id_cliente];
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
    DeleteCustomer,
    CheckClientLogin,
    UpdateClientPassword
};

async function CheckClientLogin(cpf) {
    const [rows] = await db.query('SELECT * FROM clientes WHERE cpf = ?', [cpf]);
    return rows[0];
}

async function UpdateClientPassword(id, newPassword) {
    const [result] = await db.query('UPDATE clientes SET senha_portal = ? WHERE id_cliente = ?', [newPassword, id]);
    return result;
}