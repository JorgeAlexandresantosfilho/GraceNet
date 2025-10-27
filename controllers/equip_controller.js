const equip_models = require('../models/equip_models');

async function InsertEquip(req, res) {
    const { tipo, modelo, fabricante, numero_serie, mac_adress, ip_gerenciado, firmware, status, localizacao } = req.body;
    try {
        if (!tipo || !modelo || !numero_serie || !status || !localizacao) {
             return res.status(400).json({ msg: 'Campos tipo, modelo, numero_serie, status e localizacao são obrigatórios.' });
        }
        const result = await equip_models.InsertEquip(tipo, modelo, fabricante || '', numero_serie, mac_adress || '', ip_gerenciado || '', firmware || '', status, localizacao);
        return res.status(200).json({ msg: 'Equipamento inserido com sucesso.', result });
    } catch (error) {
        
        console.error("ERRO AO INSERIR EQUIPAMENTO:", error);
        return res.status(500).json({ msg: 'Erro ao inserir equipamento.', error: error.message });
    }
}

async function GetAllEquip(req, res) {
    try {
        const result = await equip_models.GetAllEquip();
        return res.status(200).json(result);
    } catch (error) {
        console.error("ERRO AO BUSCAR EQUIPAMENTOS:", error);
        return res.status(500).json({ msg: 'Erro ao buscar equipamentos.', error: error.message });
    }
}

async function GetEquipBySerial(req, res) {
    const numero_serie = req.params.numero_serie;
    try {
        const result = await equip_models.GetEquipBySerial(numero_serie);
        if (!result) return res.status(404).json({ msg: 'Equipamento não encontrado.' });
        return res.status(200).json(result); 
    } catch (error) {
        console.error(`ERRO AO BUSCAR EQUIPAMENTO S/N ${numero_serie}:`, error);
        return res.status(500).json({ msg: 'Erro ao buscar equipamento.', error: error.message });
    }
}

async function UpdateEquip(req, res) {
    const numero_serie = req.params.numero_serie;
    const { tipo, modelo, fabricante = '', mac_adress = '', ip_gerenciado = '', firmware = '', status, localizacao } = req.body;
    try {
        if (!tipo || !modelo || !status || !localizacao) {
            return res.status(400).json({ msg: 'Campos tipo, modelo, status e localizacao são obrigatórios para atualização.' });
        }
        const result = await equip_models.UpdateEquip(numero_serie, tipo, modelo, fabricante, mac_adress, ip_gerenciado, firmware, status, localizacao);
        return res.status(200).json({ msg: 'Equipamento atualizado com sucesso.', result });
    } catch (error) {
        console.error(`ERRO AO ATUALIZAR EQUIPAMENTO S/N ${numero_serie}:`, error);
        return res.status(500).json({ msg: 'Erro ao atualizar equipamento.', error: error.message });
    }
}

async function DeleteEquip(req, res) {
    const numero_serie = req.params.numero_serie;
    try {
        const result = await equip_models.DeleteEquip(numero_serie);
        return res.status(200).json({ msg: 'Equipamento deletado com sucesso.', result });
    } catch (error) {
        console.error(`ERRO AO DELETAR EQUIPAMENTO S/N ${numero_serie}:`, error);
         if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
              return res.status(409).json({ msg: 'Não é possível excluir: Equipamento está associado a outros registros.', error: error.message }); // 409 Conflict
         }
        return res.status(500).json({ msg: 'Erro ao deletar equipamento.', error: error.message });
    }
}

module.exports = {
    InsertEquip,
    GetAllEquip,
    GetEquipBySerial,
    UpdateEquip,
    DeleteEquip
};