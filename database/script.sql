-- SGBD: MySQL 8.0+ - Quackly

-- 1. CRIACAO DO BANCO
CREATE DATABASE IF NOT EXISTS quackly_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE quackly_db;

-- 2. CRIACAO DAS TABELAS
CREATE TABLE IF NOT EXISTS usuario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NULL,
    nome VARCHAR(255) NULL,
    senha VARCHAR(255) NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS movimentacoes (
    id_movimentacao BIGINT NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT NOT NULL,
    tipo_movimentacao VARCHAR(15) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data DATETIME NOT NULL,
    PRIMARY KEY (id_movimentacao),
    INDEX idx_movimentacoes_id_usuario (id_usuario),
    CONSTRAINT chk_movimentacoes_tipo
        CHECK (tipo_movimentacao IN ('Entrada', 'Saida')),
    CONSTRAINT fk_movimentacoes_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE = InnoDB;



--------------------------------------------------------------------
-- 3. INSERCAO DE DADOS (INSERT)
-- Os exemplos abaixo evitam inserir os mesmos registros novamente.

INSERT INTO usuario (email, nome, senha)
SELECT 'teste@quackly.com', 'Usuario de teste', 'senha123'
WHERE NOT EXISTS (
    SELECT 1
    FROM usuario
    WHERE email = 'teste@quackly.com'
);

INSERT INTO movimentacoes
    (id_usuario, tipo_movimentacao, valor, nome, data)
SELECT
    u.id, 'Entrada', 150.00, 'Salario', '2026-11-22 10:00:00'
FROM usuario AS u
WHERE u.email = 'teste@quackly.com'
  AND NOT EXISTS (
      SELECT 1
      FROM movimentacoes AS m
      WHERE m.id_usuario = u.id
        AND m.tipo_movimentacao = 'Entrada'
        AND m.valor = 150.00
        AND m.nome = 'Salario'
        AND m.data = '2026-11-22 10:00:00'
  );

-- 4. CONSULTA DE DADOS (SELECT)
SELECT * FROM usuario;

SELECT * FROM movimentacoes;

SELECT
    m.id_movimentacao,
    u.nome AS usuario,
    m.tipo_movimentacao,
    m.valor,
    m.nome AS descricao,
    m.data
FROM movimentacoes AS m
INNER JOIN usuario AS u ON u.id = m.id_usuario
ORDER BY m.data DESC;

SELECT *
FROM movimentacoes
WHERE tipo_movimentacao = 'Entrada';

SELECT *
FROM movimentacoes
WHERE tipo_movimentacao = 'Saida';

-- 5. ATUALIZACAO DE DADOS (UPDATE)

UPDATE usuario
SET nome = 'Novo nome'
WHERE id = 1;

UPDATE movimentacoes
SET tipo_movimentacao = 'Saida',
     valor = 75.00,
     nome = 'Compra atualizada'
WHERE id_movimentacao = 1;

-- 6. EXCLUSAO DE DADOS (DELETE)
-- Exclua primeiro as movimentacoes e depois o usuario.

DELETE FROM movimentacoes
WHERE id_movimentacao = 1;

DELETE FROM usuario
WHERE id = 1;

-- 7. VERIFICACAO DA ESTRUTURA
SHOW TABLES;
DESCRIBE usuario;
DESCRIBE movimentacoes;