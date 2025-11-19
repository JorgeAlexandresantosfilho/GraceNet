const tecnicos_models = require('../models/tecnicos_models');

async function InsertTecnico(req, res) {
    const { nome, matricula, equipe, status } = req.body;

    if (!nome || !matricula || !equipe || !status) {
        return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await tecnicos_models.InsertTecnico(nome, matricula, equipe, status);
        res.status(201).json({ msg: 'Técnico cadastrado com sucesso.', result });
    } catch (error) {
        console.error("Erro ao inserir técnico:", error);
        res.status(500).json({ msg: 'Erro ao cadastrar técnico.', error: error.message });
    }
}

async function GetAllTecnicos(req, res) {
    try {
        const tecnicos = await tecnicos_models.GetAllTecnicos();
        res.status(200).json(tecnicos);
    } catch (error) {
        console.error("Erro ao buscar técnicos:", error);
        res.status(500).json({ msg: 'Erro ao buscar técnicos.', error: error.message });
    }
}

async function GetTecnicoById(req, res) {
    const { id } = req.params;
    try {
        const tecnico = await tecnicos_models.GetTecnicoById(id);
        if (!tecnico) {
            return res.status(404).json({ msg: 'Técnico não encontrado.' });
        }
        res.status(200).json(tecnico);
    } catch (error) {
        console.error("Erro ao buscar técnico:", error);
        res.status(500).json({ msg: 'Erro ao buscar técnico.', error: error.message });
    }
}

async function UpdateTecnico(req, res) {
    const { id } = req.params;
    const { nome, matricula, equipe, status } = req.body;

    try {
        const result = await tecnicos_models.UpdateTecnico(id, nome, matricula, equipe, status);
        res.status(200).json({ msg: 'Técnico atualizado com sucesso.', result });
    } catch (error) {
        console.error("Erro ao atualizar técnico:", error);
        res.status(500).json({ msg: 'Erro ao atualizar técnico.', error: error.message });
    }
}

async function DeleteTecnico(req, res) {
    const { id } = req.params;
    try {
        await tecnicos_models.DeleteTecnico(id);
        res.status(200).json({ msg: 'Técnico excluído com sucesso.' });
    } catch (error) {
        console.error("Erro ao excluir técnico:", error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ msg: 'Não é possível excluir este técnico pois ele possui vínculos (OS ou Movimentações).' });
        }
        res.status(500).json({ msg: 'Erro ao excluir técnico.', error: error.message });
    }
}

module.exports = {
    InsertTecnico,
    GetAllTecnicos,
    GetTecnicoById,
    UpdateTecnico,
    DeleteTecnico
};
