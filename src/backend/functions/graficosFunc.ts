// src/backend/functions/graficosFunc.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export async function graficoDinheiro(req: Request, res: Response) {
  // Mostra todas as doações de dinheiro (filtro é feito no frontend)
  try {

    const selectSQL = `
      SELECT metodo_pagamento, SUM(valor) AS total
      FROM doacaodinheiro
      GROUP BY metodo_pagamento
      `;
    
    const { rows } = await pool.query(selectSQL);
    
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico de dinheiro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function graficoRoupas(req: Request, res: Response) {
  // Mostra todas as doações de roupas (filtro é feito no frontend)
  try {
    // A biblioteca 'pg' retorna um objeto com a propriedade 'rows'

    const selectSQL = `
      SELECT tipo, SUM(quantidade) AS total
      FROM doacaoroupa
      GROUP BY tipo
      `;

    const { rows } = await pool.query(selectSQL);
    res.json(rows);

  } catch (err) {
    console.error('Erro ao buscar dados do gráfico de roupas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function graficoAlimentos(req: Request, res: Response) {
  // Mostra todas as doações de roupas (filtro é feito no frontend)
  try {
    const selectSQL = `
      SELECT tipo, SUM(quantidade_kg) AS total
      FROM doacaoalimento
      GROUP BY tipo
      `;
    
    const { rows } = await pool.query(selectSQL);
    res.json(rows);

  } catch (err) {
    console.error('Erro ao buscar dados do gráfico de alimentos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
