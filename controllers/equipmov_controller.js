const equipmov_models = require('../models/equipmov_models');


async function AddEquipMov(req, res) {
    const { id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao } = req.body;

    if (!id_equipamento || !acao || !id_tecnico || !usuario_id || !data_acao || !descricao) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await equipmov_models.InsertEquipMov(id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao);
        return res.status(201).json({ msg: 'Movimentação registrada com sucesso!', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao criar movimentação.', error: error.message });
    }
}


async function GetAllEquipMov(req, res) {
    try {
        const result = await equipmov_models.GetAllEquipMov();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao buscar movimentações.', error: error.message });
    }
}


async function GetEquipMovById(req, res) {
    const { id } = req.params;
    try {
        const result = await equipmov_models.GetEquipMovById(id);
        if (result.length === 0) return res.status(404).json({ msg: 'Movimentação não encontrada.' });
        return res.status(200).json(result[0]);
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao buscar movimentação.', error: error.message });
    }
}

async function UpdateEquipMov(req, res) {
    const { id } = req.params;
    const { id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao } = req.body;

    try {
        const result = await equipmov_models.UpdateEquipMov(id, id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao);
        return res.status(200).json({ msg: 'Movimentação atualizada com sucesso.', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao atualizar movimentação.', error: error.message });
    }
}


async function DeleteEquipMov(req, res) {
    const { id } = req.params;
    try {
        const result = await equipmov_models.DeleteEquipMov(id);
        return res.status(200).json({ msg: `Movimentação ${id} deletada com sucesso.`, result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao deletar movimentação.', error: error.message });
    }
}

module.exports = {
    AddEquipMov,
    GetAllEquipMov,
    GetEquipMovById,
    UpdateEquipMov,
    DeleteEquipMov
};
