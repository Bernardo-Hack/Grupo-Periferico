-- ================================================
-- STORED PROCEDURES (LÓGICA DE NEGÓCIO)
-- ================================================

DELIMITER //

-- Procedure para cadastrar usuários com validação
CREATE PROCEDURE sp_cadastrar_usuario(
    IN p_nome VARCHAR(255),
    IN p_cpf VARCHAR(14),
    IN p_telefone VARCHAR(20),
    IN p_senha VARCHAR(255),
    IN p_tipo ENUM('admin', 'doador'),
    IN p_data_nascimento DATE,
    OUT p_resultado VARCHAR(100)
)
BEGIN
    DECLARE cpf_existe INT;
    
    -- Verifica duplicidade de CPF
    SELECT COUNT(*) INTO cpf_existe FROM Usuario WHERE cpf = p_cpf;
    
    IF cpf_existe > 0 THEN
        SET p_resultado = 'Erro: CPF já cadastrado';
    ELSE
        -- Insere com senha hasheada (SHA-256)
        INSERT INTO Usuario (nome, cpf, telefone, senha_hash, tipo, data_nascimento)
        VALUES (p_nome, p_cpf, p_telefone, SHA2(p_senha, 256), p_tipo, p_data_nascimento);
        
        SET p_resultado = CONCAT('Usuário ', p_nome, ' cadastrado com sucesso. ID: ', LAST_INSERT_ID());
    END IF;
END //

-- Procedure para autenticação de usuários
CREATE PROCEDURE sp_autenticar_usuario(
    IN p_cpf VARCHAR(14),
    IN p_senha VARCHAR(255),
    OUT p_usuario_id INT,
    OUT p_tipo_usuario VARCHAR(10),
    OUT p_resultado VARCHAR(100)
)
BEGIN
    DECLARE senha_hash VARCHAR(255);
    
    -- Busca usuário e verifica senha
    SELECT id, tipo, senha_hash INTO p_usuario_id, p_tipo_usuario, senha_hash
    FROM Usuario WHERE cpf = p_cpf;
    
    IF p_usuario_id IS NULL THEN
        SET p_resultado = 'Erro: CPF não cadastrado';
    ELSEIF SHA2(p_senha, 256) != senha_hash THEN
        SET p_resultado = 'Erro: Senha incorreta';
        SET p_usuario_id = NULL;
        SET p_tipo_usuario = NULL;
    ELSE
        SET p_resultado = 'Autenticação bem-sucedida';
    END IF;
END //

-- Procedure para registrar doações financeiras
CREATE PROCEDURE sp_registrar_doacao_dinheiro(
    IN p_usuario_id INT,
    IN p_valor DECIMAL(10,2),
    IN p_metodo_pagamento ENUM('pix', 'cartao', 'boleto'),
    OUT p_doacao_id INT,
    OUT p_resultado VARCHAR(100)
)
BEGIN
    -- Validações básicas
    IF NOT EXISTS (SELECT 1 FROM Usuario WHERE id = p_usuario_id) THEN
        SET p_resultado = 'Erro: Usuário não encontrado';
    ELSEIF p_valor <= 0 THEN
        SET p_resultado = 'Erro: Valor deve ser positivo';
    ELSE
        INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento)
        VALUES (p_usuario_id, p_valor, p_metodo_pagamento);
        
        SET p_doacao_id = LAST_INSERT_ID();
        SET p_resultado = CONCAT('Doação de R$', p_valor, ' registrada com sucesso');
    END IF;
END //

-- Procedure para registrar doações de alimentos
CREATE PROCEDURE sp_registrar_doacao_alimento(
    IN p_usuario_id INT,
    IN p_tipo VARCHAR(50),
    IN p_quantidade_kg DECIMAL(5,2),
    OUT p_doacao_id INT,
    OUT p_resultado VARCHAR(100)
)
BEGIN
    -- Valida quantidade positiva
    IF p_quantidade_kg <= 0 THEN
        SET p_resultado = 'Erro: Quantidade deve ser positiva';
    ELSE
        INSERT INTO DoacaoAlimento (usuario_id, tipo, quantidade_kg)
        VALUES (p_usuario_id, p_tipo, p_quantidade_kg);
        
        SET p_doacao_id = LAST_INSERT_ID();
        SET p_resultado = CONCAT('Doação de ', p_quantidade_kg, 'kg de ', p_tipo, ' registrada');
    END IF;
END //

