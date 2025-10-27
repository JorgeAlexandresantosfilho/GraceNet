const plans_models = require('../models/plans_models');

async function planInsert(req, res) {
    const {nomeplano, descricao, velocidade, valor, status} = req.body; 

    if(!nomeplano || !descricao || !velocidade || !valor || status === undefined){
        return res.status(400).json({ Msg: 'Erro é necessário que todos os campos (nomeplano, descricao, velocidade, valor, status) estejam preenchidos' });
    }
    try {
        const ctrl_result = await plans_models.PlanInsert(nomeplano, descricao, velocidade, valor, status);
        return res.status(200).json({ Msg: 'Plano inserido para mais detalhes consulte-o na tela de planos.', ctrl_result });
    } catch (error) {
        console.error("ERRO AO CRIAR PLANO:", error); 
        return res.status(500).json({Msg: 'Erro ao criar o plano, tente novamente.', error: error.message });
    }
}

async function getAllPlan(req, res) {
    try {
        const plans = await plans_models.GetPlan();
        return res.status(200).json(plans);
    } catch (error) {
        console.error("ERRO AO BUSCAR PLANOS:", error);
        return res.status(500).json({ Msg: 'Erro ao procurar o plano', error: error.message });
    }
}


async function GetPlanName(req, res) {
    const name_plan = req.params.nome_plano
    try {
        const plan = await plans_models.GetPlanName(name_plan);
        return res.status(200).json({ plan })
    } catch (error) {
        console.error("ERRO AO BUSCAR PLANO POR NOME:", error); 
        return res.status(500).json({ Msg: 'Erro ao achar o plano', error: error.message });
    }
}


async function UpdtPlan(req, res){
        try {
            const { id } = req.params; 
            
            const {nomeplano, descricao, velocidade, valor, status} = req.body;

            const result = await plans_models.PLanAlter(
                 nomeplano, descricao, velocidade, valor, status, 
                 id 
            );

            res.status(200).json({ msg: "Plano atualizado com sucesso!", result });
        } catch (error) {
            console.error(`ERRO AO ATUALIZAR PLANO ID ${req.params.id}:`, error); 
            return res.status(500).json({ Msg: 'Erro ao ataulizar o plano.', error: error.message });
        }
}


async function DeletePlan(req, res) {
    const { id } = req.params; 
    try {
        const result = await plans_models.delPlan(id); 
        res.status(200).json({ Msg: "Plano deletado.", result });
    } catch (error) {
        console.error(`ERRO AO DELETAR PLANO ID ${req.params.id}:`, error); 
        res.status(500).json({ Msg: "Erro espere um momento...", error: error.message });
    }
}



module.exports = {
    planInsert,
    GetPlanName,
    UpdtPlan,
    getAllPlan,
    DeletePlan
}
