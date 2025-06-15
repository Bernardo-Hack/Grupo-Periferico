// tests/backend/functions/testUtils.ts
import { Request, Response, NextFunction } from 'express';

// Tipos para objetos simulados
export type MockRequest = Partial<Request> & { 
    session?: any; 
    body?: any;
    params?: any;
    query?: any;
};

export type MockResponse = Partial<Response> & {
    status: jest.Mock<MockResponse, [number]>;
    json: jest.Mock<MockResponse, [any]>;
    clearCookie?: jest.Mock;
};

export type MockNextFunction = jest.MockedFunction<NextFunction>;

// Função para criar um objeto de requisição simulado
export const mockRequest = (values: Partial<MockRequest> = {}): MockRequest => ({
    ...values
});

// Função para criar um objeto de resposta simulado
export const mockResponse = (): MockResponse => {
    const res: Partial<MockResponse> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn();
    return res as MockResponse;
};

// Função para criar uma função next simulada
export const mockNext: MockNextFunction = jest.fn();