async function InsertEquip(req, res) {
    const {tipo, modelo, fabricante, numero_serie, mac_adress, ip_gerenciado, firmware, status, localizacao} = req.body;
    try {
        const result = await equip_models.InsertEquip(tipo, modelo, fabricante, numero_serie, mac_adress, ip_gerenciado, firmware, status, localizacao);
        return res.status(200).json({ msg: 'Equipamento inserido com sucesso.', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao inserir equipamento.', error: error.message });
    }
}

async function GetAllEquip(req, res) {
    try {
        const result = await equip_models.GetAllEquip();
        return res.status(200).json({ msg: 'Equipamentos encontrados.', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao buscar equipamentos.', error: error.message });
    }
}

async function GetEquipBySerial(req, res) {
    const numero_serie = req.params.numero_serie;    try {
        const result = await equip_models.GetEquipBySerial(numero_serie);
        return res.status(200).json({ msg: 'Equipamento encontrado.', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao buscar equipamento.', error: error.message });
    }
}

async function UpdateEquip(req, res) {
    const {numero_serie, tipo, modelo, fabricante, mac_adress, ip_gerenciado, firmware, status, localizacao} = req.body;
    try {
        const result = await equip_models.UpdateEquip(numero_serie, tipo, modelo, fabricante, mac_adress, ip_gerenciado, firmware, status, localizacao);                
        return res.status(200).json({ msg: 'Equipamento atualizado com sucesso.', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao atualizar equipamento.', error: error.message });
    }
}

async function DeleteEquip(req, res) {
    const numero_serie = req.params.numero_serie;
    try {
        const result = await equip_models.DeleteEquip(numero_serie);
        return res.status(200).json({ msg: 'Equipamento deletado com sucesso.', result });
    } catch (error) {
        return res.status(500).json({ msg: 'Erro ao deletar equipamento.', error: error.message });     
    }
}

module.exports = {
    InsertEquip,
    GetAllEquip,
    GetEquipBySerial,
    UpdateEquip,
    DeleteEquip
}