-- ============================================================
-- 1. CRIAÇÃO DO BANCO
-- ============================================================
CREATE DATABASE IF NOT EXISTS GraceNet;
USE GraceNet;

-- ============================================================
-- 2. TABELA DE PERFIS DE ACESSO
-- ============================================================
CREATE TABLE perfis_acesso(
    perfil_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(100) UNIQUE NOT NULL,
    descricao TEXT
);

INSERT INTO perfis_acesso (perfil_id, nome_perfil) VALUES
(1, 'Administrador'),
(2, 'Técnico');

-- ============================================================
-- 3. TABELA DE USUÁRIOS
-- ============================================================
CREATE TABLE usuarios(
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(11) NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil_id INT,
    status_usuario ENUM('Ativo', 'Inativo', 'Bloqueado') DEFAULT 'Ativo',
    ultimo_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    foto_perfil LONGTEXT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(perfil_id)
);

INSERT INTO usuarios(matricula, nome_completo, login, senha_hash, perfil_id, status_usuario)
VALUES ('000001','Administrador do Sistema','admin',
'$2b$10$C1uDnXb4OZ7M7oE1N9Q2.eJqRnUo3p9qM2K6bYh5f1v8lZz2mF.UK',1,'Ativo');

-- ============================================================
-- 4. TABELA DE PLANOS
-- ============================================================
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

-- ============================================================
-- 5. TABELA DE CLIENTES
-- ============================================================
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
    status TINYINT(1) DEFAULT 1,
    id_plano INT,
    
    FOREIGN KEY (id_plano) REFERENCES planos(id_plano)
);

-- ============================================================
-- 6. TABELA DE TÉCNICOS
-- ============================================================
CREATE TABLE tecnicos(
    id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) NOT NULL,
    equipe VARCHAR(100) NOT NULL,
    status ENUM('Ativo', 'Férias', 'Inativo') NOT NULL
);

INSERT INTO tecnicos(nome,matricula,equipe,status)
VALUES ('João Silva','TEC001','Equipe A','Ativo');

-- ============================================================
-- 7. TABELA POP (TORRES)
-- ============================================================
CREATE TABLE pop(
    id_torre INT AUTO_INCREMENT PRIMARY KEY,
    localizacao VARCHAR(255) NOT NULL,
    ip_gerenciamento VARCHAR(45) NOT NULL
);

-- ============================================================
-- 8. TABELA DE EQUIPAMENTOS
-- ============================================================
CREATE TABLE equipamentos(
    id_equipamento BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    fabricante VARCHAR(100),
    numero_serie VARCHAR(100) UNIQUE,
    mac_adress VARCHAR(17),
    ip_gerenciado VARCHAR(45),
    firmware VARCHAR(50),
    status ENUM('Ativo', 'Manutenção', 'Defeituoso', 'Sucata', 'Disponível', 'Desativado') DEFAULT 'Disponível',
    localizacao VARCHAR(100) NOT NULL,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. TABELA DE VÍNCULOS DE EQUIPAMENTOS
-- ============================================================
CREATE TABLE equipamento_vinculo (
    id_vinculo INT AUTO_INCREMENT PRIMARY KEY,
    id_equipamento BIGINT,
    tipo_vinculo ENUM('cliente', 'torre', 'estoque') NOT NULL,
    id_cliente INT,
    id_torre INT,
    data_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_fim DATETIME,
    observacao VARCHAR(255),

    FOREIGN KEY (id_equipamento) REFERENCES equipamentos(id_equipamento),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_torre) REFERENCES pop(id_torre)
);

-- ============================================================
-- 10. TABELA DE MOVIMENTAÇÃO DE EQUIPAMENTOS
-- ============================================================
CREATE TABLE movimentacoes_equipamento (
    id_mov INT AUTO_INCREMENT PRIMARY KEY,
    id_equipamento BIGINT NOT NULL,
    acao ENUM('instalacao','remocao','manutencao','transferencia') NOT NULL,
    id_tecnico INT NOT NULL,
    usuario_id INT NOT NULL,
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,

    FOREIGN KEY (id_equipamento) REFERENCES equipamentos(id_equipamento),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
);

-- ============================================================
-- 11. TABELA DE SUPORTE (OS)
-- ============================================================
CREATE TABLE suportes(
    os_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao_problema TEXT NOT NULL,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    inicio_desejado DATETIME,
    conclusao_desejada DATETIME,
    status ENUM('Aberta','Em Atendimento','Agendada','Pendente','Resolvida','Cancelada') NOT NULL,
    prioridade ENUM('Baixa','Média','Alta','Urgente') NOT NULL,
    id_cliente INT,
    id_tecnico INT,
    codigo_os VARCHAR(20) UNIQUE,

    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico)
);

-- ============================================================
-- 12. TRIGGER PARA GERAR CÓDIGO DE OS
-- ============================================================
DELIMITER //
CREATE TRIGGER gerar_codigo_os
BEFORE INSERT ON suportes
FOR EACH ROW
BEGIN
    SET NEW.codigo_os = CONCAT('#os', LPAD(FLOOR(RAND()*900000+100000), 6, '0'));
END;
//
DELIMITER ;

