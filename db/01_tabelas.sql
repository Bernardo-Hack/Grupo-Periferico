CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela separada para administradores
CREATE TABLE Administrador (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    senha_hash VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de doações financeiras
CREATE TABLE doacaodinheiro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    nome_doador VARCHAR(255) NOT NULL,
    email_doador VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento ENUM('pix', 'cartao', 'boleto') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- 1) Tabela de doações em dinheiro
CREATE TABLE IF NOT EXISTS doacaodinheiro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento ENUM('pix','cartao','boleto') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- 2) Tabela de doações de roupas
CREATE TABLE IF NOT EXISTS DoacaoRoupa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    tamanho VARCHAR(10),
    data_doacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- 3) Tabela de doações de alimentos
CREATE TABLE IF NOT EXISTS DoacaoAlimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    quantidade_kg DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabela de certificados
CREATE TABLE Certificado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    distribuicao_id INT NOT NULL,
    data_emissao DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (distribuicao_id) REFERENCES Distribuicao(id)
);

CREATE TABLE voluntario (
    id_voluntario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    disponibilidade VARCHAR(255) NOT NULL,
    experiencia TEXT,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;