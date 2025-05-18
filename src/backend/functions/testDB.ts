import { Router } from 'express';
import pool from '../config/db';

const router = Router();

router.get('/test_db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.status(200).json({ ok: true, result: rows });
  } catch (error) {
    res.status(500).json({ ok: false, error: 'Database connection failed.' });
  }
});

export default router;