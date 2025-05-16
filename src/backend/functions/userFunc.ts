// src/backend/functions/userFunc.ts
import { Router, Request, Response, NextFunction } from 'express';
import pool from '../config/db';                 // seu pool mysql2/promise
import { hashPassword, comparePassword } from '../utils/encrypt';
import { RowDataPacket } from 'mysql2';

const router = Router();

// wrapper para capturar erros async
const asyncHandler = (fn: any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// --------- 1) REGISTRO -----------
router.post(
  '/reg_user',
  asyncHandler(async (req, res) => {
    console.log('🔔 Body em POST /user/reg_user:', req.body);
    const { nome, cpf, telefone, dt_nasc, senha } = req.body;
    if (!nome || !cpf || !telefone || !dt_nasc || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos.' });
    }
    const hashed = await hashPassword(senha);
    await pool.query(
      `INSERT INTO usuario
         (nome, cpf, telefone, senha_hash, data_nascimento, data_cadastro)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nome, cpf, telefone, hashed, dt_nasc]
    );
    return res.status(201).json({ ok: true });
  })
);


// --------- 2) LOGIN -----------
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    console.log('🔔 Body em POST /user/login:', req.body);

    const { nome, senha } = req.body;
    if (!nome || !senha) {
      return res.status(400).json({ error: 'Preencha nome e senha.' });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nome, senha_hash FROM usuario WHERE nome = ?',
      [nome]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }

    const user = rows[0];
    const valid = await comparePassword(senha, user.senha_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Nome ou senha inválidos.' });
    }

    req.session.userId   = user.id;
    req.session.userName = user.nome;
    return res.status(200).json({ ok: true });
  })
);

// Logout do usuário
router.post(
  '/logout',
  asyncHandler(async (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ ok: true });
    });
  })
);

// Retorna os dados do perfil do usuário logado
router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nome, cpf, telefone, data_nascimento FROM usuario WHERE id = ?',
      [req.session.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(rows[0]);
  })
);

// Atualiza os dados do perfil do usuário logado
router.put(
  '/profile',
  asyncHandler(async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { nome, telefone, data_nascimento } = req.body;

    await pool.query(
      'UPDATE usuario SET nome = ?, telefone = ?, data_nascimento = ? WHERE id = ?',
      [nome, telefone, data_nascimento, req.session.userId]
    );

    return res.status(200).json({ ok: true });
  })
);



export default router;
