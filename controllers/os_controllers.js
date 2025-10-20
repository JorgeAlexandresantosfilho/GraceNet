const os_models = require('../models/os_models');

async function OsAdd(req, res) {
    const {titulo,descricao_problema,inicio_desejado,conclusao_desejada,status,prioridade,id_cliente,id_tecnico} = req.body;
    try {
        const crtl_result = await os_models.addOS(titulo,descricao_problema,inicio_desejado,conclusao_desejada,status,prioridade,id_cliente,id_tecnico);
        return res.status(200).json({ msg: 'Sucesso, foi criada a nota: ', titulo});
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao criar nota de suporte.', error: error.message });
    }
}

async function GetOS(req, res) {
    const codigo_os = req.params.codigo_os;
    try {
        const os = await os_models.GetOS(codigo_os);
        if (os.length === 0) {
            return res.status(404).json({ Msg: 'Nota não encontrada' });
        }
        return res.status(200).json({ Msg: 'Nota encontrada', data: os[0] });
    } catch (error) {
        return res.status(500).json({ Msg: 'Erro ao procurar pela nota', error: error.message });
    }
}

async function GetAllOS(req, res) {
    try {
        const os = await os_models.GetAllOS();
        return res.status(200).json(os);
    } catch (error) {
        return res.status(500).json({ Msg: 'Erro ao procurar pelas notas', error: error.message });
    }
}

async function UpdateOS(req, res) {
    const {os_id, titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico} = req.body;
    try {
        const os = await os_models.UpdateOS(os_id, titulo, descricao_problema, inicio_desejado, conclusao_desejada, status, prioridade, id_cliente, id_tecnico);
        return res.status(200).json({ Msg: 'Nota atualizada', data: os[0] });
    }
    catch (error) {
        return res.status(500).json({ Msg: 'Erro ao atualizar a nota', error: error.message });
    }
}

module.exports = {
    OsAdd,
    GetOS,
    GetAllOS,
    UpdateOS
}