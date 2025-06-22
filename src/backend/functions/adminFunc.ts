import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import session from 'express-session';
import { compare } from 'bcrypt';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    userName: string;
    isAdmin?: boolean;
  }
}

const router = Router();

const asyncHandler = (fn: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// -------- LOGIN PELO ID --------
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { id, senha } = req.body;

  if (!id || !senha) {
    return res.status(400).json({ error: 'ID e senha são obrigatórios.' });
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id, nome, senha_hash FROM Administrador WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(401).json({ error: 'ID ou senha inválidos.' });
  }

  const adm = rows[0];

  const valid = await compare(senha, adm.senha_hash);
  if (!valid) {
    return res.status(401).json({ error: 'ID ou senha inválidos.' });
  }

  req.session.userId = adm.id;
  req.session.userName = adm.nome;
  req.session.isAdmin = true;

  return res.status(200).json({ ok: true, nome: adm.nome });
}));

// -------- LOGOUT --------
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Erro ao encerrar sessão' });
    res.clearCookie('connect.sid');
    return res.status(200).json({ ok: true });
  });
}));

// -------- CHECK SESSION --------
router.get('/check-session', (req: Request, res: Response) => {
  if (req.session.isAdmin) {
    return res.json({ isAdmin: true });
  }
  return res.status(401).json({ isAdmin: false });
});

export default router;
