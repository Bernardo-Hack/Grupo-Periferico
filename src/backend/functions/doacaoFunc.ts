// src/backend/functions/doacaoFunc.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/jwt'; // Importe a interface AuthRequest
import pool from '../config/db';

/**
 * Converte de forma segura um valor que pode vir como string ou number em número ou retorna null se inválido.
 */
function parseNumber(value: any): number | null {
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const num = Number(trimmed);
    return isNaN(num) ? null : num;
  }
  return null;
}

/**
 * 1) Doação em dinheiro
 * Tabela: doacaodinheiro
 * Colunas: id, usuario_id, nome_doador, valor, data_doacao (default NOW), metodo_pagamento
 */
export const registerDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('registerDonation - req.body:', req.body);
    const userId = req.usuario?.id;
    // Exigir login: se não tiver userId, retorna 401
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'ID do usuário não encontrado no token. Acesso não autorizado.',
      });
    }

    // Esperamos receber do frontend:
    //   valor: number|string (valor da doação)
    //   metodo_pagamento: 'pix' | 'cartao' | 'boleto'
    const { valor: valorRaw, metodo_pagamento, moeda } = req.body;
    const valor = parseNumber(valorRaw);

    // Validações:
    if (valor === null || !metodo_pagamento) {
      return res.status(400).json({
        success: false,
        message: 'Preencha todos os campos corretamente. Valor deve ser número maior que zero.',
      });
    }
    if (valor <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor deve ser maior que zero.',
      });
    }
    const opcoes = ['pix', 'cartao', 'boleto'];
    if (!opcoes.includes(metodo_pagamento)) {
      return res.status(400).json({
        success: false,
        message: 'Método de pagamento inválido.',
      });
    }
    const moedasPermitidas = ['BRL', 'USD', 'EUR'];
    if (!moedasPermitidas.includes(moeda)) {
      return res.status(400).json({ success: false, message: 'Moeda inválida.' });
    }
    const moedaFinal = moeda;


    // Monta e executa o INSERT
    const insertSQL = `
      INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento, moeda)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(insertSQL, [userId, valor, metodo_pagamento, moedaFinal]);


    return res.status(201).json({
      success: true,
      message: 'Doação registrada com sucesso',
      redirectUrl: '/doacao/sucesso',
    });
  } catch (err) {
    console.error('Erro ao registrar doação em dinheiro:', err);

    return res.status(500).json({
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação.'),
    });
  }
};

/**
 * 2) Doação de roupas
 * Tabela: DoacaoRoupa
 * Colunas: id, usuario_id, tipo, quantidade, tamanho, data_doacao
 * Não há nome_doador/email; assumimos que o usuário identificado pela sessão é quem doa.
 */
export const registerClothesDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('registerClothesDonation - req.body:', req.body);
    const userId = req.usuario?.id;
    // Exigir login:
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'ID do usuário não encontrado no token. Acesso não autorizado.',
      });
    }

    // Esperamos receber do frontend:
    //   tipo: string (descrição/tipo da roupa)
    //   quantidade: number|string (quantidade de peças)
    //   tamanho: string|null (opcional, ex: 'P','M','G','GG')

    const { tipo, tamanho, quantidade: quantidadeRaw } = req.body;
    const quantidade = parseNumber(quantidadeRaw);
    
    // Validações:
    if (!tipo || quantidade === null) {
      return res.status(400).json({
        success: false,
        message: 'Preencha tipo e quantidade corretamente. Quantidade inválida.',
      });
    }
    if (quantidade <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser um número positivo.',
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoRoupa (usuario_id, tipo, quantidade, tamanho, data_doacao)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    await pool.query(insertSQL, [userId, tipo, quantidade, tamanho || null]);

    return res.status(201).json({
      success: true,
      message: 'Doação de roupas registrada com sucesso',
      redirectUrl: '/doacao/sucesso',
    });
  } catch (err) {
    console.error('Erro ao registrar doação de roupas:', err);
    return res.status(500).json({
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação de roupas.'),
    });
  }
};

/**
 * 3) Doação de alimentos
 * Tabela: DoacaoAlimento
 * Colunas: id, usuario_id, tipo, quantidade_kg, data_doacao
 * Não há nome_doador/email; assumimos que a sessão identifica o doador.
 */
export const registerFoodDonation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('registerFoodDonation - req.body:', req.body);
    const userId = req.usuario?.id;
    // Exigir login:
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'ID do usuário não encontrado no token. Acesso não autorizado.',
      });
    }

    // Esperamos receber do frontend:
    //   tipo: string (descrição do alimento, ex: 'Arroz')
    //   quantidade: number|string (quantidade em kg)
    const { tipo, quantidade: quantidadeRaw } = req.body;
    const quantidade = parseNumber(quantidadeRaw);

    // Validações:
    if (!tipo || quantidade === null) {
      return res.status(400).json({
        success: false,
        message: 'Preencha tipo e quantidade corretamente. Quantidade inválida.',
      });
    }
    if (quantidade <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantidade deve ser um número positivo.',
      });
    }

    const insertSQL = `
      INSERT INTO DoacaoAlimento (usuario_id, tipo, quantidade_kg, data_doacao)
      VALUES ($1, $2, $3, NOW())
    `;
    await pool.query(insertSQL, [userId, tipo, quantidade]);

    return res.status(201).json({
      success: true,
      message: 'Doação de alimentos registrada com sucesso',
      redirectUrl: '/doacao/sucesso',
    });
  } catch (err) {
    console.error('Erro ao registrar doação de alimentos:', err);
    return res.status(500).json({
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar doação de alimentos.'),
    });
  }
};