-- Procedure para registrar doações de roupas
CREATE PROCEDURE sp_registrar_doacao_roupa(
    IN p_usuario_id INT,
    IN p_tipo_roupa VARCHAR(50),
    IN p_quantidade INT,
    IN p_tamanho VARCHAR(10),
    IN p_condicao ENUM('nova', 'usada', 'seminova'),
    IN p_observacoes TEXT,
    OUT p_doacao_id INT,
    OUT p_resultado VARCHAR(100)
)
BEGIN
    DECLARE usuario_existe INT;
    
    -- Validações complexas para roupas
    SELECT COUNT(*) INTO usuario_existe FROM Usuario WHERE id = p_usuario_id;
    
    IF usuario_existe = 0 THEN
        SET p_resultado = 'Erro: Usuário não encontrado';
    ELSEIF p_quantidade <= 0 THEN
        SET p_resultado = 'Erro: Quantidade deve ser maior que zero';
    ELSEIF p_tamanho NOT IN ('PP', 'P', 'M', 'G', 'GG', 'XG', 'Único') AND p_tamanho IS NOT NULL THEN
        SET p_resultado = 'Erro: Tamanho inválido. Use PP, P, M, G, GG, XG ou Único';
    ELSE
        -- Registro completo com condição e observações
        INSERT INTO DoacaoRoupa (
            usuario_id, tipo, quantidade, tamanho, condicao, observacoes
        ) VALUES (
            p_usuario_id, p_tipo_roupa, p_quantidade, p_tamanho, p_condicao, p_observacoes
        );
        
        SET p_doacao_id = LAST_INSERT_ID();
        SET p_resultado = CONCAT('Doação de ', p_quantidade, ' ', p_tipo_roupa, ' registrada com sucesso');
        
        -- Atualiza estoque se a tabela existir
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'EstoqueRoupas') THEN
            INSERT INTO EstoqueRoupas (tipo_roupa, tamanho, quantidade, ultima_atualizacao)
            VALUES (p_tipo_roupa, p_tamanho, p_quantidade, NOW())
            ON DUPLICATE KEY UPDATE 
                quantidade = quantidade + p_quantidade,
                ultima_atualizacao = NOW();
        END IF;
    END IF;
END //

-- Procedure para relatórios por período
CREATE PROCEDURE sp_relatorio_doacoes_periodo(
    IN p_data_inicio DATE,
    IN p_data_fim DATE,
    IN p_tipo_doacao VARCHAR(20) -- 'todos', 'dinheiro', 'roupa', 'alimento'
)
BEGIN
    -- Relatório flexível que pode filtrar por tipo ou mostrar todos
    IF p_tipo_doacao = 'todos' OR p_tipo_doacao = 'dinheiro' THEN
        SELECT 'Doações Financeiras' AS tipo, COUNT(*) AS quantidade, SUM(valor) AS total
        FROM DoacaoDinheiro
        WHERE DATE(data_doacao) BETWEEN p_data_inicio AND p_data_fim;
    END IF;
    
    IF p_tipo_doacao = 'todos' OR p_tipo_doacao = 'roupa' THEN
        SELECT 'Doações de Roupas' AS tipo, COUNT(*) AS quantidade, SUM(quantidade) AS total_itens
        FROM DoacaoRoupa
        WHERE DATE(data_doacao) BETWEEN p_data_inicio AND p_data_fim;
    END IF;
    
    IF p_tipo_doacao = 'todos' OR p_tipo_doacao = 'alimento' THEN
        SELECT 'Doações de Alimentos' AS tipo, COUNT(*) AS quantidade, SUM(quantidade_kg) AS total_kg
        FROM DoacaoAlimento
        WHERE DATE(data_doacao) BETWEEN p_data_inicio AND p_data_fim;
    END IF;
END //

-- Procedure para identificar doadores mais ativos
CREATE PROCEDURE sp_relatorio_doadores_ativos(
    IN p_limite INT
)
BEGIN
    -- Doadores que mais contribuíram financeiramente
    SELECT u.id, u.nome, COUNT(d.id) AS num_doacoes, SUM(d.valor) AS total_doado
    FROM Usuario u
    JOIN DoacaoDinheiro d ON u.id = d.usuario_id
    GROUP BY u.id, u.nome
    ORDER BY total_doado DESC
    LIMIT p_limite;
    
    -- Doadores que mais contribuíram com itens
    SELECT u.id, u.nome, COUNT(r.id) AS num_doacoes, SUM(r.quantidade) AS total_itens
    FROM Usuario u
    JOIN DoacaoRoupa r ON u.id = r.usuario_id
    GROUP BY u.id, u.nome
    ORDER BY total_itens DESC
    LIMIT p_limite;
END //

-- Procedure para atualizar estoque durante distribuição
CREATE PROCEDURE sp_atualizar_estoque_distribuicao(
    IN p_tipo_doacao ENUM('dinheiro', 'roupa', 'alimento'),
    IN p_doacao_id INT,
    IN p_quantidade DECIMAL(10,2),
    IN p_admin_id INT
)
BEGIN
    DECLARE v_tipo_alimento VARCHAR(50);
    DECLARE v_tipo_roupa VARCHAR(50);
    
    -- Verifica permissões de administrador
    IF NOT EXISTS (SELECT 1 FROM Usuario WHERE id = p_admin_id AND tipo = 'admin') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Apenas administradores podem executar esta ação';
    ELSE
        -- Registra a distribuição
        INSERT INTO Distribuicao (doacao_id, tipo_doacao, data_distribuicao, admin_id)
        VALUES (p_doacao_id, p_tipo_doacao, CURDATE(), p_admin_id);
        
        -- Atualiza estoque de alimentos se aplicável
        IF p_tipo_doacao = 'alimento' THEN
            SELECT tipo INTO v_tipo_alimento FROM DoacaoAlimento WHERE id = p_doacao_id;
            
            UPDATE EstoqueAlimentos 
            SET quantidade_kg = quantidade_kg - p_quantidade
            WHERE tipo_alimento = v_tipo_alimento;
        END IF;
    END IF;
END //

DELIMITER ;