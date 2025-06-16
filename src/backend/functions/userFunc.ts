// src/backend/functions/userFunc.ts
import { Router, Request, Response, NextFunction } from 'express';
import { hashPassword, comparePassword } from '../utils/encrypt';
import pool from '../config/db'; // Agora aponta para o pool do PostgreSQL
import Swal from 'sweetalert2';

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
       VALUES ($1, $2, $3, $4, $5, NOW())`,
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

    // ALTERAÇÃO: Desestruturação { rows } e placeholder $1
    const { rows } = await pool.query(
      'SELECT id, nome, senha_hash FROM usuario WHERE nome = $1',
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


// Atualiza os dados do perfil do usuário logado
router.put(
  '/edt_profile',
  asyncHandler(async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { nome, telefone, data_nascimento } = req.body;

    // ALTERAÇÃO: Placeholders
    await pool.query(
      'UPDATE usuario SET nome = $1, telefone = $2, data_nascimento = $3 WHERE id = $4',
      [nome, telefone, data_nascimento, req.session.userId]
    );

    return res.status(200).json({ ok: true });
  })
);

const handleLogout = async () => {
  try {
    const res = await fetch('http://localhost:5000/user/logout', {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Erro ao fazer logout');
    }

    Swal.fire({
      icon: 'success',
      title: 'Logout realizado!',
      showConfirmButton: false,
      timer: 1500
    });

    // Navegação para /login deve ser feita no frontend após logout bem-sucedido
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao sair',
      text: err.message || 'Falha ao fazer logout',
    });
  }
};


router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado.' });
    }

    // ALTERAÇÃO: 'DATE_FORMAT' (MySQL) trocado por 'TO_CHAR' (PostgreSQL).
    // ALTERAÇÃO: Desestruturação { rows: userRows } e placeholder $1.
    const { rows: userRows } = await pool.query(
      `SELECT nome, telefone, TO_CHAR(data_cadastro, 'YYYY-MM-DD') AS data_cadastro
       FROM usuario WHERE id = $1`,
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const user = userRows[0];

    // Buscando as doações e formatando a data com TO_CHAR
    const { rows: doacoesDinheiro } = await pool.query(
      `SELECT 'dinheiro' AS tipo, id, valor, metodo_pagamento AS metodo, TO_CHAR(data_doacao, 'YYYY-MM-DD HH24:MI:SS') AS data_doacao
       FROM DoacaoDinheiro WHERE usuario_id = $1 ORDER BY data_doacao DESC`,
      [userId]
    );
    const { rows: doacoesRoupa } = await pool.query(
      `SELECT 'roupa' AS tipo, id, tipo AS descricao, quantidade, tamanho, TO_CHAR(data_doacao, 'YYYY-MM-DD HH24:MI:SS') AS data_doacao
       FROM DoacaoRoupa WHERE usuario_id = $1 ORDER BY data_doacao DESC`,
      [userId]
    );
    const { rows: doacoesAlimento } = await pool.query(
      `SELECT 'alimento' AS tipo, id, tipo AS descricao, quantidade_kg, TO_CHAR(data_doacao, 'YYYY-MM-DD HH24:MI:SS') AS data_doacao
       FROM DoacaoAlimento WHERE usuario_id = $1 ORDER BY data_doacao DESC`,
      [userId]
    );


    return res.status(200).json({
      user,
      doacoesDinheiro,
      doacoesRoupa,
      doacoesAlimento
    });
  })
);


router.delete(
  '/delete',
  asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { senha } = req.body;
    if (!senha) {
      return res.status(400).json({ error: 'Senha é obrigatória' });
    }

    // ALTERAÇÃO: Buscar o usuário para verificar a senha com a sintaxe do PostgreSQL.
    // Placeholder '?' trocado por '$1' e desestruturação de resultado '[userRows]' por '{ rows: userRows }'.
    const { rows: userRows } = await pool.query(
      'SELECT id, senha_hash FROM usuario WHERE id = $1',
      [userId]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userRows[0];
    const valid = await comparePassword(senha, user.senha_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // ALTERAÇÃO: Iniciar transação com o padrão do node-postgres.
    // Obtemos um 'client' do pool para todas as operações da transação.
    const client = await pool.connect();

    try {
      // 1. Inicia a transação
      await client.query('BEGIN');

      // 2. Executa todas as exclusões usando o mesmo 'client'.
      //    Placeholders '?' foram trocados por '$1'.
      await client.query('DELETE FROM DoacaoDinheiro WHERE usuario_id = $1', [userId]);
      await client.query('DELETE FROM DoacaoRoupa WHERE usuario_id = $1', [userId]);
      await client.query('DELETE FROM DoacaoAlimento WHERE usuario_id = $1', [userId]);
      await client.query('DELETE FROM usuario WHERE id = $1', [userId]);

      // 3. Se tudo deu certo, confirma a transação.
      await client.query('COMMIT')

      // 4. Encerrar a sessão do usuário após o sucesso.
      req.session.destroy((err) => {
        if (err) {
          console.error('Erro ao destruir sessão:', err);
          // Nota: a transação já foi comitada, mas o logout falhou.
          // A resposta de erro aqui é sobre a sessão, não sobre o banco.
          return res.status(500).json({ error: 'Conta excluída, mas houve um erro ao encerrar a sessão.' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ ok: true, message: 'Conta excluída com sucesso.' });
      });

    } catch (err) {
      // 5. Se qualquer uma das queries falhar, desfaz a transação.
      await client.query('ROLLBACK');
      console.error('Erro ao deletar conta (transação revertida):', err);
      return res.status(500).json({ error: 'Erro interno ao excluir conta.' });
    } finally {
      // 6. Libera o cliente de volta para o pool, ocorrendo erro ou não.
      client.release();
    }
  })
);

export default router;
