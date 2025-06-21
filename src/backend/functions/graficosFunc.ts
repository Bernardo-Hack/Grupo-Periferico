// src/backend/functions/graficosFunc.ts
import { Request, Response } from 'express';
import db from '../config/db';

export async function graficoDinheiro(req: Request, res: Response) {
  const { periodo } = req.query;

  let filtroData = '';
  if (periodo === '7dias') filtroData = 'WHERE data_doacao >= NOW() - INTERVAL 7 DAY';
  else if (periodo === '30dias') filtroData = 'WHERE data_doacao >= NOW() - INTERVAL 30 DAY';
  else if (periodo === 'ano') filtroData = 'WHERE YEAR(data_doacao) = YEAR(CURDATE())';

  const [rows] = await db.execute(
    `SELECT metodo_pagamento, SUM(valor) AS total
     FROM doacaodinheiro
     ${filtroData}
     GROUP BY metodo_pagamento`
  );
  res.json(rows);
}

export async function graficoRoupas(req: Request, res: Response) {
  // Mostra todas as roupas (filtro é feito no frontend)
  const [rows] = await db.execute(
    `SELECT tipo, SUM(quantidade) AS total
     FROM DoacaoRoupa
     GROUP BY tipo`
  );
  res.json(rows);
}

export async function graficoAlimentos(req: Request, res: Response) {
  const [rows] = await db.execute(
    `SELECT tipo, SUM(quantidade_kg) AS total
     FROM DoacaoAlimento
     GROUP BY tipo`
  );
  res.json(rows);
}
