-- ================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- ================================================

-- Índices para a tabela Usuario
CREATE INDEX idx_usuario_cpf ON Usuario(cpf);                      -- Busca rápida por CPF
CREATE INDEX idx_usuario_nascimento ON Usuario(data_nascimento);   -- Relatórios por idade
CREATE INDEX idx_usuario_composto ON Usuario(tipo, data_cadastro); -- Consultas combinadas

-- Índices para a tabela DoacaoDinheiro
CREATE INDEX idx_doacao_data ON DoacaoDinheiro(data_doacao);       -- Filtros por data
CREATE INDEX idx_doacao_dinheiro_usuario ON DoacaoDinheiro(usuario_id); -- Busca por doador
CREATE INDEX idx_doacao_dinheiro_metodo ON DoacaoDinheiro(metodo_pagamento); -- Relatórios por método

-- Índices para a tabela DoacaoRoupa
CREATE INDEX idx_doacao_roupa_tipo ON DoacaoRoupa(tipo);           -- Filtro por tipo de roupa
CREATE INDEX idx_doacao_roupa_tamanho ON DoacaoRoupa(tamanho);     -- Busca por tamanho

-- Índices para a tabela DoacaoAlimento
CREATE INDEX idx_doacao_alimento_tipo ON DoacaoAlimento(tipo);     -- Filtro por tipo de alimento

-- Índices para a tabela Distribuicao
CREATE INDEX idx_distribuicao_tipo ON Distribuicao(tipo_doacao);   -- Filtro por tipo
CREATE INDEX idx_doacao_composto ON Distribuicao(tipo_doacao, data_distribuicao); -- Combinação

-- Índices para a tabela Certificado
CREATE INDEX idx_certificado_usuario ON Certificado(usuario_id);    -- Busca por usuário
CREATE INDEX idx_certificado_data ON Certificado(data_emissao);     -- Filtro por data