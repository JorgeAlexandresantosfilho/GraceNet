CREATE DATABASE IF NOT EXISTS GraceNet;
USE GraceNet;

-- apagar tabela antiga se existir
DROP TABLE IF EXISTS clientes;
SHOW CREATE PROCEDURE sp_cliente_inserir;
SELECT * FROM clientes;
SELECT * FROM planos;
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
CREATE TABLE tecnicos(
	id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    equipe VARCHAR(100) NOT NULL,
    status ENUM('Ativo', 'Férias', 'Inativo') NOT NULL
);
CREATE TABLE suportes(
   os_id INT AUTO_INCREMENT PRIMARY KEY,
   titulo VARCHAR(255) NOT NULL,
   descricao_problema TEXT NOT NULL,
   data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
   inicio_desejado DATETIME,
   conclusao_desejada DATETIME,
   status ENUM('Aberta', 'Em Atendimento', 'Agendada', 'Pendente', 'Resolvida', 'Cancelada') NOT NULL,
   prioridade ENUM('Baixa', 'Média', 'Alta', 'Urgente') NOT NULL,
   id_cliente INT,
   id_tecnico INT,
   FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
   FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico)
) ENGINE=InnoDB;
DROP TABLE suportes;
DROP TABLE interacoes_os;
CREATE TABLE usuarios(
	usuario_id 	INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(11) NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    login VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil_id INT,
    status_usuario ENUM('Ativo', 'Inativo', 'Bloqueado'),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP,
    ultimo_login TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(perfil_id)
) ENGINE=InnoDB;

CREATE TABLE interacoes_os(
	interacao_id INT AUTO_INCREMENT PRIMARY KEY,
    os_id INT,
    usuario_id INT,
    descricao TEXT NOT NULL,
    data_interacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_interacao ENUM('Comentário Interno', 'Contato com Cliente', 'Atualização de Status', 'Solução Aplicada') NOT NULL,
    FOREIGN KEY (os_id) REFERENCES suportes(os_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
) ENGINE=InnoDB;

CREATE TABLE perfis_acesso(
	perfil_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(100) UNIQUE,
    descricao TEXT 
);

-- inserir cliente
DROP PROCEDURE IF EXISTS sp_cliente_inserir;
DESCRIBE clientes;

DROP PROCEDURE IF EXISTS sp_cliente_inserir;
DELIMITER $$
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
    IN p_status TINYINT(1),
    IN p_id_plano INT 
)
BEGIN
    INSERT INTO clientes(
        cpf, nome_completo, data_nascimento, rg, telefone, email,
        cep, rua, numero, nome_rede, senha_rede, plano, vencimento, status, id_plano
    )
    VALUES (
        p_cpf, p_nome_completo, p_data_nascimento, p_rg, p_telefone, p_email,
        p_cep, p_rua, p_numero, p_nome_rede, p_senha_rede, p_plano, p_vencimento, p_status, p_id_plano
    );

    SELECT * FROM clientes WHERE id_cliente = LAST_INSERT_ID();
END $$
DELIMITER ;

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
    IN status TINYINT(1),
	IN p_id_plano INT 
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
        status = p_status, 
        id_plano = p_id_plano
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
