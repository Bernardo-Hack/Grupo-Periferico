drop database grupo_periferico;
create database grupo_periferico;
use grupo_periferico;

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
    senha_hash VARCHAR(255) NOT NULL,
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

-- ================================
-- ÍNDICES
-- ================================

CREATE INDEX idx_usuario_cpf ON Usuario(cpf);
CREATE INDEX idx_usuario_nascimento ON Usuario(data_nascimento);
CREATE INDEX idx_usuario_cadastro ON Usuario(data_cadastro);

CREATE INDEX idx_doacao_data ON DoacaoDinheiro(data_doacao);
CREATE INDEX idx_doacao_usuario ON DoacaoDinheiro(usuario_id);
CREATE INDEX idx_doacao_metodo ON DoacaoDinheiro(metodo_pagamento);

CREATE INDEX idx_roupa_tipo ON DoacaoRoupa(tipo);
CREATE INDEX idx_roupa_tamanho ON DoacaoRoupa(tamanho);

CREATE INDEX idx_alimento_tipo ON DoacaoAlimento(tipo);

CREATE INDEX idx_distribuicao_tipo ON Distribuicao(tipo_doacao);
CREATE INDEX idx_distribuicao_data ON Distribuicao(data_distribuicao);

CREATE INDEX idx_certificado_usuario ON Certificado(usuario_id);
CREATE INDEX idx_certificado_data ON Certificado(data_emissao);

-- ================================
-- TRIGGERS
-- ================================

DELIMITER //

CREATE TRIGGER trg_valida_data_nascimento BEFORE INSERT ON Usuario
FOR EACH ROW
BEGIN
    IF NEW.data_nascimento > CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Data de nascimento não pode ser no futuro';
    END IF;
END;//

CREATE TRIGGER trg_atualiza_estoque_alimento AFTER INSERT ON DoacaoAlimento
FOR EACH ROW
BEGIN
    INSERT INTO EstoqueAlimentos (tipo_alimento, quantidade_kg, ultima_atualizacao)
    VALUES (NEW.tipo, NEW.quantidade_kg, NOW())
    ON DUPLICATE KEY UPDATE
        quantidade_kg = quantidade_kg + NEW.quantidade_kg,
        ultima_atualizacao = NOW();
END;//

CREATE TRIGGER trg_gera_certificado_distribuicao AFTER INSERT ON Distribuicao
FOR EACH ROW
BEGIN
    DECLARE doador_id INT;

    IF NEW.tipo_doacao = 'dinheiro' THEN
        SELECT usuario_id INTO doador_id FROM DoacaoDinheiro WHERE id = NEW.doacao_id;
    ELSEIF NEW.tipo_doacao = 'roupa' THEN
        SELECT usuario_id INTO doador_id FROM DoacaoRoupa WHERE id = NEW.doacao_id;
    ELSEIF NEW.tipo_doacao = 'alimento' THEN
        SELECT usuario_id INTO doador_id FROM DoacaoAlimento WHERE id = NEW.doacao_id;
    END IF;

    IF doador_id IS NOT NULL THEN
        INSERT INTO Certificado (usuario_id, distribuicao_id, data_emissao)
        VALUES (doador_id, NEW.id, CURDATE());
    END IF;
END;//

CREATE TRIGGER trg_valida_admin_distribuicao BEFORE INSERT ON Distribuicao
FOR EACH ROW
BEGIN
    DECLARE admin_existente INT;
    SELECT COUNT(*) INTO admin_existente FROM Administrador WHERE id = NEW.admin_id;

    IF admin_existente = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Apenas administradores podem registrar distribuições';
    END IF;
END;//

DELIMITER ;
