CREATE DATABASE IF NOT EXISTS GraceNet;
USE GraceNet;

-- apagar tabela antiga se existir
DROP TABLE IF EXISTS clientes;

SELECT * FROM clientes;

-- criar tabela principal de clientes
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    rg VARCHAR(20) UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cep VARCHAR(9) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    nome_rede VARCHAR(50) NOT NULL,
    senha_rede VARCHAR(100) NOT NULL,
    plano VARCHAR(50) NOT NULL,
    vencimento ENUM('10','20','30') NOT NULL,
    status TINYINT(1) DEFAULT(1) NOT NULL
);

ALTER TABLE clientes ADD CONSTRAINT cliente_plano FOREIGN KEY (id_plano) REFERENCES planos(id_plano);

SELECT * FROM clientes;

ALTER TABLE clientes 
ADD COLUMN id_plano INT NOT NULL;

ALTER TABLE clientes
DROP FOREIGN KEY cliente_plano;

ALTER TABLE clientes
DROP COLUMN id_plano;

CREATE TABLE planos (
  id_plano INT AUTO_INCREMENT PRIMARY KEY,
  nomeplano VARCHAR(100) NOT NULL,
  descricao TEXT,
  velocidade VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status TINYINT(1) DEFAULT 1,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE planos
CHANGE COLUMN idplano id_plano INT AUTO_INCREMENT;
DELIMITER $$

-- inserir cliente
CREATE PROCEDURE sp_cliente_inserir (
    IN p_cpf VARCHAR(14),
    IN p_nome_completo VARCHAR(255),
    IN p_data_nascimento DATE,
    IN p_rg VARCHAR(20),
    IN p_telefone VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_cep VARCHAR(9),
    IN p_rua VARCHAR(100),
    IN p_numero VARCHAR(10),
    IN p_nome_rede VARCHAR(50),
    IN p_senha_rede VARCHAR(100),
    IN p_plano VARCHAR(50),
    IN p_vencimento VARCHAR(2),
    IN p_status TINYINT(1)
    
)
BEGIN
    INSERT INTO clientes(
        cpf, nome_completo, data_nascimento, rg, telefone, email,
        cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status
    )
    VALUES (
        p_cpf, p_nome_completo, p_data_nascimento, p_rg, p_telefone, p_email,
        p_cep, p_rua, p_numero, p_nome_rede, p_senha_rede, p_plano, p_vencimento, p_status
    );

    SELECT * FROM clientes WHERE id_cliente = LAST_INSERT_ID();
END $$

-- atualizar cliente
CREATE PROCEDURE sp_cliente_atualizar (
    IN p_id_cliente INT,
    IN p_nome_completo VARCHAR(255),
    IN p_telefone VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_cep VARCHAR(9),
    IN p_rua VARCHAR(100),
    IN p_numero VARCHAR(10),
    IN p_nome_rede VARCHAR(50),
    IN p_senha_rede VARCHAR(100),
    IN p_plano VARCHAR(50),
    IN p_vencimento VARCHAR(2),
    IN status TINYINT(1)
)
BEGIN
    UPDATE clientes
    SET 
        nome_completo = p_nome_completo,
        telefone = p_telefone,
        email = p_email,
        cep = p_cep,
        rua = p_rua,
        numero = p_numero,
        nome_rede = p_nome_rede,
        senha_rede = p_senha_rede,
        plano = p_plano,
        vencimento = p_vencimento,
        status = p_status
    WHERE id_cliente = p_id_cliente;

    SELECT * FROM clientes WHERE id_cliente = p_id_cliente;
END $$

-- deletar cliente
CREATE PROCEDURE sp_cliente_deletar (
    IN p_id_cliente INT
)
BEGIN
    DELETE FROM clientes WHERE id_cliente = p_id_cliente;
END $$

DELIMITER ;
