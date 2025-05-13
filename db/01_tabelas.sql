CREATE TABLE Usuario (
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
CREATE TABLE DoacaoDinheiro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pagamento ENUM('pix', 'cartao', 'boleto') NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabela de doações de roupas
CREATE TABLE DoacaoRoupa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    tamanho VARCHAR(10),
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabela de doações de alimentos
CREATE TABLE DoacaoAlimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    quantidade_kg DECIMAL(5,2) NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- Tabela de distribuição de recursos (referência para administradores)
CREATE TABLE Distribuicao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doacao_id INT NOT NULL,
    tipo_doacao ENUM('dinheiro', 'roupa', 'alimento') NOT NULL,
    data_distribuicao DATE NOT NULL,
    admin_id INT NOT NULL,
    usuario_voluntario_id INT,
    FOREIGN KEY (admin_id) REFERENCES Administrador(id),
    FOREIGN KEY (usuario_voluntario_id) REFERENCES Usuario(id)
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
