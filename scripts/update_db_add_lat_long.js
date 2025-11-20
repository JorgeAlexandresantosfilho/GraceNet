const db = require('../config/db');

async function addLatLongColumns() {
    try {
        console.log('Verificando colunas latitude e longitude na tabela clientes...');

        const [columns] = await db.query(`SHOW COLUMNS FROM clientes LIKE 'latitude'`);

        if (columns.length === 0) {
            console.log('Adicionando colunas latitude e longitude...');
            await db.query(`
                ALTER TABLE clientes 
                ADD COLUMN latitude VARCHAR(50) NULL,
                ADD COLUMN longitude VARCHAR(50) NULL;
            `);
            console.log('Colunas adicionadas com sucesso!');
        } else {
            console.log('Colunas já existem.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Erro ao atualizar banco de dados:', error);
        process.exit(1);
    }
}

addLatLongColumns();
