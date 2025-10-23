const pop_models = require('../models/pop_models');

async function InsertPop(req, res) {
    const {localizacao, ip_gerenciamento} = req.body;
    const result = await pop_models.InsertPop(localizacao, ip_gerenciamento);
    res.status(201).json(result);
}


async function GetPopBySerial(req, res) {
    const {id_torre} = req.params;
    const result = await pop_models.GetPopBySerial(id_torre);
    res.status(200).json(result);
}


async function GetAllPop(req, res) {
    const result = await pop_models.GetAllPop();
    res.status(200).json(result);
}

async function UpdatePop(req, res) {
    const {id_torre, localizacao, ip_gerenciamento} = req.body;
    const result = await pop_models.UpdatePop(serial, localizacao, ip_gerenciamento);
    res.status(200).json(result);
}


module.exports = {
    InsertPop,
    GetPopBySerial,
    UpdatePop,
    GetAllPop
}