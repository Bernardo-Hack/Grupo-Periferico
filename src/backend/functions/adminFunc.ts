// src/backend/functions/adminFunc.ts

import { Router, Response, NextFunction } from 'express';
import { comparePassword } from '../utils/encrypt';
import { gerarTokenJWT, AuthRequest } from '../utils/jwt';
import pool from '../config/db';

const router = Router();

const asyncHandler = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Middleware para verificar se o usuário autenticado tem o papel ('role') de 'admin'.
 * Este middleware DEVE ser usado SEMPRE DEPOIS do middleware 'verificarToken'.
 */
router.post(
  'check-token',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // O middleware 'verificarToken' já validou o token e anexou os dados em 'req.usuario'
    if (req.usuario && req.usuario.role === 'admin') {
      res.status(200).json({ message: 'Token válido para administrador.' });
    } else {
      res.status(403).json({ error: 'Acesso proibido. Requer privilégios de administrador.' });
    }
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
      res.status(400).json({ error: 'Preencha nome e senha.' });
      return;
    }

    const { rows } = await pool.query(
      'SELECT id, nome, senha_hash FROM administrador WHERE nome = $1',
      [nome]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Nome ou senha inválidos.' });
      return;
    }

    const admin = rows[0];
    const valid = await comparePassword(senha, admin.senha_hash);
    if (!valid) {
      res.status(401).json({ error: 'Nome ou senha inválidos.' });
      return;
    }

    const payload = { id: admin.id, nome: admin.nome, role: 'admin' };
    const token = gerarTokenJWT(payload);

    res.status(200).json({ token: token });
  })
);

// A função de logout não precisa de alterações
export function logoutAdmin(req: AuthRequest, res: Response) {
  res.status(200).json({ message: 'Logout bem-sucedido.' });
}

export default router;