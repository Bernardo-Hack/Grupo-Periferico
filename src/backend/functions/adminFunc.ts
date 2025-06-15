import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/db'; // Deve ser um pool ou conexão do mysql2/promise
import { comparePassword } from '../utils/encrypt';

const router = Router();

const asyncHandler = (fn: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

declare module 'express-session' {
  interface SessionData {
    adminId?: number;
  }
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  req.session.adminId ? next() : res.redirect('/admin/login');
};

// Rota de login ajustada para MySQL
router.get('/admin/:username/:password', asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.params;

  const [rows]: any = await pool.query(
    'SELECT id, senha_hash FROM Administrador WHERE nome = ?',
    [username]
  );

  if (!rows[0] || !(await comparePassword(password, rows[0].senha_hash))) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  req.session.adminId = rows[0].id;
  res.redirect('/admin/dashboard');
}));

router.get('/admin/logout', (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect('/'));
});

export const loadUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM Usuario ORDER BY nome'
    );

    res.render("admin_dashboard", {
      usuarios: rows || [],
      currentDate: new Date().toLocaleDateString('pt-BR'),
      pageTitle: "Painel Administrativo"
    });
  } catch (error) {
    console.error("Erro completo:", error);
    res.render("admin_dashboard", { usuarios: [] });
  }
});

export const loadDoacao = asyncHandler(async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(`
      SELECT d.id, u.nome, d.valor, d.metodo_pagamento, d.data_doacao
      FROM DoacaoDinheiro d
      JOIN Usuario u ON d.usuario_id = u.id
      ORDER BY d.data_doacao DESC
    `);

    res.render('admin_doacoes', {
      doacoes: rows,
      pageTitle: "Doações em Dinheiro"
    });
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    res.render('admin_doacoes', { doacoes: [] });
  }
});

router.get('/admin/dashboard', adminAuth, loadUser);
router.get('/admin/doacoes', adminAuth, loadDoacao);

export default router;
  