import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Simba8!#',
  database: 'grupo_periferico',

});


(async () => {
  try {
    const conn = await db.getConnection(); 
    console.log(' MySQL pool conectado com sucesso!');
    conn.release(); 
  } catch (err) {
    console.error('❌ Erro ao conectar ao MySQL:', (err as Error).message);
  }
})();

export default db;
