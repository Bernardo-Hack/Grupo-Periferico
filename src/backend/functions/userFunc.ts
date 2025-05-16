// src/backend/routes/userFunc.ts
import express, { Router, Request, Response, NextFunction } from 'express';
import db from '../config/db';
import { hashPassword, comparePassword } from '../utils/encrypt'; 
import { RowDataPacket } from 'mysql2'; 

const router = express.Router();


router.use(express.json());
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



router.get('profile', async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT nome, cpf, telefone, data_nascimento FROM usuario WHERE id = ?',
    [req.session.userId]
  );

  if (rows.length === 0) {
    return res.status(404).render('profile', {
      errorMessage: 'Usuário não encontrado.',
    });
  }

  const user = rows[0];

  return res.render('profile', {
    user,
    pageTitle: 'Perfil do Usuário',
  });
});


router.get('logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao encerrar sessão:', err);
      return res.status(500).render('error', {
        errorMessage: 'Erro ao encerrar sessão.',
      });
    }
    return res.redirect('/login');
  });
})




router.post('/reg_voluntary', async (req: Request, res: Response) => {
  try {
    console.log('Headers recebidos:', req.headers);
    console.log('Corpo bruto:', req.body);
    if (!req.body) {
      res.status(400).json({ message: 'Dados inválidos' });
      return;
    }

    // Adicione um log para depuração
    console.log('Corpo recebido:', req.body);
    const { 
      nome, 
      email, 
      disponibilidade, 
      experiencia 
    } = req.body; 

    // Validação básica
    if (!nome?.trim() || !email?.trim() || !disponibilidade?.trim()) {
      res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    // Comando SQL para inserção
    const insertSQL = `
      INSERT INTO voluntario (nome, email, disponibilidade, experiencia, data_cadastro)
      VALUES (?, ?, ?, ?, NOW())
    `;

    // Executa a query com os dados
    await db.query(insertSQL, [
      nome,
      email,
      disponibilidade,
      experiencia || null, // evita campo vazio
    ]);

    // Retorna resposta de sucesso
    res.status(201).json({ message: 'Voluntário registrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao registrar voluntário:', err);
    res.status(500).json({ message: 'Erro interno ao registrar voluntário. Tente novamente mais tarde.' });
  }
});

export default router;
