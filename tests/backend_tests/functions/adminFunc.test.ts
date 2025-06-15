import request from 'supertest';
import express, { Express } from 'express';
import session from 'express-session';
import adminFunc from '../../../src/backend/functions/adminFunc';
import db from '../../../src/backend/config/db';
import { RowDataPacket } from 'mysql2';

// Mock do banco de dados
jest.mock('../../../src/backend/config/db', () => ({
  db: {
    query: jest.fn()
  }
}));

// Mock do módulo de encriptação
jest.mock('../../../src/backend/utils/encrypt', () => ({
  comparePassword: jest.fn().mockResolvedValue(true)
}));

// Configuração do app de teste
const createTestApp = (): Express => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  app.use(adminFunc);
  return app;
};

describe('Admin Functions', () => {
  let app: Express;
  let mockAdmin: RowDataPacket;
  let mockUsers: RowDataPacket[];
  let mockDonations: RowDataPacket[];

  beforeEach(() => {
    app = createTestApp();
    
    // Dados mockados com tipo RowDataPacket
    mockAdmin = {
      id: 1,
      username: 'admin',
      senha_hash: 'hashed_password'
    } as RowDataPacket;
    
    mockUsers = [
      { id: 1, nome: 'Usuário 1', email: 'user1@example.com' } as RowDataPacket,
      { id: 2, nome: 'Usuário 2', email: 'user2@example.com' } as RowDataPacket
    ];
    
    mockDonations = [
      { 
        id: 1, 
        nome: 'Doador 1', 
        valor: 100, 
        metodo_pagamento: 'Cartão', 
        data_doacao: new Date() 
      } as RowDataPacket
    ];
    
    // Resetar mocks
    jest.clearAllMocks();
  });

  describe('Admin Authentication', () => {
    it('deve autenticar um admin válido e redirecionar para o dashboard', async () => {
      // Mock da query do banco
      (db.query as jest.Mock).mockResolvedValueOnce([[mockAdmin]]);
      
      const res = await request(app)
        .get('/admin/admin/password')
        .expect(302); // Redirect
        
      expect(res.header.location).toBe('/admin/dashboard');
    });

    it('deve retornar erro 401 para credenciais inválidas', async () => {
      // Mock de nenhum admin encontrado
      (db.query as jest.Mock).mockResolvedValueOnce([[]]);
      
      const res = await request(app)
        .get('/admin/invalid/invalid')
        .expect(401);
        
      expect(res.body).toEqual({ error: 'Acesso negado' });
    });

    it('deve fazer logout corretamente', async () => {
      // Primeiro faça login para ter uma sessão
      (db.query as jest.Mock).mockResolvedValueOnce([[mockAdmin]]);
      const agent = request.agent(app);
      await agent.get('/admin/admin/password');
      
      // Agora faça logout
      const res = await agent
        .get('/admin/logout')
        .expect(302); // Redirect
        
      expect(res.header.location).toBe('/');
    });
  });

  describe('Admin Middleware', () => {
    it('deve permitir acesso a rotas protegidas quando autenticado', async () => {
      // Simular sessão de admin
      const agent = request.agent(app);
      (db.query as jest.Mock).mockResolvedValueOnce([[mockAdmin]]);
      await agent.get('/admin/admin/password');
      
      // Mock dos usuários
      (db.query as jest.Mock).mockResolvedValueOnce([mockUsers]);
      
      const res = await agent
        .get('/admin/dashboard')
        .expect(200);
        
      // Verificar se o conteúdo esperado está presente
      expect(res.text).toContain('Painel Administrativo');
    });

    it('deve redirecionar para login quando não autenticado', async () => {
      const res = await request(app)
        .get('/admin/dashboard')
        .expect(302); // Redirect
        
      expect(res.header.location).toBe('/admin/login');
    });
  });

  describe('Dashboard Functions', () => {
    let agent: ReturnType<typeof request.agent>;

    beforeEach(async () => {
      // Simular sessão de admin antes de cada teste
      agent = request.agent(app);
      (db.query as jest.Mock).mockResolvedValueOnce([[mockAdmin]]);
      await agent.get('/admin/admin/password');
    });

    it('deve carregar usuários corretamente', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce([mockUsers]);
      
      const res = await agent
        .get('/admin/dashboard')
        .expect(200);
        
      expect(res.text).toContain('Usuário 1');
      expect(res.text).toContain('Usuário 2');
    });

    it('deve lidar com erros ao carregar usuários', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));
      
      const res = await agent
        .get('/admin/dashboard')
        .expect(200);
        
      // A página ainda deve carregar mesmo com erro
      expect(res.text).toContain('Painel Administrativo');
    });

    it('deve carregar doações corretamente', async () => {
      (db.query as jest.Mock).mockResolvedValueOnce([mockDonations]);
      
      const res = await agent
        .get('/admin/doacoes')
        .expect(200);
        
      expect(res.text).toContain('Doações em Dinheiro');
      expect(res.text).toContain('Doador 1');
    });

    it('deve lidar com erros ao carregar doações', async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));
      
      const res = await agent
        .get('/admin/doacoes')
        .expect(200);
        
      // A página ainda deve carregar mesmo com erro
      expect(res.text).toContain('Doações em Dinheiro');
    });
  });

  describe('Error Handling', () => {
    it('deve lidar com erros inesperados', async () => {
      // Forçar erro na rota de login
      (db.query as jest.Mock).mockRejectedValueOnce(new Error('DB Connection Failed'));
      
      const res = await request(app)
        .get('/admin/admin/password')
        .expect(500);
        
      expect(res.body).toHaveProperty('error');
    });
  });
});