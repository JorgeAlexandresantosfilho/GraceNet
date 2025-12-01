const db = require('./config/db');

async function checkColumn() {
    try {
        const [rows] = await db.query('SELECT * FROM clientes LIMIT 1');
        console.log('Columns:', Object.keys(rows[0] || {}));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkColumn();
