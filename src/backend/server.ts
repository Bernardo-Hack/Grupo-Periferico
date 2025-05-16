// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';

import userRoutes from './functions/userFunc';
import { loadUser, loadDoacao } from './functions/adminFunc';
import { registerDonation } from './functions/doacaoFunc';
import testDB from './functions/testDB';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    userName: string;
  }
}

const app = express();

// 1) Parsing do body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) CORS + sessão
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_temporario',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// 3) Rotas
app.use('/user', userRoutes);
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);
app.post('/api/doacoes/dinheiro', registerDonation);
app.use('/test', testDB);

// 4) Error handler em JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erro não capturado:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 5) Start
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
