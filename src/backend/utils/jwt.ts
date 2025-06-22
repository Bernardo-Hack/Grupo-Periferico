// src/backend/auth/jwt.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Garante que as variáveis de ambiente sejam carregadas
dotenv.config();

// --- 1. CONFIGURAÇÃO E INTERFACES ---

// É crucial que o segredo JWT esteja definido no seu arquivo .env
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('A variável de ambiente JWT_SECRET não está definida. Verifique seu arquivo .env');
}

/**
 * Define a estrutura dos dados que serão armazenados dentro do token JWT.
 */
interface JWTPayload {
  id: number;
  nome: string;
  role: string;
}

export interface AuthRequest extends Request {
  usuario?: JWTPayload;
}


// --- 2. FUNÇÃO PARA GERAR O TOKEN ---

/**
 * Gera um token JWT assinado.
 * @param payload - Os dados do usuário a serem incluídos no token (id, nome).
 * @returns O token JWT como uma string.
 */
export const gerarTokenJWT = (payload: JWTPayload): string => {
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: '8h', // O token expirará em 8 horas. Escolha um tempo que faça sentido para sua aplicação.
    }
  );
  return token;
};


// --- 3. MIDDLEWARE PARA VERIFICAR O TOKEN ---
export const verificarAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {

  if (req.usuario && req.usuario.role === 'admin') {
    next(); // Se for admin, permite que a requisição continue.
  } else {
    // Se não for admin, retorna um erro de 'Acesso Proibido'.
    res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
  }
};  


export function verificarToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Token não fornecido.' });
    return;
  }
  
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ error: 'Token inválido ou expirado.' });
      return;
    }
    
    // Garantir que decoded tem a estrutura correta
    if (typeof decoded === 'object' && 'id' in decoded && 'nome' in decoded) {
      req.usuario = decoded as JWTPayload;
      next();
    } else {
      res.status(403).json({ error: 'Token com formato inválido.' });
    }
  });
}