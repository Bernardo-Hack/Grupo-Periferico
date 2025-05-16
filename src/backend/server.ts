import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import { loadUser, loadDoacao } from './functions/adminFunc';
import userRoutes from './functions/userFunc';
import { registerDonation } from './functions/doacaoFunc';
import session from 'express-session';



import db from './config/db';


import 'express-session';
declare module 'express-session' {
  interface SessionData {
    userId: number;
    userName: string;
  }
}
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || '99d8f7e6c5b4a3a2b1a0', //chave temporaria
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 },
  })
);
app.use('/user', userRoutes); 
app.get('/adminUserDashboard', loadUser);
app.get('/adminMonetaryDonationDashboard', loadDoacao);
app.post('/registerDonation', registerDonation);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
