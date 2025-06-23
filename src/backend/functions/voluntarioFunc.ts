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
 * 1) Cadastro de Voluntário
 * Tabela: voluntario
 * Colunas: id, nome, email, idade, disponibilidade, experiencia, data_cadastro (default NOW)
 */
export const registerVoluntary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('registerFoodDonation - req.body:', req.body);

    const { nome, email, idade:idadeRaw, disponibilidade, experiencia} = req.body;
    const idade = parseNumber(idadeRaw);

    // Validações:
    if (!email || !nome || !disponibilidade || !experiencia) {
      return res.status(400).json({
        success: false,
        message: 'Preencha todos os campos corretamente.',
      });
    }
    if ( idade === null || idade <= 17) {
      return res.status(400).json({
        success: false,
        message: 'Idade deve ser um número positivo.',
      });
    }

    const insertSQL = `
      INSERT INTO voluntario (nome, email, disponibilidade, experiencia, idade, data_cadastro)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;

    await pool.query(insertSQL, [nome, email, idade, disponibilidade, experiencia]);

    return res.status(201).json({
      success: true,
      message: 'Voluntário registrada com sucesso',
      redirectUrl: '/voluntario/sucesso',
    });
  } catch (err) {
    console.error('Erro ao registrar voluntário:', err);
    return res.status(500).json({
      success: false,
      message: (err instanceof Error ? err.message : 'Erro ao registrar voluntário.'),
    });
  }
};
