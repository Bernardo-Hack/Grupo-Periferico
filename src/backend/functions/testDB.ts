import { Router } from 'express';
import pool from '../config/db';

const router = Router();

router.get('/test_db', async (req, res) => {
  try {
    // ALTERAÇÃO 1: A consulta foi trocada para uma função padrão do PostgreSQL.
    // ALTERAÇÃO 2: A desestruturação [rows] foi trocada por { rows }.
    const { rows } = await pool.query('SELECT NOW() AS db_time');

    // Agora 'rows' é um array, e pegamos o primeiro (e único) resultado.
    const result = rows[0]; 
    
    res.status(200).json({ ok: true, result: result });
    
  } catch (error: any) {
    console.error('Falha na conexão de teste com o banco de dados:', error);
    res.status(500).json({ ok: false, error: 'Database connection failed.', details: error.message });
  }
});

export default router;