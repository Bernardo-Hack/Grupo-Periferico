-- ===========================
-- Tabelas
-- ===========================

CREATE TABLE IF NOT EXISTS Usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Administrador (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Voluntario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    disponibilidade VARCHAR(255) NOT NULL,
    experiencia TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS DoacaoDinheiro (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento VARCHAR(10) NOT NULL CHECK (metodo_pagamento IN ('pix', 'cartao', 'boleto')),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS DoacaoRoupa (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    tamanho VARCHAR(10),
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS DoacaoAlimento (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    quantidade_kg DECIMAL(5,2) NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE Distribuicao (
    id SERIAL PRIMARY KEY,
    doacao_id INT NOT NULL,
    tipo_doacao VARCHAR(10) NOT NULL CHECK (tipo_doacao IN ('dinheiro', 'roupa', 'alimento')),
    data_distribuicao DATE NOT NULL,
    admin_id INT NOT NULL,
    usuario_voluntario_id INT,
    FOREIGN KEY (admin_id) REFERENCES Administrador(id),
    FOREIGN KEY (usuario_voluntario_id) REFERENCES Usuario(id)
);

CREATE TABLE IF NOT EXISTS Certificado (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    distribuicao_id INT NOT NULL,
    data_emissao DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (distribuicao_id) REFERENCES Distribuicao(id)
);

CREATE TABLE HistoricoDoacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT,
    tipo_doacao VARCHAR(50) NOT NULL,
    valor DECIMAL(10, 2), -- Para doações em dinheiro
    quantidade INT, -- Para doações de roupas ou alimentos
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

CREATE TABLE EstoqueAlimentos (
    id SERIAL PRIMARY KEY,
    tipo_alimento VARCHAR(50) UNIQUE NOT NULL,
    quantidade_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EstoqueRoupas (
    id SERIAL PRIMARY KEY,
    tipo_roupa VARCHAR(50) UNIQUE NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);