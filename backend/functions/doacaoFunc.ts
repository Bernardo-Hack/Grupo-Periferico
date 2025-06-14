import { RequestHandler } from 'express';
import db from '../utils/db';

export const registerDonation: RequestHandler = async (req, res, next) => {
  try {
    const { valor, metodo_pagamento } = req.body;
    const userId = req.session.userId;

    if (!valor || !metodo_pagamento) {
      // 'return' foi removido desta linha
      res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos.' 
      });
      return; // Adicionado um return vazio para parar a execução
    }

    const insertSQL = `
      INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento, data_doacao)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;

    await db.query(insertSQL, [
      userId || null, 
      valor, 
      metodo_pagamento
    ]);

    // 'return' foi removido desta linha
    res.status(201).json({ 
      success: true,
      message: 'Doação registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });
  } catch (err) {
    console.error('Erro ao registrar doação:', err);
    // 'return' foi removido desta linha
    res.status(500).json({ 
      success: false,
      message: 'Erro ao registrar doação.' 
    });
  }
};

export const registerClothesDonation: RequestHandler = async (req, res, next) => {
  try {
    const { tipo, quantidade, tamanho } = req.body;
    const userId = req.session.userId;

    if (!tipo || !quantidade) {
      // 'return' foi removido desta linha
      res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos obrigatórios.' 
      });
      return; // Adicionado um return vazio para parar a execução
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

    // 'return' foi removido desta linha
    res.status(201).json({ 
      success: true,
      message: 'Doação de roupas registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });
  } catch (err) {
    console.error('Erro detalhado:', err);
    // 'return' foi removido desta linha
    res.status(500).json({ 
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação de roupas.') 
    });
  }
};

export const registerFoodDonation: RequestHandler = async (req, res, next) => {
  try {
    const { tipo, quantidade } = req.body;
    const userId = req.session.userId;

    if (!tipo || !quantidade) {
      // 'return' foi removido desta linha
      res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos obrigatórios.' 
      });
      return; // Adicionado um return vazio para parar a execução
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

    // 'return' foi removido desta linha
    res.status(201).json({ 
      success: true,
      message: 'Doação de alimentos registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });
  } catch (err) {
    console.error('Erro ao registrar doação de alimentos:', err);
    // 'return' foi removido desta linha
    res.status(500).json({ 
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação de alimentos.') 
    });
  }
};