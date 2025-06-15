import request from 'supertest';
import express from 'express';
import session from 'express-session';
import userRouter from '../../../src/backend/functions/userFunc';
import pool from '../../../src/backend/config/db';
import { hashPassword, comparePassword } from '../../../src/backend/utils/encrypt';

afterAll(async () => {
  await pool.end();
});

jest.mock('../../../src/backend/config/db');
jest.mock('../../../src/backend/utils/encrypt');

const mockPool = pool as jest.Mocked<typeof pool>;
const mockHash = hashPassword as jest.MockedFunction<typeof hashPassword>;
const mockCompare = comparePassword as jest.MockedFunction<typeof comparePassword>;

let app: express.Express;

beforeEach(() => {
  jest.clearAllMocks();

  app = express();
  app.use(express.json());

  app.use(
    session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  app.use('/', userRouter);
});

describe('Rotas de usuário', () => {
  // ============================= REGISTRO =============================
  describe('POST /reg_user', () => {
    test('deve registrar um usuário com sucesso', async () => {
      mockHash.mockResolvedValue('hashed_password');
      mockPool.query.mockResolvedValue([{}] as any);

      const res = await request(app).post('/reg_user').send({
        nome: 'João Silva',
        cpf: '12345678901',
        telefone: '11999999999',
        dt_nasc: '1990-01-01',
        senha: 'Senha@123',
      });

      expect(mockHash).toHaveBeenCalledWith('Senha@123');
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO usuario'),
        ['João Silva', '12345678901', '11999999999', 'hashed_password', '1990-01-01']
      );

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ ok: true });
    });

    test('deve retornar erro se faltar campos obrigatórios', async () => {
      const res = await request(app).post('/reg_user').send({
        nome: 'João Silva',
        cpf: '12345678901',
      });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Preencha todos os campos.' });
    });

    test('deve retornar erro em caso de falha do banco', async () => {
      mockHash.mockResolvedValue('hashed_password');
      mockPool.query.mockRejectedValue(new Error('Erro no DB'));

      const res = await request(app).post('/reg_user').send({
        nome: 'João Silva',
        cpf: '12345678901',
        telefone: '11999999999',
        dt_nasc: '1990-01-01',
        senha: 'Senha@123',
      });

      expect(res.status).toBe(500);
    });
  });

  // ============================= LOGIN =============================
  describe('POST /login', () => {
    test('deve fazer login com sucesso', async () => {
      const mockUser = {
        id: 1,
        nome: 'João',
        senha_hash: 'hashed_password',
      };

      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(true);

      const res = await request(app).post('/login').send({ nome: 'João', senha: 'Senha@123' });

      // Verifica se a sessão foi configurada corretamente (cookie de sessão presente)
      const sessionCookie = res.headers['set-cookie'][0];
      expect(sessionCookie).toMatch(/connect.sid/);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
      expect(mockCompare).toHaveBeenCalledWith('Senha@123', 'hashed_password');
    });

    test('deve retornar erro se faltar credenciais', async () => {
      const res = await request(app).post('/login').send({ nome: 'João' }); // Senha faltando

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Preencha nome e senha.' });
    });

    test('deve recusar usuário não encontrado', async () => {
      mockPool.query.mockResolvedValue([[]] as any); // Nenhum resultado

      const res = await request(app).post('/login').send({ nome: 'Inexistente', senha: 'senha' });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Nome ou senha inválidos.' });
    });

    test('deve recusar senha incorreta', async () => {
      const mockUser = {
        id: 1,
        nome: 'João',
        senha_hash: 'hashed_password',
      };

      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(false);

      const res = await request(app).post('/login').send({ nome: 'João', senha: 'SenhaErrada' });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Nome ou senha inválidos.' });
    });
  });

  // ============================= LOGOUT =============================
  describe('POST /logout', () => {
    test('deve fazer logout com sucesso', async () => {
      // Primeiro faz login para criar sessão
      const mockUser = { id: 1, nome: 'João', senha_hash: 'hashed_password' };
      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(true);

      const agent = request.agent(app);
      await agent.post('/login').send({ nome: 'João', senha: 'Senha@123' });

      // Agora faz logout
      const res = await agent.post('/logout').send();

      // Verifica se o cookie de sessão foi removido
      expect(res.headers['set-cookie'][0]).toMatch(/connect.sid=;/);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    test('deve tratar erro ao destruir sessão', async () => {
      // Mock de sessão que falha ao destruir
      const mockApp = express();
      mockApp.use(express.json());
      mockApp.use(
        session({
          secret: 'test-secret',
          resave: false,
          saveUninitialized: true,
          cookie: { secure: false },
        })
      );
      mockApp.use((req, res, next) => {
        (req.session as any).destroy = (cb: (err?: any) => void) => cb(new Error('Erro de sessão'));
        next();
      });
      mockApp.use('/', userRouter);

      const res = await request(mockApp).post('/logout').send();

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro ao encerrar sessão' });
    });
  });

  // ============================= EDIÇÃO DE PERFIL =============================
  describe('PUT /edt_profile', () => {
    test('deve atualizar perfil com sucesso', async () => {
      // Cria sessão de usuário
      const agent = request.agent(app);
      const mockUser = { id: 1, nome: 'João', senha_hash: 'hashed_password', cpf: '12345678901' };
      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(true);
      await agent.post('/login').send({ nome: 'João', senha: 'Senha@123' });

      // Mock atualização com sucesso
      mockPool.query.mockResolvedValue([{}] as any);

      const res = await agent.put('/edt_profile').send({
        nome: 'João Atualizado',
        telefone: '11988888888',
        data_nascimento: '1995-05-05',
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });

      // Espera que a query seja UPDATE e os dados enviados sejam os novos dados
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE usuario SET'),
        ['João Atualizado', '11988888888', '1995-05-05', mockUser.id]
      );
    });

    test('deve recusar atualização sem autenticação', async () => {
      const res = await request(app).put('/edt_profile').send({
        nome: 'João Atualizado',
        telefone: '11988888888',
        data_nascimento: '1995-05-05',
      });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Não autenticado' });
    });

    test('deve tratar erro no banco de dados', async () => {
      // Cria sessão
      const agent = request.agent(app);
      const mockUser = { id: 1, nome: 'João', senha_hash: 'hashed_password', cpf: '12345678901' };
      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(true);
      await agent.post('/login').send({ nome: 'João', senha: 'Senha@123' });

      // Força erro na atualização
      mockPool.query.mockRejectedValue(new Error('DB Error'));
      const res = await agent.put('/edt_profile').send({
        nome: 'João Atualizado',
        telefone: '11988888888',
        data_nascimento: '1995-05-05',
      });

      expect(res.status).toBe(500);
    });
  });

  // ============================= PERFIL DO USUÁRIO =============================
  describe('GET /profile', () => {
    test('deve retornar perfil completo com doações', async () => {
      // Cria sessão
      const agent = request.agent(app);
      const mockUser = { id: 1, nome: 'João', senha_hash: 'hashed_password' };
      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(true);
      await agent.post('/login').send({ nome: 'João', senha: 'Senha@123' });

      // Mock dos dados de perfil e doações
      const mockProfile = {
        nome: 'João',
        telefone: '11999999999',
        data_cadastro: '2023-01-01',
      };

      const mockDonations = [
        {
          id: 1,
          valor: 100,
          metodo: 'pix',
          data_doacao: '2023-06-01 14:30:00',
        },
      ];

      mockPool.query
        .mockResolvedValueOnce([[mockProfile]] as any) // Primeira query (perfil)
        .mockResolvedValueOnce([mockDonations] as any); // Segunda query (doações)

      const res = await agent.get('/profile');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        user: mockProfile,
        doacoes: mockDonations,
      });
    });

    test('deve retornar erro para usuário não autenticado', async () => {
      const res = await request(app).get('/profile');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Não autenticado.' });
    });

    test('deve retornar erro se usuário não encontrado', async () => {
      // Cria sessão
      const agent = request.agent(app);
      const mockUser = { id: 999, nome: 'Inexistente', senha_hash: 'hashed_password' };
      mockPool.query.mockResolvedValue([[mockUser]] as any);
      mockCompare.mockResolvedValue(true);
      await agent.post('/login').send({ nome: 'Inexistente', senha: 'Senha@123' });

      // Perfil não encontrado
      mockPool.query.mockResolvedValueOnce([[]] as any);

      const res = await agent.get('/profile');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuário não encontrado.' });
    });
  });
});
