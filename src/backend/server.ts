// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path'; // <-- 1. IMPORTADO O 'path'

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

// 1) Parsing do body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) CORS + sessão
// Removido o 'origin' fixo para funcionar em produção no Render
app.use(cors({
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_temporario',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // Em produção (Render), você deve mudar 'secure' para true se usar HTTPS
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// 3) Rotas de API
// SUAS ROTAS DE API DEVEM VIR ANTES DO CÓDIGO DO FRONTEND
app.use('/user', userRoutes);
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);
app.post('/api/doacoes/dinheiro', registerDonation);
app.post('/api/doacoes/roupas', registerClothesDonation);
app.post('/api/doacoes/alimentos', registerFoodDonation);
app.use('/test', testDB);

// <-- 4. CÓDIGO NOVO PARA SERVIR O FRONTEND -->
// Aponte para a pasta de build do seu frontend (React)
const frontendPath = path.join(__dirname, '..', '..', 'frontend', 'dist'); // AJUSTE 'frontend' SE O NOME DA SUA PASTA FOR OUTRO
app.use(express.static('../../dist'));

// Para qualquer outra rota não encontrada, sirva o index.html do frontend
// Isso permite que o React Router controle a navegação
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});
// <-- FIM DO CÓDIGO NOVO -->

// 5) Error handler em JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erro não capturado:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 6) Start
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});