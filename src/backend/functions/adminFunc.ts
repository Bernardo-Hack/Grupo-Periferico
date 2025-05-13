// adminFunc.ts

import { Request, Response, NextFunction } from 'express';
import db from '../config/db';
import { RowDataPacket } from 'mysql2';

// Exporta a função para o dashboard de usuários
export const loadUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM usuario ORDER BY nome');
    const usuarios = results || [];

    res.render("admin_dashboard", {
      usuarios,
      currentDate: new Date().toLocaleDateString('pt-BR'),
      pageTitle: "Painel Administrativo"
    });
  } catch (error) {
    console.error("Erro completo:", error);
    res.render("admin_dashboard", { usuarios: [] });
  }
};

// Exporta a função para o dashboard de doações
export const loadDoacao = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [results] = await db.query<RowDataPacket[]>(`
      SELECT d.id, u.nome, d.valor, d.metodo_pagamento, d.data_doacao
      FROM DoacaoDinheiro d
      JOIN Usuario u ON d.usuario_id = u.id
      ORDER BY d.data_doacao DESC
    `);

    res.render('admin_doacoes', {
      doacoes: results,
      pageTitle: "Doações em Dinheiro"
    });
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    res.render('admin_doacoes', { doacoes: [], pageTitle: "Doações em Dinheiro" });
  }
};
