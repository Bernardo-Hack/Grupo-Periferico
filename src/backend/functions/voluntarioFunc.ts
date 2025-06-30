// src/backend/functions/voluntarioFunc.ts (Nome do arquivo corrigido para refletir a função)
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/jwt';
import pool from '../config/db';

/**
 * Converte de forma segura um valor que pode vir como string ou number em número ou retorna null se inválido.
 */
function parseNumber(value: any): number | null {
  if (value === null || value === undefined) return null;
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
 */
// src/backend/functions/voluntarioFunc.ts
export const registerVoluntary = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { nome, email, idade: idadeRaw, disponibilidade, experiencia, tipo_sanguineo } = req.body;
    const idade = parseNumber(idadeRaw);

    if (!nome || !email) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, preencha seu nome e e-mail.',
      });
    }

    if (idade === null || idade < 18) {
      return res.status(400).json({
        success: false,
        message: 'Você precisa ter pelo menos 18 anos para ser voluntário.',
      });
    }

    const insertSQL = `
      INSERT INTO Voluntario (nome, email, idade, disponibilidade, experiencia, tipo_sanguineo, data_cadastro)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;

    await pool.query(insertSQL, [nome, email, idade, disponibilidade, experiencia, tipo_sanguineo]);

    return res.status(201).json({
      success: true,
      message: 'Voluntário registrado com sucesso',
      redirectUrl: '/voluntario/sucesso',
    });
  } catch (err) {
    console.error('Erro ao registrar voluntário:', err);
    return res.status(500).json({
      success: false,
      message: 'Ocorreu um erro interno ao registrar o voluntário. Tente novamente mais tarde.',
    });
  }
};
