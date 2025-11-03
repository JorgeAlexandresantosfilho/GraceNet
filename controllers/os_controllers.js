const os_models = require('../models/os_models');

async function OsAdd(req, res) {

    const { titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico = null } = req.body;
    
   
    if (!titulo || !descricao_problema || !status || !prioridade || !id_cliente) {
        return res.status(400).json({ Msg: 'Campos (titulo, descricao_problema, status, prioridade, id_cliente) são obrigatórios.' });
    }

    try {
        const crtl_result = await os_models.addOS(titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico);
        return res.status(201).json({ msg: 'Sucesso, foi criada a nota.', result: crtl_result });
    } catch (error) {
        console.error("ERRO AO CRIAR SUPORTE:", error); 
        return res.status(500).json({ Msg: 'Erro ao criar nota de suporte.', error: error.message });
    }
}

async function GetOS(req, res) {
    const { os_id } = req.params; 
    try {
        const os = await os_models.GetOS(os_id);
        if (!os) { 
            return res.status(404).json({ Msg: 'Nota não encontrada' });
        }
        return res.status(200).json(os); //retorna o objeto direto
    } catch (error) {
        console.error(`ERRO AO BUSCAR SUPORTE ID ${os_id}:`, error); 
        return res.status(500).json({ Msg: 'Erro ao procurar pela nota', error: error.message });
    }
}

async function GetAllOS(req, res) {
    try {
        const os = await os_models.GetAllOS();
        return res.status(200).json(os); //retorna o array de tickets com join
    } catch (error) {
        console.error("ERRO AO BUSCAR TODOS OS SUPORTES:", error);
        return res.status(500).json({ Msg: 'Erro ao procurar pelas notas', error: error.message });
    }
}

async function UpdateOS(req, res) {

    const { os_id } = req.params; 
    const { titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico = null } = req.body;


     if (!titulo || !descricao_problema || !status || !prioridade || !id_cliente) {
        return res.status(400).json({ Msg: 'Campos (titulo, descricao_problema, status, prioridade, id_cliente) são obrigatórios.' });
    }

    try {
        const os = await os_models.UpdateOS(os_id, titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico);
        return res.status(200).json({ Msg: 'Nota atualizada', data: os });
    }
    catch (error) {
        console.error(`ERRO AO ATUALIZAR SUPORTE ID ${os_id}:`, error); 
        return res.status(500).json({ Msg: 'Erro ao atualizar a nota', error: error.message });
    }
}

module.exports = {
    OsAdd,
    GetOS,
    GetAllOS,
    UpdateOS
};