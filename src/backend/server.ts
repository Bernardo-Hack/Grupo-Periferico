// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';

import userRoutes from './functions/userFunc';
import { registerDonation, registerClothesDonation, registerFoodDonation } from './functions/doacaoFunc';
import testDB from './functions/testDB';
import {
  graficoDinheiro,
  graficoRoupas,
  graficoAlimentos
} from './functions/graficosFunc'; // 🔁 IMPORTAÇÃO AQUI

declare module 'express-session' {
  interface SessionData {
    userId: number;
    userName: string;
  }
}

const app = express();

// ------------------------------------------------------------
// 1) Middleware de parsing do body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1.1) Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - body:`, req.body);
  } else {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ------------------------------------------------------------
// 2) CORS + Sessão
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_temporario',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

// ------------------------------------------------------------
// 3) Função helper
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ------------------------------------------------------------
// 4) Rotas principais
app.use('/user', userRoutes);
app.post('/api/doacoes/dinheiro', asyncHandler(registerDonation));
app.post('/api/doacoes/roupas', asyncHandler(registerClothesDonation));
app.post('/api/doacoes/alimentos', asyncHandler(registerFoodDonation));
app.use('/test', testDB);

// ✅ ROTAS DE GRÁFICO (AGORA FUNCIONAM!)
app.get('/api/graficos/doacoes/dinheiro', asyncHandler(graficoDinheiro));
app.get('/api/graficos/doacoes/roupas', asyncHandler(graficoRoupas));
app.get('/api/graficos/doacoes/alimentos', asyncHandler(graficoAlimentos));

// ------------------------------------------------------------
// 5) Rota raiz
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'Servidor rodando' });
});

// ------------------------------------------------------------
// 6) Erros
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erro não capturado:', err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ------------------------------------------------------------
// 7) Inicia servidor
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
