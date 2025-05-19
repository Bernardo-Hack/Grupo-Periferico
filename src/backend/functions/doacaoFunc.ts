import { Request, Response, NextFunction } from 'express';
import db from '../config/db';

export const registerDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { valor, metodo_pagamento, nome, email } = req.body;
    const userId = req.session.userId;

    if (!valor || !metodo_pagamento || !nome || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos.' 
      });
    }

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

export const registerClothesDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, email, tipo, quantidade, tamanho } = req.body;
    const userId = req.session.userId;

    console.log('Dados recebidos:', { nome, email, tipo, quantidade, tamanho }); 

    if (!nome || !email || !tipo || !quantidade) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos obrigatórios.' 
      });
    }

    if (isNaN(quantidade) || quantidade <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantidade deve ser um número positivo.' 
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoRoupa (usuario_id, tipo, quantidade, tamanho, data_doacao)
      VALUES (?, ?, ?, ?, NOW())
    `;

    console.log('SQL:', insertSQL);

    const [result] = await db.query(insertSQL, [
      userId || null,
      tipo,
      quantidade,
      tamanho || null
    ]);

    console.log('Resultado da inserção:', result);

    return res.status(201).json({ 
      success: true,
      message: 'Doação de roupas registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });

  } catch (err) {
    console.error('Erro detalhado:', err);
    return res.status(500).json({ 
      success: false,
      message: err.message || 'Erro ao registrar doação de roupas.' 
    });
  }
};


export const registerFoodDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nome, email, tipo, quantidade } = req.body;
    const userId = req.session.userId;

    console.log('Dados recebidos (alimentos):', { nome, email, tipo, quantidade });

    if (!nome || !email || !tipo || !quantidade) {
      return res.status(400).json({ 
        success: false,
        message: 'Preencha todos os campos obrigatórios.' 
      });
    }

    if (isNaN(quantidade) || quantidade <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantidade deve ser um número positivo.' 
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoAlimento (usuario_id, tipo, quantidade, data_doacao)
      VALUES (?, ?, ?, NOW())
    `;

    const [result] = await db.query(insertSQL, [
      userId || null,
      tipo,
      quantidade
    ]);

    console.log('Doação de alimento registrada:', result);

    return res.status(201).json({ 
      success: true,
      message: 'Doação de alimentos registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    });

  } catch (err) {
    console.error('Erro ao registrar doação de alimentos:', err);
    return res.status(500).json({ 
      success: false,
      message: err.message || 'Erro ao registrar doação de alimentos.' 
    });
  }
};