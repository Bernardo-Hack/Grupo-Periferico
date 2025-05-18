import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

export const registerDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { valor, metodo_pagamento, nome, email } = req.body;
    const userId = req.session.userId;

    // Validação dos campos
    if (!valor || !metodo_pagamento || !nome || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos.' 
      });
    }

    // Inserção no banco de dados
    const insertSQL = `
      INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento, nome_doador, email_doador, data_doacao)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    await db.query(insertSQL, [userId || null, valor, metodo_pagamento, nome, email]);

    return res.status(201).json({ 
      success: true,
      message: 'Doação registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });

  } catch (err) {
    console.error('Erro ao registrar doação:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Erro ao registrar doação.' 
    });
  }
};