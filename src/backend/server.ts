// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path'; // Importa o módulo 'path' do Node.js

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

// 1) Middlewares essenciais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) Configuração de CORS e Sessão
app.use(cors({
  credentials: true,
  // Para maior segurança em produção, você pode especificar a origem:
  // origin: process.env.CORS_ORIGIN || 'https://seu-site.onrender.com' 
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'segredo_temporario_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}));

// ====================================================================
// 3) ROTAS DA API
// Todas as suas rotas de backend devem ser declaradas aqui.
// ====================================================================
app.use('/test', testDB); 
app.use('/user', userRoutes);
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);
app.post('/api/doacoes/dinheiro', registerDonation);
app.post('/api/doacoes/roupas', registerClothesDonation);
app.post('/api/doacoes/alimentos', registerFoodDonation);

const frontendDistPath = path.join(__dirname, '..');

// Middleware para servir os arquivos estáticos (HTML, CSS, JS) do React
app.use(express.static(frontendDistPath));

// Rota "catch-all" que redireciona qualquer outra requisição para o index.html do React.
// Isso permite que o React Router controle a navegação e as rotas da aplicação.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});


// 5) Error Handler
// Middleware para capturar erros de forma centralizada.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('💥 Erro não capturado:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

// 6) Inicialização do Servidor
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});