const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function createTable() {
    try {
        const sqlPath = path.join(__dirname, 'create_faturas_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        await db.query(sql);
        console.log('Table `faturas` created successfully.');

        // Insert some dummy data for testing
        console.log('Inserting dummy data...');
        const dummyData = `
            INSERT INTO faturas (id_cliente, valor, data_vencimento, status, link_boleto)
            VALUES 
            (1, 99.90, '2023-12-10', 'Pendente', 'https://example.com/boleto1'),
            (1, 99.90, '2023-11-10', 'Pago', 'https://example.com/boleto2'),
            (2, 149.90, '2023-12-15', 'Pendente', 'https://example.com/boleto3');
        `;
        // We use a try-catch for the insert in case data already exists or foreign keys fail (though id 1 and 2 should exist based on previous dumps)
        try {
            await db.query(dummyData);
            console.log('Dummy data inserted.');
        } catch (err) {
            console.log('Dummy data insertion skipped or failed (maybe already exists):', err.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createTable();
