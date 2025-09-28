const plans_models = require('../models/plans_models');

//controller para quando for criado um novo plano
async function planInsert(req, res) {
    const {nomeplano, descricao, velocidade, valor, status} = req.body; //trazendo os dados para gerenciar campos nulos

    if(!nomeplano || !descricao || !velocidade || !valor || !status){
        return res.status(400).json({ Msg: 'Erro é necessário que todos os campos estejam preenchidos' });
    }
    try {
        const ctrl_result = await plans_models.PlanInsert(nomeplano, descricao, velocidade, valor, status);
        return res.status(200).json({ Msg: 'Plano inserido para mais detalhes consulte-o na tela de planos.', ctrl_result });
    } catch (error) {
        return res.status(500).json({Msg: 'Erro ao criar o plano, tente novamente.', error: error.message });
    }
}

async function getAllPlan(req, res) {
    try {
        const plans = await plans_models.GetPlan();
        return res.status(200).json(plans);
    } catch (error) {
        return res.status(500).json({ Msg: 'Erro ao procurar o plano', error: error.message });
    }
}


async function GetPlanName(req, res) {
    const name_plan = req.params.nome_plano
    try {
        const plan = await plans_models.GetPlanName(name_plan);
        return res.status(200).json({ plan })
    } catch (error) {
        return res.status(500).json({ Msg: 'Erro ao achar o plano', error: error.message });
    }
}


async function UpdtPlan(req, res){
        try {
            const {nomeplano, descricao, velocidade, valor, status, id_plano} = req.body;

            const result = await plans_models.PLanAlter(
                 nomeplano, descricao, velocidade, valor, status, id_plano);

                res.status(200).json({ msg: "Plano atualizado com sucesso!", result });
        } catch (error) {
            return res.status(500).json({ Msg: 'Erro ao ataulizar o plano.', error: error.message });
        }
}


async function DeletePlan(req, res) {
    const id_plano = req.params.id_plano;
    try {
        const result = await plans_models.delPlan(id_plano);
        res.status(200).json({ Msg: "Plano deletado.", result });
    } catch (error) {
        res.status(500).json({ Msg: "Erro espere um momento.", error: error.message });
    }
}



module.exports = {
    planInsert,
    GetPlanName,
    UpdtPlan,
    getAllPlan,
    DeletePlan
}