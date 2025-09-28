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
    const os_id = req.params.os_id;
    try {
        const os = await os_models.GetOS(os_id);
        if (os.length === 0) {
            return res.status(404).json({ Msg: 'Nota não encontrada' });
        }
        return res.status(200).json({ Msg: 'Nota encontrada', data: os[0] });
    } catch (error) {
        return res.status(500).json({ Msg: 'Erro ao procurar pela nota', error: error.message });
    }
}


module.exports = {
    OsAdd,
    GetOS
}