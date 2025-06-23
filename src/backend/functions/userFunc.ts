// src/backend/functions/userFunc.ts
import { Router, Request, Response, NextFunction } from 'express';
import { gerarTokenJWT, verificarToken, AuthRequest } from '../utils/jwt'; 
import { hashPassword, comparePassword } from '../utils/encrypt';
import pool from '../config/db';

const router = Router();

// Wrapper para capturar erros assíncronos, já ajustado.
const asyncHandler = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// --------- 1) REGISTRO DE USUÁRIO -----------
router.post(
  '/reg_user',
  asyncHandler(async (req, res) => {
    const { nome, cpf, telefone, dt_nasc, senha } = req.body;
    if (!nome || !cpf || !telefone || !dt_nasc || !senha) {
      // CORREÇÃO: 'return' removido
      res.status(400).json({ error: 'Preencha todos os campos.' });
      return; // 'return' sozinho para parar a execução
    }
    const hashed = await hashPassword(senha);

    await pool.query(
      `INSERT INTO usuario (nome, cpf, telefone, senha_hash, data_nascimento, data_cadastro)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [nome, cpf, telefone, hashed, dt_nasc]
    );

    res.status(201).json({ ok: true });
  })
);

// --------- 2) LOGIN DE USUÁRIO -----------
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
      res.status(400).json({ error: 'Preencha nome e senha.' });
      return;
    }

    const { rows } = await pool.query(
      'SELECT id, nome, senha_hash FROM usuario WHERE nome = $1',
      [nome]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Nome ou senha inválidos.' });
      return;
    }

    const user = rows[0];
    const valid = await comparePassword(senha, user.senha_hash);
    if (!valid) {
      res.status(401).json({ error: 'Nome ou senha inválidos.' });
      return;
    }

    const payload = { id: user.id, nome: user.nome, role: 'user' };
    const token = gerarTokenJWT(payload);

    res.status(200).json({ token: token });
  })
);

// --------- 3) LOGOUT DE USUÁRIO -----------
router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({ ok: true, message: 'Logout sinalizado com sucesso.' });
});

// --------- 4) ATUALIZAR PERFIL (Rota Protegida) -----------
router.put(
  '/edt_profile',
  verificarToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.usuario?.id;
    const { nome, telefone, data_nascimento } = req.body;

    await pool.query(
      'UPDATE usuario SET nome = $1, telefone = $2, data_nascimento = $3 WHERE id = $4',
      [nome, telefone, data_nascimento, userId]
    );

    res.status(200).json({ ok: true });
  })
);

// --------- 5) OBTER DADOS DO PERFIL (Rota Protegida) -----------
router.get(
  '/profile',
  verificarToken,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.usuario?.id;

    // Consulta para obter dados do usuário
    const userQuery = await pool.query(
      `SELECT nome, telefone, TO_CHAR(data_cadastro, 'YYYY-MM-DD') AS data_cadastro
       FROM usuario WHERE id = $1`,
      [userId]
    );
    
    if (userQuery.rows.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }
    
    const user = userQuery.rows[0];

    // Consultas paralelas para melhor performance
    const [dinheiroResult, roupaResult, alimentoResult] = await Promise.all([
      pool.query(
        `SELECT id, valor, metodo_pagamento AS metodo, 
                TO_CHAR(data_doacao, 'YYYY-MM-DD HH24:MI:SS') AS data_doacao
         FROM DoacaoDinheiro WHERE usuario_id = $1 ORDER BY data_doacao DESC`,
        [userId]
      ),
      pool.query(
        `SELECT id, tipo AS descricao, quantidade, tamanho, 
                TO_CHAR(data_doacao, 'YYYY-MM-DD HH24:MI:SS') AS data_doacao, descricao
         FROM DoacaoRoupa WHERE usuario_id = $1 ORDER BY data_doacao DESC`,
        [userId]
      ),
      pool.query(
        `SELECT id, tipo AS descricao, quantidade_kg, 
                TO_CHAR(data_doacao, 'YYYY-MM-DD HH24:MI:SS') AS data_doacao
         FROM DoacaoAlimento WHERE usuario_id = $1 ORDER BY data_doacao DESC`,
        [userId]
      )
    ]);

    res.status(200).json({
      user,
      doacoesDinheiro: dinheiroResult.rows,
      doacoesRoupa: roupaResult.rows,
      doacoesAlimento: alimentoResult.rows,
    });
  })
);
// --------- 6) DELETAR CONTA (Rota Protegida) -----------
router.delete(
  '/delete',
  verificarToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.usuario?.id;
    const { senha } = req.body;

    if (!senha) {
      res.status(400).json({ error: 'Senha é obrigatória' });
      return;
    }

    const { rows: userRows } = await pool.query(
      'SELECT id, senha_hash FROM usuario WHERE id = $1',
      [userId]
    );
    
    if (userRows.length === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    const user = userRows[0];
    const valid = await comparePassword(senha, user.senha_hash);
    if (!valid) {
      res.status(401).json({ error: 'Senha incorreta' });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM DoacaoDinheiro WHERE usuario_id = $1', [userId]);
      await client.query('DELETE FROM DoacaoRoupa WHERE usuario_id = $1', [userId]);
      await client.query('DELETE FROM DoacaoAlimento WHERE usuario_id = $1', [userId]);
      await client.query('DELETE FROM usuario WHERE id = $1', [userId]);
      await client.query('COMMIT');

      res.status(200).json({ ok: true, message: 'Conta excluída com sucesso.' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Erro ao deletar conta (transação revertida):', err);
      res.status(500).json({ error: 'Erro interno ao excluir conta.' });
    } finally {
      client.release();
    }
  })
);

export default router;