-- ================================================
-- TRIGGERS (AUTOMATIZAÇÕES) PARA POSTGRESQL
-- ================================================

-- ================================================
-- 1. Trigger para registrar alterações em usuários (trg_log_alteracao_usuario)
-- ================================================

-- 1.A. Função para o Trigger
CREATE OR REPLACE FUNCTION fn_log_alteracao_usuario()
RETURNS TRIGGER AS $$
BEGIN
    -- Nota: A tabela Usuario no schema fornecido não tem a coluna 'tipo'.
    -- A lógica foi ajustada para refletir o schema.
    -- O operador '||' é o padrão para concatenar strings em SQL.
    INSERT INTO LogAlteracoes (tabela_afetada, id_registro, acao, dados_anteriores, dados_novos, data_modificacao)
    VALUES ('Usuario', NEW.id, 'UPDATE', 
            'Nome: ' || OLD.nome || ', CPF: ' || OLD.cpf,
            'Nome: ' || NEW.nome || ', CPF: ' || NEW.cpf,
            NOW());
            
    -- Em triggers AFTER, o valor de retorno é ignorado, mas é boa prática retornar NEW.
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1.B. Trigger que executa a função
CREATE TRIGGER trg_log_alteracao_usuario
AFTER UPDATE ON Usuario
FOR EACH ROW
EXECUTE FUNCTION fn_log_alteracao_usuario();

-- ================================================
-- 2. Trigger para validar data de nascimento (trg_valida_data_nascimento)
-- ================================================

-- 2.A. Função para o Trigger
CREATE OR REPLACE FUNCTION fn_valida_data_nascimento()
RETURNS TRIGGER AS $$
BEGIN
    -- CURDATE() do MySQL é CURRENT_DATE no PostgreSQL.
    IF NEW.data_nascimento > CURRENT_DATE THEN
        -- SIGNAL SQLSTATE é trocado por RAISE EXCEPTION.
        RAISE EXCEPTION 'Data de nascimento não pode ser no futuro';
    END IF;
    
    -- Triggers BEFORE precisam retornar NEW para permitir que a operação continue.
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2.B. Trigger que executa a função
CREATE TRIGGER trg_valida_data_nascimento
BEFORE INSERT ON Usuario
FOR EACH ROW
EXECUTE FUNCTION fn_valida_data_nascimento();

-- ================================================
-- 3. Trigger para atualizar estoque (trg_atualiza_estoque_alimento)
-- ================================================

-- 3.A. Função para o Trigger
CREATE OR REPLACE FUNCTION fn_atualiza_estoque_alimento()
RETURNS TRIGGER AS $$
BEGIN
    -- 'ON DUPLICATE KEY UPDATE' (MySQL) é trocado por 'ON CONFLICT (coluna) DO UPDATE' (PostgreSQL).
    -- Assumindo que 'tipo_alimento' é uma chave única na tabela EstoqueAlimentos.
    INSERT INTO EstoqueAlimentos (tipo_alimento, quantidade_kg, ultima_atualizacao)
    VALUES (NEW.tipo, NEW.quantidade_kg, NOW())
    ON CONFLICT (tipo_alimento) DO UPDATE SET 
        quantidade_kg = EstoqueAlimentos.quantidade_kg + NEW.quantidade_kg,
        ultima_atualizacao = NOW();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3.B. Trigger que executa a função
CREATE TRIGGER trg_atualiza_estoque_alimento
AFTER INSERT ON DoacaoAlimento
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_estoque_alimento();

-- ================================================
-- 4. Trigger para gerar certificados (trg_gera_certificado_distribuicao)
-- ================================================

-- 4.A. Função para o Trigger
CREATE OR REPLACE FUNCTION fn_gera_certificado_distribuicao()
RETURNS TRIGGER AS $$
DECLARE
    -- A declaração de variáveis ocorre no bloco DECLARE.
    id_doador INT;
BEGIN
    IF NEW.tipo_doacao = 'dinheiro' THEN
        SELECT usuario_id INTO id_doador FROM DoacaoDinheiro WHERE id = NEW.doacao_id;
    ELSEIF NEW.tipo_doacao = 'roupa' THEN
        SELECT usuario_id INTO id_doador FROM DoacaoRoupa WHERE id = NEW.doacao_id;
    ELSEIF NEW.tipo_doacao = 'alimento' THEN
        SELECT usuario_id INTO id_doador FROM DoacaoAlimento WHERE id = NEW.doacao_id;
    END IF;
    
    IF id_doador IS NOT NULL THEN
        -- CURDATE() do MySQL é CURRENT_DATE no PostgreSQL.
        INSERT INTO Certificado (usuario_id, distribuicao_id, data_emissao)
        VALUES (id_doador, NEW.id, CURRENT_DATE);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4.B. Trigger que executa a função
CREATE TRIGGER trg_gera_certificado_distribuicao
AFTER INSERT ON Distribuicao
FOR EACH ROW
EXECUTE FUNCTION fn_gera_certificado_distribuicao();

-- ================================================
-- 5. Trigger para validar permissões de admin (trg_valida_admin_distribuicao)
-- ================================================

-- 5.A. Função para o Trigger
CREATE OR REPLACE FUNCTION fn_valida_admin_distribuicao()
RETURNS TRIGGER AS $$
DECLARE
    admin_existe BOOLEAN;
BEGIN
    -- Verifica se o ID do admin existe na tabela Administrador, conforme o schema.
    SELECT EXISTS(SELECT 1 FROM Administrador WHERE id = NEW.admin_id) INTO admin_existe;
    
    IF NOT admin_existe THEN
        RAISE EXCEPTION 'Apenas administradores registrados podem registrar distribuições.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5.B. Trigger que executa a função
CREATE TRIGGER trg_valida_admin_distribuicao
BEFORE INSERT ON Distribuicao
FOR EACH ROW
EXECUTE FUNCTION fn_valida_admin_distribuicao();

-- ================================================
-- 6. Trigger para histórico de doações (trg_historico_doacao_dinheiro)
-- ================================================

-- 6.A. Função para o Trigger
CREATE OR REPLACE FUNCTION fn_historico_doacao_dinheiro()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO HistoricoDoacoes (usuario_id, tipo_doacao, valor, data_registro)
    VALUES (NEW.usuario_id, 'dinheiro', NEW.valor, NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6.B. Trigger que executa a função
CREATE TRIGGER trg_historico_doacao_dinheiro
AFTER INSERT ON DoacaoDinheiro
FOR EACH ROW
EXECUTE FUNCTION fn_historico_doacao_dinheiro();