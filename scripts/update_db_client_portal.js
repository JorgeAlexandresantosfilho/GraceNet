const db = require('../config/db');

async function updateSchema() {
    try {
        console.log('Adding senha_portal column to clientes table...');
        await db.query(`
            ALTER TABLE clientes
            ADD COLUMN senha_portal VARCHAR(255) NULL AFTER senha_rede;
        `);
        console.log('Column added successfully.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column senha_portal already exists.');
        } else {
            console.error('Error updating schema:', error);
        }
    } finally {
        process.exit();
    }
}

updateSchema();
