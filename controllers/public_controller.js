const os_models = require('../models/os_models');
const db = require('../config/db');


async function OpenPublicTicket(req, res) {

    const { cpf, titulo, descricao_problema } = req.body;

    if (!cpf || !titulo || !descricao_problema) {
        return res.status(400).json({ Msg: 'CPF, Título e Descrição do Problema são obrigatórios.' });
    }

    try {

        const [rows] = await db.query('SELECT id_cliente FROM clientes WHERE cpf = ?', [cpf]);
        const cliente = rows[0];

        if (!cliente) {
            return res.status(404).json({ Msg: 'CPF não encontrado em nossa base de dados.' });
        }

        const id_cliente = cliente.id_cliente;


        const status = 'Aberto';
        const prioridade = 'Baixa';
        // Format date as YYYY-MM-DD HH:MM:SS
        const now = new Date();
        const inicio_desejado = now.toISOString().slice(0, 19).replace('T', ' ');
        const conclusao_desejada = null;
        const id_tecnico = null;

        console.log("Tentando criar ticket:", { titulo, status, prioridade, inicio_desejado, id_cliente });

        const crtl_result = await os_models.addOS(
            titulo,
            descricao_problema,
            inicio_desejado,
            conclusao_desejada,
            status,
            prioridade,
            id_cliente,
            id_tecnico
        );

        console.log("Ticket criado com sucesso, ID:", crtl_result.insertId);

        return res.status(201).json({ msg: 'Chamado aberto com sucesso! Em breve um técnico entrará em contato.', ticketId: crtl_result.insertId });

    } catch (error) {
        console.error("ERRO AO ABRIR TICKET PÚBLICO:", error);
        return res.status(500).json({ Msg: 'Erro interno ao processar sua solicitação.', error: error.message });
    }
}

module.exports = {
    OpenPublicTicket
};