// src/backend/routes/userFunc.ts
import { Router, Request, Response, NextFunction } from 'express';
import db from '../config/db';
import { hashPassword, comparePassword } from '../utils/encrypt'; 
import { RowDataPacket } from 'mysql2'; 

const router = Router();

router.post('/reg_user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, cpf, telefone, senha, dt_nasc } = req.body;

    if (!nome || !cpf || !telefone || !senha || !dt_nasc) {
      return res.status(400).render('register', {
        errorMessage: 'Preencha todos os campos.',
      });
    }

    const hashedPassword = await hashPassword(senha);

    const insertSQL = `
      INSERT INTO usuario
        (nome, cpf, telefone, senha_hash, data_nascimento, data_cadastro)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    await db.query(insertSQL, [nome, cpf, telefone, hashedPassword, dt_nasc]);

    return res.redirect('/login');
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).render('register', {
      errorMessage: 'Erro ao registrar, tente novamente.',
    });
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) {
    return res.status(400).render('login', {
      errorMessage: 'Preencha nome e senha.',
    });
  }

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT id, nome, senha_hash FROM usuario WHERE nome = ?',
    [nome]
  );

  if (rows.length === 0) {
    return res.status(401).render('login', {
      errorMessage: 'Nome ou senha inválidos.',
    });
  }

  const user = rows[0];
  const isValid = await comparePassword(senha, user.senha_hash as string);

  if (!isValid) {
    return res.status(401).render('login', {
      errorMessage: 'Nome ou senha inválidos.',
    });
  }

  req.session.userId = user.id;
  req.session.userName = user.nome;

  return res.redirect('/adminUserDashboard');
});

export default router;
