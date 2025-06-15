// adminFunc.ts
import { Router, Request, Response, NextFunction } from 'express';
import db from '../config/db';
import { RowDataPacket } from 'mysql2';
import { comparePassword } from '../utils/encrypt';

const router = Router();

// AsyncHandler igual ao userFunc.ts
const asyncHandler = (fn: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Extensão da sessão
declare module 'express-session' {
  interface SessionData {
    adminId?: number;
  }
}

// ========== MIDDLEWARES ==========
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  req.session.adminId ? next() : res.redirect('/admin/login');
};

// ========== ROTAS ADMIN ==========
router.get('/admin/:username/:password', asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.params;

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, senha_hash FROM admin WHERE username = ?',
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

// ========== FUNÇÕES DASHBOARD ==========
export const loadUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const [results] = await db.query<RowDataPacket[]>(
      'SELECT * FROM usuario ORDER BY nome'
    );

    res.render("admin_dashboard", {
      usuarios: results || [],
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
    const [results] = await db.query<RowDataPacket[]>(`
      SELECT d.id, u.nome, d.valor, d.metodo_pagamento, d.data_doacao
      FROM DoacaoDinheiro d
      JOIN Usuario u ON d.usuario_id = u.id
      ORDER BY d.data_doacao DESC
    `);

    res.render('admin_doacoes', {
      doacoes: results,
      pageTitle: "Doações em Dinheiro"
    });
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    res.render('admin_doacoes', { doacoes: [] });
  }
});

// ========== ROTAS PROTEGIDAS ==========
router.get('/admin/dashboard', adminAuth, loadUser);
router.get('/admin/doacoes', adminAuth, loadDoacao);

export default router;