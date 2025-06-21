// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
// --- REMOVIDO: import session from 'express-session'; ---
import cors from 'cors';

import userRoutes from './functions/userFunc';
import { loadUser, loadDoacao } from './functions/adminFunc';
import { registerDonation, registerClothesDonation, registerFoodDonation } from './functions/doacaoFunc';
import testDB from './functions/testDB';

// --- REMOVIDO: O bloco 'declare module 'express-session'' foi removido. ---

const app = express();

// ------------------------------------------------------------
// 1) Middleware de parsing do body e logging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - body:`, req.body);
  } else {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ------------------------------------------------------------
// 2) CORS
// --- MUDANÇA: 'credentials: true' removido, pois não usamos mais cookies para autenticação. ---
app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- REMOVIDO: O middleware 'app.use(session({...}))' foi completamente removido. ---


// ------------------------------------------------------------
// 3) Rotas (sem alterações aqui)
app.use('/user', userRoutes);
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.post('/api/doacoes/dinheiro', asyncHandler(registerDonation));
app.post('/api/doacoes/roupas', asyncHandler(registerClothesDonation));
app.post('/api/doacoes/alimentos', asyncHandler(registerFoodDonation));
app.use('/test', testDB);
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'Servidor rodando' });
});


// ------------------------------------------------------------
// 4) Tratamento de erros e 404 (sem alterações aqui)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erro não capturado:', err);
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
// 6) Start do servidor (sem alterações aqui)
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});