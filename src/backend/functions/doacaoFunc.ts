// src/backend/routes/doacaoFunc.ts
import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

// Exporta a função individualmente
export const registerDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { valor, metodo } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).render('pagina_doacao', {
        errorMessage: 'Usuário não autenticado.',
      });
    }

    if (!valor || !metodo) {
      return res.status(400).render('pagina_doacao', {
        errorMessage: 'Preencha todos os campos.',
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento, data_doacao)
      VALUES (?, ?, ?, NOW())
    `;

    await db.query(insertSQL, [userId, valor, metodo]);

    return res.redirect('/pagina_de_sucesso');
  } catch (err) {
    console.error('Erro ao registrar doação:', err);
    return res.status(500).render('pagina_doacao', {
      errorMessage: 'Erro ao registrar doação.',
    });
  }
};
