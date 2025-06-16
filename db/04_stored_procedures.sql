-- ================================================
-- STORED FUNCTIONS (LÓGICA DE NEGÓCIO) PARA POSTGRESQL
-- ================================================

-- ================================================
-- 1. Função para cadastrar usuários (sp_cadastrar_usuario)
-- ================================================
CREATE OR REPLACE FUNCTION sp_cadastrar_usuario(
    p_nome VARCHAR(255),
    p_cpf VARCHAR(14),
    p_telefone VARCHAR(20),
    p_senha_hash VARCHAR(255), -- A função deve receber a senha já hasheada pela aplicação
    p_data_nascimento DATE
)
RETURNS TEXT AS $$
DECLARE
    cpf_existe BOOLEAN;
    novo_id INT;
BEGIN
    SELECT EXISTS(SELECT 1 FROM Usuario WHERE cpf = p_cpf) INTO cpf_existe;
    
    IF cpf_existe THEN
        RETURN 'Erro: CPF já cadastrado';
    ELSE
        -- Nota: A função SHA2() foi removida. A aplicação deve fornecer o hash.
        -- A cláusula RETURNING id INTO novo_id é a forma de obter o ID do novo registro.
        INSERT INTO Usuario (nome, cpf, telefone, senha_hash, data_nascimento)
        VALUES (p_nome, p_cpf, p_telefone, p_senha_hash, p_data_nascimento)
        RETURNING id INTO novo_id;
        
        RETURN 'Usuário ' || p_nome || ' cadastrado com sucesso. ID: ' || novo_id;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- ================================================
-- 2. Funções para registrar doações (sp_registrar_doacao_...)
--    (Retornando o ID da nova doação)
-- ================================================

-- Doação de Dinheiro
CREATE OR REPLACE FUNCTION sp_registrar_doacao_dinheiro(
    p_usuario_id INT,
    p_valor DECIMAL(10,2),
    p_metodo_pagamento VARCHAR(10)
)
RETURNS INT AS $$
DECLARE
    nova_doacao_id INT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Usuario WHERE id = p_usuario_id) THEN
        RAISE EXCEPTION 'Erro: Usuário não encontrado';
    ELSIF p_valor <= 0 THEN
        RAISE EXCEPTION 'Erro: Valor deve ser positivo';
    END IF;

    INSERT INTO DoacaoDinheiro (usuario_id, valor, metodo_pagamento)
    VALUES (p_usuario_id, p_valor, p_metodo_pagamento)
    RETURNING id INTO nova_doacao_id;
        
    RETURN nova_doacao_id;
END;
$$ LANGUAGE plpgsql;

-- Doação de Alimentos
CREATE OR REPLACE FUNCTION sp_registrar_doacao_alimento(
    p_usuario_id INT,
    p_tipo VARCHAR(50),
    p_quantidade_kg DECIMAL(5,2)
)
RETURNS INT AS $$
DECLARE
    nova_doacao_id INT;
BEGIN
    IF p_quantidade_kg <= 0 THEN
        RAISE EXCEPTION 'Erro: Quantidade deve ser positiva';
    END IF;

    INSERT INTO DoacaoAlimento (usuario_id, tipo, quantidade_kg)
    VALUES (p_usuario_id, p_tipo, p_quantidade_kg)
    RETURNING id INTO nova_doacao_id;
        
    RETURN nova_doacao_id;
END;
$$ LANGUAGE plpgsql;


-- ================================================
-- 3. Funções de Relatório
--    (Procedures que retornavam múltiplos resultados foram ajustadas)
-- ================================================

-- Relatório de doações por período (consolidado em uma única saída)
CREATE OR REPLACE FUNCTION sp_relatorio_doacoes_periodo(
    p_data_inicio DATE,
    p_data_fim DATE
)
-- A cláusula RETURNS TABLE define a estrutura da tabela que será retornada.
RETURNS TABLE(tipo_doacao TEXT, quantidade BIGINT, total_arrecadado NUMERIC) AS $$
BEGIN
    RETURN QUERY
        SELECT 'Doações Financeiras' AS tipo_doacao, COUNT(*) AS quantidade, SUM(valor) AS total_arrecadado
        FROM DoacaoDinheiro
        WHERE DATE(data_doacao) BETWEEN p_data_inicio AND p_data_fim
    UNION ALL
        SELECT 'Doações de Roupas' AS tipo_doacao, COUNT(*) AS quantidade, SUM(quantidade) AS total_arrecadado
        FROM DoacaoRoupa
        WHERE DATE(data_doacao) BETWEEN p_data_inicio AND p_data_fim
    UNION ALL
        SELECT 'Doações de Alimentos' AS tipo_doacao, COUNT(*) AS quantidade, SUM(quantidade_kg) AS total_arrecadado
        FROM DoacaoAlimento
        WHERE DATE(data_doacao) BETWEEN p_data_inicio AND p_data_fim;
END;
$$ LANGUAGE plpgsql;


-- Relatório de doadores mais ativos (dividido em duas funções, uma para cada tipo de resultado)

-- Doadores mais ativos (financeiro)
CREATE OR REPLACE FUNCTION sp_relatorio_doadores_ativos_dinheiro(p_limite INT)
RETURNS TABLE(id_usuario INT, nome_usuario VARCHAR, num_doacoes BIGINT, total_doado NUMERIC) AS $$
BEGIN
    RETURN QUERY
        SELECT u.id, u.nome, COUNT(d.id), SUM(d.valor)
        FROM Usuario u
        JOIN DoacaoDinheiro d ON u.id = d.usuario_id
        GROUP BY u.id, u.nome
        ORDER BY SUM(d.valor) DESC
        LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- Doadores mais ativos (itens)
CREATE OR REPLACE FUNCTION sp_relatorio_doadores_ativos_itens(p_limite INT)
RETURNS TABLE(id_usuario INT, nome_usuario VARCHAR, num_doacoes BIGINT, total_itens NUMERIC) AS $$
BEGIN
    RETURN QUERY
        SELECT u.id, u.nome, COUNT(r.id), SUM(r.quantidade)
        FROM Usuario u
        JOIN DoacaoRoupa r ON u.id = r.usuario_id
        GROUP BY u.id, u.nome
        ORDER BY SUM(r.quantidade) DESC
        LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;