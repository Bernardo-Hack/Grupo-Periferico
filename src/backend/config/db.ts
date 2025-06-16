const { Client } = require('pg');
require('dotenv').config();  

const db = new Client({
    connectionString: process.env.DB_URL,  
    ssl: {
        rejectUnauthorized: false,  
    },
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err);
        return;
    }
    console.log("Conectado ao PostgreSQL.");
});

module.exports = db;

export default db;
