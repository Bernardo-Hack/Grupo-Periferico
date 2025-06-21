// src/backend/config/db.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_url'];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    console.error(`❌ Variável de ambiente ${varName} não está definida.`);
    process.exit(1); // Encerra o processo se faltar alguma variável
  }
}

let pool: Pool;

try {
  pool = new Pool({
    connectionString: process.env.DB_url,  
    ssl: {
      rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
  });

  // Testa a conexão inicial com o banco de dados (opcional, mas útil)
  pool.query('SELECT NOW()')
    .then(res => {
      console.log('✅ Pool do PostgreSQL conectado com sucesso! Horário do banco:', res.rows[0].now);
    })
    .catch(err => {
      console.error('❌ Erro ao conectar ao PostgreSQL:', err.message);
      // Em um ambiente de produção, você pode querer encerrar o processo se a conexão falhar
      // process.exit(1);
    });

} catch (err: any) {
  console.error('❌ Erro inesperado ao criar o pool do PostgreSQL:', err.message);
  process.exit(1);
}

export default pool;
