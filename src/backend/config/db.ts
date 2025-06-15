// src/backend/config/db.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`❌ Variável de ambiente ${varName} não está definida.`);
    process.exit(1); // Encerra o processo se faltar alguma variável
  }
}

let pool: mysql.Pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4', // charset recomendado para evitar problemas com emojis e acentos
  });

  // Testa conexão inicial (opcional, mas útil para logs)
  pool.getConnection()
    .then(conn => {
      console.log('✅ MySQL pool conectado com sucesso!');
      conn.release();
    })
    .catch(err => {
      console.error('❌ Erro ao conectar ao MySQL:', err.message);
    });

} catch (err: any) {
  console.error('❌ Erro inesperado ao criar o pool do MySQL:', err.message);
  process.exit(1);
}

export default pool;
