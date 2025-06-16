// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';

import userRoutes from './functions/userFunc';
import { loadUser, loadDoacao } from './functions/adminFunc';
import { registerDonation, registerClothesDonation, registerFoodDonation } from './functions/doacaoFunc';
import testDB from './functions/testDB';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    userName: string;
  }
}

const app = express();

// ------------------------------------------------------------
// 1) Middleware de parsing do body
app.use(express.json()); // Para JSON
app.use(express.urlencoded({ extended: true })); // Para form-urlencoded, se necessário

// 1.1) Middleware de logging (útil para debug de req.body)
app.use((req: Request, res: Response, next: NextFunction) => {
  // Só loga métodos que costumam ter body (POST, PUT, PATCH), mas você pode logar sempre
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - body:`, req.body);
  } else {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ------------------------------------------------------------
// 2) CORS + sessão
// Lista de origens permitidas
const allowedOrigins = [
  'http://localhost:5173',         // Para o seu frontend rodando localmente
  process.env.CORS_ORIGIN,         // Para o seu frontend no Render (definido na variável de ambiente)
  // Adicione outras URLs se precisar, por exemplo, a de um preview do Render
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (como de apps mobile ou ferramentas como curl/Postman)
    if (!origin) return callback(null, true);

    // Se a origem da requisição estiver na nossa lista, permita
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Se não, rejeite
      callback(new Error('A política de CORS para este site não permite acesso da sua origem.'));
    }
  },
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_temporario',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,       // em produção, se usar HTTPS, coloque true
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  },
}));

// ------------------------------------------------------------
// 3) Rotas

// Rotas de usuário (autenticação, perfil, etc.)
app.use('/user', userRoutes);

// Rotas de dashboard admin
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);

// Helper para capturar erros em async handlers
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Rotas de doações
app.post('/api/doacoes/dinheiro', asyncHandler(registerDonation));
app.post('/api/doacoes/roupas', asyncHandler(registerClothesDonation));
app.post('/api/doacoes/alimentos', asyncHandler(registerFoodDonation));

// Rota de testes de BD ou outras
app.use('/test', testDB);

// Se quiser, adicione uma rota raiz para verificar que o servidor está vivo:
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'Servidor rodando' });
});

// ------------------------------------------------------------
// 4) Tratamento de rotas não encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ------------------------------------------------------------
// 5) Error handler em JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erro não capturado:', err);
  // Se headers já foram enviados, delega
  if (res.headersSent) {
    return next(err);
  }
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ------------------------------------------------------------
// 6) Start
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
