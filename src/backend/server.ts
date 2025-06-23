// src/backend/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './functions/userFunc.js';
import { verificarToken } from './utils/jwt.js'; // ALTERAÇÃO: Importe o middleware
import { loadUser, loadDoacao } from './functions/adminFunc.js';
import { registerDonation, registerClothesDonation, registerFoodDonation } from './functions/doacaoFunc.js';
import testDB from './functions/testDB.js';
import swaggerDocument from './utils/swagger.json';

const app = express();


app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

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
const corsOptions = {
    origin: [
        'http://localhost:5173', // Para desenvolvimento local
        'http://127.0.0.1:5173', // Outra variação local
        process.env.FRONTEND_URL || '' // Para o site em produção (Render)
    ].filter(Boolean), // Garante que não hajam valores vazios na lista
    credentials: true, // Importante para compatibilidade e envio de headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Garante que o header do JWT seja aceito
};

app.use(cors(corsOptions));


// ------------------------------------------------------------
// 3) Rotas
app.use('/user', userRoutes);
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.post('/api/doacoes/dinheiro', verificarToken, asyncHandler(registerDonation));
app.post('/api/doacoes/roupas', verificarToken, asyncHandler(registerClothesDonation));
app.post('/api/doacoes/alimentos', verificarToken, asyncHandler(registerFoodDonation));
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