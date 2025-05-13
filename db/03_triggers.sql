-- ================================================
-- TRIGGERS (AUTOMATIZAÇÕES)
-- ================================================

DELIMITER //

-- Trigger para registrar alterações em usuários (auditoria)
CREATE TRIGGER trg_log_alteracao_usuario
AFTER UPDATE ON Usuario
FOR EACH ROW
BEGIN
    -- Insere um registro de log com os dados antigos e novos
    INSERT INTO LogAlteracoes (tabela_afetada, id_registro, acao, dados_anteriores, dados_novos, data_modificacao)
    VALUES ('Usuario', NEW.id, 'UPDATE', 
            CONCAT('Nome: ', OLD.nome, ', CPF: ', OLD.cpf, ', Tipo: ', OLD.tipo),
            CONCAT('Nome: ', NEW.nome, ', CPF: ', NEW.cpf, ', Tipo: ', NEW.tipo),
            NOW());
END//

-- Trigger para validar data de nascimento
CREATE TRIGGER trg_valida_data_nascimento
BEFORE INSERT ON Usuario
FOR EACH ROW
BEGIN
    -- Impede cadastro com data no futuro
    IF NEW.data_nascimento > CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Data de nascimento não pode ser no futuro';
    END IF;
END//

-- Trigger para atualizar estoque de alimentos automaticamente
CREATE TRIGGER trg_atualiza_estoque_alimento
AFTER INSERT ON DoacaoAlimento
FOR EACH ROW
BEGIN
    -- Atualiza ou insere no estoque quando há nova doação
    INSERT INTO EstoqueAlimentos (tipo_alimento, quantidade_kg, ultima_atualizacao)
    VALUES (NEW.tipo, NEW.quantidade_kg, NOW())
    ON DUPLICATE KEY UPDATE 
        quantidade_kg = quantidade_kg + NEW.quantidade_kg,
        ultima_atualizacao = NOW();
END//

-- Trigger para gerar certificados automaticamente após distribuição
CREATE TRIGGER trg_gera_certificado_distribuicao
AFTER INSERT ON Distribuicao
FOR EACH ROW
BEGIN
    DECLARE doador_id INT;
    
    -- Encontra o doador original baseado no tipo de doação
    IF NEW.tipo_doacao = 'dinheiro' THEN
        SELECT usuario_id INTO doador_id FROM DoacaoDinheiro WHERE id = NEW.doacao_id;
    ELSEIF NEW.tipo_doacao = 'roupa' THEN
        SELECT usuario_id INTO doador_id FROM DoacaoRoupa WHERE id = NEW.doacao_id;
    ELSEIF NEW.tipo_doacao = 'alimento' THEN
        SELECT usuario_id INTO doador_id FROM DoacaoAlimento WHERE id = NEW.doacao_id;
    END IF;
    
    -- Cria certificado se encontrou o doador
    IF doador_id IS NOT NULL THEN
        INSERT INTO Certificado (usuario_id, distribuicao_id, data_emissao)
        VALUES (doador_id, NEW.id, CURDATE());
    END IF;
END//

-- Trigger para validar permissões de administrador
CREATE TRIGGER trg_valida_admin_distribuicao
BEFORE INSERT ON Distribuicao
FOR EACH ROW
BEGIN
    DECLARE user_type VARCHAR(10);
    
    -- Verifica se o usuário é administrador
    SELECT tipo INTO user_type FROM Usuario WHERE id = NEW.admin_id;
    
    IF user_type != 'admin' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Apenas administradores podem registrar distribuições';
    END IF;
END//

-- Trigger para registrar histórico de doações financeiras
CREATE TRIGGER trg_historico_doacao_dinheiro
AFTER INSERT ON DoacaoDinheiro
FOR EACH ROW
BEGIN
    -- Insere no histórico automaticamente
    INSERT INTO HistoricoDoacoes (usuario_id, tipo_doacao, valor, data_registro)
    VALUES (NEW.usuario_id, 'dinheiro', NEW.valor, NOW());
END//

DELIMITER ;