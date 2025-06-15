import { registerDonation, registerClothesDonation, registerFoodDonation } from '../../../src/backend/functions/doacaoFunc';
import { Request, Response, NextFunction } from 'express';
import db from '../../../src/backend/config/db';

jest.mock('../../../src/backend/config/db');
 // mocka o banco de dados

const mockedDb = db as jest.Mocked<typeof db>;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}, session = {}) =>
  ({
    body,
    session
  } as unknown as Request);

const next: NextFunction = jest.fn();

describe('registerDonation', () => {
  it('deve registrar doação monetária com sucesso', async () => {
    const req = mockRequest({
      valor: 100,
      metodo_pagamento: 'PIX',
      nome: 'João',
      email: 'joao@email.com'
    }, { userId: 1 });

    const res = mockResponse();
    mockedDb.query.mockResolvedValueOnce([{}] as any);

    await registerDonation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Doação registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    }));
  });

  it('deve retornar erro se campos estiverem faltando', async () => {
    const req = mockRequest({ nome: 'Ana' }, {});
    const res = mockResponse();

    await registerDonation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Preencha todos os campos.'
    }));
  });
});

describe('registerClothesDonation', () => {
  it('deve registrar doação de roupas com sucesso', async () => {
    const req = mockRequest({
      nome: 'Maria',
      email: 'maria@email.com',
      tipo: 'Camiseta',
      quantidade: 5,
      tamanho: 'M'
    }, { userId: 2 });

    const res = mockResponse();
    mockedDb.query.mockResolvedValueOnce([{}] as any);

    await registerClothesDonation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Doação de roupas registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    }));
  });

  it('deve retornar erro para quantidade inválida', async () => {
    const req = mockRequest({
      nome: 'Maria',
      email: 'maria@email.com',
      tipo: 'Calça',
      quantidade: -2
    }, {});

    const res = mockResponse();

    await registerClothesDonation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Quantidade deve ser um número positivo.'
    }));
  });
});

describe('registerFoodDonation', () => {
  it('deve registrar doação de alimentos com sucesso', async () => {
    const req = mockRequest({
      nome: 'Carlos',
      email: 'carlos@email.com',
      tipo: 'Arroz',
      quantidade: 3
    }, { userId: 3 });

    const res = mockResponse();
    mockedDb.query.mockResolvedValueOnce([{}] as any);

    await registerFoodDonation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Doação de alimentos registrada com sucesso',
      redirectUrl: '/doacao/sucesso'
    }));
  });

  it('deve retornar erro se campos estiverem ausentes', async () => {
    const req = mockRequest({ tipo: 'Feijão' }, {});
    const res = mockResponse();

    await registerFoodDonation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Preencha todos os campos obrigatórios.'
    }));
  });
});
