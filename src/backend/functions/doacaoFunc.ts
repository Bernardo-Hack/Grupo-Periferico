import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

export const registerDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { valor, metodo_pagamento } = req.body;
    const userId = req.session.userId;

    if (!valor || !metodo_pagamento) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos.' 
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento, data_doacao)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;

    const result = await db.query(insertSQL, [
      userId || null, 
      valor, 
      metodo_pagamento
    ]);

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

export const registerClothesDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo, quantidade, tamanho } = req.body;
    const userId = req.session.userId;

    if (!tipo || !quantidade) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos obrigatórios.' 
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoRoupa (usuario_id, tipo, quantidade, tamanho, data_doacao)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;

    await db.query(insertSQL, [
      userId || null,
      tipo,
      quantidade,
      tamanho || null
    ]);

    return res.status(201).json({ 
      success: true,
      message: 'Doação de roupas registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });
  } catch (err) {
    console.error('Erro detalhado:', err);
    return res.status(500).json({ 
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação de roupas.') 
    });
  }
};

export const registerFoodDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo, quantidade } = req.body;
    const userId = req.session.userId;

    if (!tipo || !quantidade) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos obrigatórios.' 
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoAlimento (usuario_id, tipo, quantidade, data_doacao)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;

    await db.query(insertSQL, [
      userId || null,
      tipo,
      quantidade
    ]);

    return res.status(201).json({ 
      success: true,
      message: 'Doação de alimentos registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });
  } catch (err) {
    console.error('Erro ao registrar doação de alimentos:', err);
    return res.status(500).json({ 
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação de alimentos.') 
    });
  }
};