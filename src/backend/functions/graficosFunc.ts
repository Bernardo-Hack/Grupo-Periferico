// src/backend/functions/graficosFunc.ts
import { Request, Response } from 'express';
import pool from '../config/db';

export async function graficoDinheiro(req: Request, res: Response) {
  const { periodo } = req.query;

  try {
    let filtroData = '';
    // Sintaxe de data ajustada para PostgreSQL
    if (periodo === '7dias') {
      filtroData = "WHERE data_doacao >= NOW() - INTERVAL '7 days'";
    } else if (periodo === '30dias') {
      filtroData = "WHERE data_doacao >= NOW() - INTERVAL '30 days'";
    } else if (periodo === 'ano') {
      filtroData = 'WHERE EXTRACT(YEAR FROM data_doacao) = EXTRACT(YEAR FROM CURRENT_DATE)';
    }

    const selectSQL = `
      SELECT metodo_pagamento, SUM(valor) AS total
      FROM doacaodinheiro
      ${filtroData}
      GROUP BY metodo_pagamento
      `;
    
    // A biblioteca 'pg' retorna um objeto com a propriedade 'rows'
    const { rows } = await pool.query(selectSQL);
    
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico de dinheiro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function graficoRoupas(req: Request, res: Response) {
  // Mostra todas as roupas (filtro é feito no frontend)
  try {
    // A biblioteca 'pg' retorna um objeto com a propriedade 'rows'
    const { rows } = await pool.query(
      `SELECT tipo, SUM(quantidade) AS total
       FROM DoacaoRoupa
       GROUP BY tipo`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico de roupas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

export async function graficoAlimentos(req: Request, res: Response) {
  try {
    // A biblioteca 'pg' retorna um objeto com a propriedade 'rows'
    const { rows } = await pool.query(
      `SELECT tipo, SUM(quantidade_kg) AS total
       FROM DoacaoAlimento
       GROUP BY tipo`
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar dados do gráfico de alimentos:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
