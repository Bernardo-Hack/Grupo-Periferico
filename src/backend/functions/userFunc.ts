import { Router, Request, Response, NextFunction } from 'express';
import db from '../config/db';
import { hashPassword, comparePassword } from '../utils/encrypt';

const router = Router();

const asyncHandler = (fn: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Registro de usuário
router.post(
  '/reg_user',
  asyncHandler(async (req, res) => {
    const { nome, cpf, telefone, dt_nasc, senha } = req.body;
    
    if (!nome || !cpf || !telefone || !dt_nasc || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }
    
    const hashed = await hashPassword(senha);
    
    await db.query(
      `INSERT INTO Usuario
         (nome, cpf, telefone, senha_hash, data_nascimento, data_cadastro)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nome, cpf, telefone, hashed, dt_nasc]
    );
    
    return res.status(201).json({ ok: true });
  })
);

// Login de usuário
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ error: 'Preencha nome e senha.' });
    }

    const [rows]: any = await db.query(
      'SELECT id, nome, senha_hash FROM Usuario WHERE nome = ?',
      [nome]
    );
    
    if (!rows[0] || !(await comparePassword(senha, rows[0].senha_hash))) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }

    req.session.userId = rows[0].id;
    req.session.userName = rows[0].nome;
    return res.status(200).json({ ok: true });
  })
);

// Logout
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    req.session.destroy(() => res.redirect('/'));
    res.clearCookie('connect.sid');
  })
);

// Atualização de perfil
router.put(
  '/edt_profile',
  asyncHandler(async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { nome, telefone, data_nascimento } = req.body;

    await db.query(
      'UPDATE Usuario SET nome = ?, telefone = ?, data_nascimento = ? WHERE id = ?',
      [nome, telefone, data_nascimento, req.session.userId]
    );

    return res.status(200).json({ ok: true });
  })
);

// Carregamento de perfil
router.get(
  '/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    const [userRows]: any = await db.query(
      `SELECT nome, telefone, DATE_FORMAT(data_cadastro, '%Y-%m-%d') AS data_cadastro
       FROM Usuario
       WHERE id = ?`,
      [userId]
    );
    const user = userRows[0];
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const [donRows]: any = await db.query(
      `SELECT id, valor, metodo_pagamento AS metodo,
        DATE_FORMAT(data_doacao, '%Y-%m-%d %H:%i:%s') AS data_doacao
       FROM DoacaoDinheiro
       WHERE usuario_id = ?
       ORDER BY data_doacao DESC`,
      [userId]
    );
    const doacoes = donRows;

    return res.status(200).json({
      user,
      doacoes
    });
  })
);

export default router;
