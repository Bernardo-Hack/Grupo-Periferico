import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false // Adicione esta linha
  }
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('📦 PostgreSQL conectado com sucesso via connectionString!');
    client.release();
  } catch (err) {
    console.error('❌ Erro ao conectar ao PostgreSQL:', (err as Error).message);
  }
})();

export default pool;