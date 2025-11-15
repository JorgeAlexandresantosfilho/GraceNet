const perfil_models = require('../models/perfil_models');

async function GetAllPerfis(req, res) {
    try {
        const perfis = await perfil_models.GetAllPerfis();
        return res.status(200).json(perfis); // Retorna o array de perfis
    } catch (error) {
        console.error("ERRO AO BUSCAR PERFIS:", error);
        return res.status(500).json({ msg: 'Erro ao buscar perfis de acesso.', error: error.message });
    }
}

module.exports = {
    GetAllPerfis
};