import express from 'express';
import dotenv from "dotenv";
import db from './config/db';

dotenv.config();

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
