const pop_models = require('../models/pop_models');


async function InsertPop(req, res) {
    const { localizacao, ip_gerenciamento } = req.body;
    try {
        const result = await pop_models.InsertPop(localizacao, ip_gerenciamento);
        res.status(201).json({ msg: 'POP inserido com sucesso.', result });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao inserir POP.', error: error.message });
    }
}


async function GetPopById(req, res) {
    const { id_torre } = req.params;
    try {
        const result = await pop_models.GetPopById(id_torre);
        if (!result) return res.status(404).json({ msg: 'POP não encontrado.' });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar POP.', error: error.message });
    }
}


async function GetAllPop(req, res) {
    try {
        const result = await pop_models.GetAllPop();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar POPs.', error: error.message });
    }
}


async function UpdatePop(req, res) {
    const { id_torre } = req.params;
    const { localizacao, ip_gerenciamento } = req.body;
    try {
        const result = await pop_models.UpdatePop(id_torre, localizacao, ip_gerenciamento);
        res.status(200).json({ msg: 'POP atualizado com sucesso.', result });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao atualizar POP.', error: error.message });
    }
}

module.exports = {
    InsertPop,
    GetPopById,
    UpdatePop,
    GetAllPop
};