-- ============================================================
-- 13. TABELA DE LOGS
-- ============================================================
CREATE TABLE log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    tabela_afetada VARCHAR(100) NOT NULL,
    id_registro_afetado BIGINT,
    tipo_acao ENUM('INSERÇÃO','ATUALIZAÇÃO','EXCLUSÃO') NOT NULL,
    descricao_acao TEXT,
    usuario_responsavel VARCHAR(100),
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 14. PROCEDURES DE CLIENTES
-- ============================================================
DELIMITER $$
CREATE PROCEDURE sp_cliente_inserir(
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
    INSERT INTO clientes (
        cpf, nome_completo, data_nascimento, rg, telefone, email,
        cep, rua, numero, nome_rede, senha_rede, plano, vencimento,
        status, id_plano
    )
    VALUES (
        p_cpf, p_nome_completo, p_data_nascimento, p_rg, p_telefone, p_email,
        p_cep, p_rua, p_numero, p_nome_rede, p_senha_rede, p_plano,
        p_vencimento, p_status, p_id_plano
    );
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_cliente_deletar(IN p_id_cliente INT)
BEGIN
    DELETE FROM clientes WHERE id_cliente = p_id_cliente;
END $$
DELIMITER ;

-- ============================================================
-- 15. PROCEDURES DE EQUIPAMENTOS
-- ============================================================

-- inserir
DELIMITER //
CREATE PROCEDURE sp_inserir_equipamento(
    IN p_tipo VARCHAR(50),
    IN p_modelo VARCHAR(100),
    IN p_fabricante VARCHAR(100),
    IN p_numero_serie VARCHAR(100),
    IN p_localizacao VARCHAR(100),
    IN p_status VARCHAR(30)
)
BEGIN
    INSERT INTO equipamentos(tipo,modelo,fabricante,numero_serie,localizacao,status)
    VALUES (p_tipo,p_modelo,p_fabricante,p_numero_serie,p_localizacao,p_status);
END //
DELIMITER ;

-- editar
DELIMITER //
CREATE PROCEDURE sp_editar_equipamento(
    IN p_id BIGINT,
    IN p_tipo VARCHAR(50),
    IN p_modelo VARCHAR(100),
    IN p_fabricante VARCHAR(100),
    IN p_numero_serie VARCHAR(100),
    IN p_localizacao VARCHAR(100),
    IN p_status VARCHAR(30)
)
BEGIN
    UPDATE equipamentos
    SET tipo=p_tipo,
        modelo=p_modelo,
        fabricante=p_fabricante,
        numero_serie=p_numero_serie,
        localizacao=p_localizacao,
        status=p_status
    WHERE id_equipamento=p_id;
END //
DELIMITER ;

-- excluir
DELIMITER //
CREATE PROCEDURE sp_excluir_equipamento(IN p_id BIGINT)
BEGIN
    DELETE FROM equipamentos WHERE id_equipamento=p_id;
END //
DELIMITER ;

-- ============================================================
-- 16. TRIGGERS DE LOGS (EQUIPAMENTOS, CLIENTES, SUPORTE)
-- ============================================================

-- Equipamentos
DELIMITER //
CREATE TRIGGER trg_equipamento_insert
AFTER INSERT ON equipamentos
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('equipamentos',NEW.id_equipamento,'INSERÇÃO',
    CONCAT('Novo equipamento cadastrado: ', NEW.modelo,' | Nº Série: ',NEW.numero_serie),
    CURRENT_USER());
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_equipamento_update
AFTER UPDATE ON equipamentos
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('equipamentos',NEW.id_equipamento,'ATUALIZAÇÃO',
    CONCAT('Modelo: ',OLD.modelo,' → ',NEW.modelo,' | Status: ',OLD.status,' → ',NEW.status),
    CURRENT_USER());
END //
DELIMITER ;

-- Clientes
DELIMITER //
CREATE TRIGGER trg_cliente_insert
AFTER INSERT ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('clientes',NEW.id_cliente,'INSERÇÃO',
    CONCAT('Novo cliente: ',NEW.nome_completo,' | CPF: ',NEW.cpf),
    CURRENT_USER());
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_cliente_update
AFTER UPDATE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('clientes',NEW.id_cliente,'ATUALIZAÇÃO',
    CONCAT('Nome: ',OLD.nome_completo,' → ',NEW.nome_completo),
    CURRENT_USER());
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_cliente_delete
AFTER DELETE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('clientes',OLD.id_cliente,'EXCLUSÃO',
    CONCAT('Cliente removido: ',OLD.nome_completo),
    CURRENT_USER());
END //
DELIMITER ;

-- Suportes (OS)
DELIMITER //
CREATE TRIGGER trg_suporte_insert
AFTER INSERT ON suportes
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('suportes',NEW.os_id,'INSERÇÃO',
    CONCAT('Nova OS: ',NEW.titulo,' | Status: ',NEW.status),
    CURRENT_USER());
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_suporte_update
AFTER UPDATE ON suportes
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('suportes',NEW.os_id,'ATUALIZAÇÃO',
    CONCAT('Status: ',OLD.status,' → ',NEW.status),
    CURRENT_USER());
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_suporte_delete
AFTER DELETE ON suportes
FOR EACH ROW
BEGIN
    INSERT INTO log(tabela_afetada,id_registro_afetado,tipo_acao,descricao_acao,usuario_responsavel)
    VALUES ('suportes',OLD.os_id,'EXCLUSÃO',
    CONCAT('OS removida: ',OLD.titulo),
    CURRENT_USER());
END //
DELIMITER ;
