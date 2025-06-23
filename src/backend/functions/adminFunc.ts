// src/backend/functions/adminFunc.ts

import { Response, NextFunction } from 'express';
import db from '../config/db';
import { comparePassword } from '../utils/encrypt';
// Importando as funções e interfaces corretas do seu novo arquivo jwt.ts
import { gerarTokenJWT, AuthRequest } from '../utils/jwt';

export async function loginAdmin(req: AuthRequest, res: Response) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Garanta que sua tabela 'admin' tenha as colunas 'id', 'nome' e 'senha_hash'
    const { rows } = await db.query('SELECT * FROM admin WHERE email = $1', [email]);
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await comparePassword(senha, admin.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Criar o payload para o token com os campos definidos na interface JWTPayload
    const payload = {
      id: admin.id,
      nome: admin.nome,
      role: 'admin'
    };

    // Gerar o token usando a função 'gerarTokenJWT' do seu arquivo
    const token = gerarTokenJWT(payload);

    return res.status(200).json({ token });

  } catch (err) {
    console.error('Erro no login do admin:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

/**
 * Middleware para verificar se o usuário autenticado tem o papel ('role') de 'admin'.
 * Este middleware DEVE ser usado SEMPRE DEPOIS do middleware 'verificarToken'.
 */
export function adminRoleMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // O middleware 'verificarToken' já validou o token e anexou os dados em 'req.usuario'
  if (req.usuario && req.usuario.role === 'admin') {
    next(); // Se o papel for 'admin', o acesso é permitido.
  } else {
    // Se não houver usuário ou o papel não for 'admin', o acesso é negado.
    res.status(403).json({ error: 'Acesso proibido. Requer privilégios de administrador.' });
  }
}

// A função de logout não precisa de alterações
export function logoutAdmin(req: AuthRequest, res: Response) {
  res.status(200).json({ message: 'Logout bem-sucedido.' });
}