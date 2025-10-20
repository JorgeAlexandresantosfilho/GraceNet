const pop_models = require('../models/pop_models');

async function InsertPop(req, res) {
    const {serial} = req.body;
    const result = await pop_models.InsertPop(serial);
    res.status(201).json(result);
}


async function GetPopBySerial(req, res) {
    const {serial} = req.params;
    const result = await pop_models.GetPopBySerial(serial);
    res.status(200).json(result);
}


async function GetAllPop(req, res) {
    const result = await pop_models.GetAllPop();
    res.status(200).json(result);
}

async function UpdatePop(req, res) {
    const {serial} = req.params;
    const {localizacao, ip_gerenciamento} = req.body;
    const result = await pop_models.UpdatePop(serial, localizacao, ip_gerenciamento);
    res.status(200).json(result);
}

async function DeletePop(req, res) {
    const {serial} = req.params;
    const result = await pop_models.DeletePop(serial);
    res.status(200).json(result);
}


module.exports = {
    InsertPop,
    GetPopBySerial,
    UpdatePop,
    DeletePop,
    GetAllPop
}