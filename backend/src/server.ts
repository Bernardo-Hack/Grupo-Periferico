// 1) Isto vai no topo do server.ts, antes de importar `session`
import 'express-session';
declare module 'express-session' {
  interface SessionData {
    userId: number;
    userName: string;
  }
}



import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import path from 'path';
import db from './config/db';
import mainroutes from './routes/index';
import { hashPassword, comparePassword } from './encript/authhelp';

import { RowDataPacket } from 'mysql2';

const app = express();

// Configurações do Express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    secret: process.env.SESSION_SECRET || 'uma-chave-temporária',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 },
  })
);

// Rotas
app.get('/adminUserDashboard', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [results] = await db.query<RowDataPacket[]>('SELECT * FROM usuario ORDER BY nome');
        const usuarios = (results as RowDataPacket[]) || [];
        
        res.render("admin_dashboard", {
            usuarios: usuarios || [],
            currentDate: new Date().toLocaleDateString('pt-BR'),
            pageTitle: "Painel Administrativo"
        });
    } catch (error) {
        console.error("Erro completo:", error);
        res.render("admin_dashboard", { usuarios: [] });
    }
});

app.get('/adminMonetaryDonationDashboard', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [results] = await db.query<RowDataPacket[]>(`
            SELECT d.id, u.nome, d.valor, d.metodo_pagamento, d.data_doacao
            FROM DoacaoDinheiro d
            JOIN Usuario u ON d.usuario_id = u.id
            ORDER BY d.data_doacao DESC
        `);

        res.render('admin_doacoes', {
            doacoes: results as RowDataPacket[],
            pageTitle: "Doações em Dinheiro"
        });
    } catch (error) {
        console.error("Erro ao buscar doações:", error);
        res.render('admin_doacoes', { doacoes: [], pageTitle: "Doações em Dinheiro" });
    }
});

app.post('/reg_user',async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nome, cpf, telefone, senha, dt_nasc } = req.body;

      // Validação mínima
      if (!nome || !cpf || !telefone || !senha || !dt_nasc) {
        return res.status(400).render('register', {
          errorMessage: 'Preencha todos os campos.',
        });
      }

      // 1) Gera o hash da senha
      const hashedPassword = await hashPassword(senha);

      // 2) Insere no banco, incluindo data_cadastro como NOW()
      const insertSQL = `
        INSERT INTO usuario
          (nome, cpf, telefone, senha_hash, data_nascimento, data_cadastro)
        VALUES
          (?, ?, ?, ?, ?, NOW())
      `;

      await db.query(insertSQL, [
        nome,
        cpf,
        telefone,
        hashedPassword,
        dt_nasc,       
      ]);

      return res.redirect('/login');
    } catch (err) {
      console.error('Erro no registro:', err);
      return res.status(500).render('register', {
        errorMessage: 'Erro ao registrar, tente novamente.',
      });
    }
  }
);

app.post('/login',async (req: Request, res: Response, next: NextFunction) => {
    const { nome, senha } = req.body;
    if (!nome || !senha) {
      return res.status(400).render('login', { errorMessage: 'Preencha nome e senha.' });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, nome, senha_hash FROM usuario WHERE nome = ?',
      [nome]
    );
    if (rows.length === 0) {
      return res.status(401).render('login', { errorMessage: 'Nome ou senha inválidos.' });
    }

    const user = rows[0];
    const isValid = await comparePassword(senha, user.senha_hash as string);
    if (!isValid) {
      return res.status(401).render('login', { errorMessage: 'Nome ou senha inválidos.' });
    }

    // >>> Aqui: sem erro, porque já informamos o TS que essas props existem
    req.session.userId   = user.id;
    req.session.userName = user.nome;

    return res.redirect('/adminUserDashboard');
  }
);

app.post('/reg_doa', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { valor, metodo } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).render('pagina_doacao', {
        errorMessage: 'Usuário não autenticado.',
      });
    }

    if (!valor || !metodo) {
      return res.status(400).render('pagina_doacao', {
        errorMessage: 'Preencha todos os campos.',
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento, data_doacao)
      VALUES (?, ?, ?, NOW())
    `;

    await db.query(insertSQL, [userId, valor, metodo]);

    return res.redirect('/pagina_de_sucesso'); // Ou para onde quiser
  } catch (err) {
    console.error('Erro ao registrar doação:', err);
    return res.status(500).render('pagina_doacao', {
      errorMessage: 'Erro ao registrar doação.',
    });
  }
});




app.use('/', mainroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
