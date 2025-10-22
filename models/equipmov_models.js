async function InsertEquipMov(id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao) {
    const [result] = await db.query(
        'INSERT INTO equipmov (id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao) VALUES (?, ?, ?, ?, ?, ?)',
        [id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao]
    );
    return result;
}

async function GetAllEquipMov() {
    const [result] = await db.query(
        'SELECT * FROM equipmov'
    );
    return result;
}

async function GetEquipMovById(id) {
    const [result] = await db.query(
        'SELECT * FROM equipmov WHERE id = ?',
        [id]
    );
    return result;
}

async function UpdateEquipMov(id, id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao) {
    const [result] = await db.query(
        'UPDATE equipmov SET id_equipamento = ?, acao = ?, id_tecnico = ?, usuario_id = ?, data_acao = ?, descricao = ? WHERE id = ?',
        [id_equipamento, acao, id_tecnico, usuario_id, data_acao, descricao, id]
    );
    return result;
}

async function DeleteEquipMov(id) {
    const [result] = await db.query(
        'DELETE FROM equipmov WHERE id = ?',
        [id]
    );
    return result;
}

module.exports = {
    InsertEquipMov,
    GetAllEquipMov,
    GetEquipMovById,
    UpdateEquipMov,
    DeleteEquipMov
}