const equipmov_models = require('../models/equipmov_models');

 async function AddEquipMov(req, res) {
    const {id_cliente, id_equipamento, id_movimento} = req.body;
    try {
        const result = await equipmov_models.AddEquipMov(id_cliente, id_equipamento, id_movimento);
        return res.status(200).json({ msg: 'Sucesso, foi criada a movimentação: ', id_movimento});
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao criar movimentação.', error: error.message });
    }
}

async function GetAllEquipMov(req, res) {
    try {
        const result = await equipmov_models.GetAllEquipMov();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao buscar movimentações.', error: error.message });
    }
}

async function GetEquipMovById(req, res) {
    const {id} = req.params;
    try {
        const result = await equipmov_models.GetEquipMovById(id);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao buscar movimentação por ID.', error: error.message });
    }
}

async function UpdateEquipMov(req, res) {
    const {id} = req.params;
    const {id_cliente, id_equipamento, id_movimento} = req.body;
    try {
        const result = await equipmov_models.UpdateEquipMov(id, id_cliente, id_equipamento, id_movimento);
        return res.status(200).json({ msg: 'Sucesso, foi atualizada a movimentação: ', id_movimento});
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao atualizar movimentação.', error: error.message });
    }
}

async function DeleteEquipMov(req, res) {
    const {id} = req.params;
    try {
        const result = await equipmov_models.DeleteEquipMov(id);
        return res.status(200).json({ msg: 'Sucesso, foi deletada a movimentação: ', id_movimento});
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao deletar movimentação.', error: error.message });
    }
}

module.exports = {
    AddEquipMov,
    GetAllEquipMov,
    GetEquipMovById,
    UpdateEquipMov,
    DeleteEquipMov
}