CREATE DATABASE IF NOT EXISTS GraceNet;
USE GraceNet;

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

ALTER TABLE suportes ADD COLUMN codigo_os VARCHAR(20) UNIQUE;
-- trigger feita para gerar um codigo unico personalizado para ordem de servico
DELIMITER //
CREATE TRIGGER gerar_codigo_os
BEFORE INSERT ON suportes
FOR EACH ROW
BEGIN
    DECLARE novo_codigo VARCHAR(20);
    SET novo_codigo = CONCAT('#os', LPAD(FLOOR(RAND() * 900000 + 100000), 6, '0'));
    SET NEW.codigo_os = novo_codigo;
END;
//
DELIMITER ;

-- modificacoes em tabelas
ALTER TABLE clientes ADD CONSTRAINT cliente_plano FOREIGN KEY (id_plano) REFERENCES planos(id_plano);

SELECT * FROM clientes;

ALTER TABLE clientes 
ADD COLUMN id_plano INT NOT NULL;

ALTER TABLE clientes
DROP FOREIGN KEY cliente_plano;

ALTER TABLE clientes
DROP COLUMN id_plano;

ALTER TABLE equipamentos ADD FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente);

ALTER TABLE equipamentos ADD id_cliente INT;

DROP TABLE interacoes_os;

ALTER TABLE suportes ADD COLUMN data_interacao DATETIME DEFAULT CURRENT_TIMESTAMP;

-- finaliza aqui 


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

CREATE TABLE equipamentos(
id_equipamento BIGINT PRIMARY KEY AUTO_INCREMENT,
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


CREATE TABLE pop(
id_torre INT AUTO_INCREMENT PRIMARY KEY,
localizacao VARCHAR(255) NOT NULL,
ip_gerenciamento VARCHAR(45) NOT NULL
);

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
    FOREIGN KEY (id_torre) REFERENCES pop(id_torre)
);

CREATE TABLE movimentacoes_equipamento (
    id_mov INT AUTO_INCREMENT PRIMARY KEY,
    id_equipamento BIGINT NOT NULL,
    acao ENUM('instalacao', 'remocao', 'manutencao', 'transferencia') NOT NULL,
    id_tecnico INT NOT NULL,
    usuario_id INT NOT NULL,
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,
    FOREIGN KEY (id_equipamento) REFERENCES equipamentos(id_equipamento),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
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


CREATE TABLE perfis_acesso(
	perfil_id INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(100) UNIQUE,
    descricao TEXT 
);

CREATE TABLE log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    tabela_afetada VARCHAR(100) NOT NULL,
    id_registro_afetado BIGINT,
    tipo_acao ENUM('INSERÇÃO', 'ATUALIZAÇÃO', 'EXCLUSÃO') NOT NULL,
    descricao_acao TEXT,
    usuario_responsavel VARCHAR(100),
    data_acao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- inserir cliente
DESCRIBE clientes;

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
DELIMITER $$

DELIMITER //
-- deletar cliente
CREATE PROCEDURE sp_cliente_deletar (
    IN p_id_cliente INT
)
BEGIN
    DELETE FROM clientes WHERE id_cliente = p_id_cliente;
END $$

DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_inserir_equipamento (
    IN p_id_equipamento BIGINT,
    IN p_tipo VARCHAR(50),
    IN p_modelo VARCHAR(100),
    IN p_fabricante VARCHAR(100),
    IN p_numero_serie VARCHAR(100),
    IN p_localizacao VARCHAR(100),
    IN p_status VARCHAR(30),
    IN p_observacoes TEXT
)
BEGIN
    INSERT INTO equipamentos (
        id_equipamento, tipo, modelo, fabricante, numero_serie,
        localizacao, status, observacoes
    )
    VALUES (
        p_idequipamento, p_tipo, p_modelo, p_fabricante, p_numero_serie,
        p_localizacao, p_status, p_observacoes
    );
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_editar_equipamento (
    IN p_id_equipamento BIGINT,
    IN p_tipo VARCHAR(50),
    IN p_modelo VARCHAR(100),
    IN p_fabricante VARCHAR(100),
    IN p_numero_serie VARCHAR(100),
    IN p_localizacao VARCHAR(100),
    IN p_status VARCHAR(30),
    IN p_observacoes TEXT
)
BEGIN
    UPDATE equipamentos
    SET tipo = p_tipo,
        modelo = p_modelo,
        fabricante = p_fabricante,
        numero_serie = p_numero_serie,
        localizacao = p_localizacao,
        status = p_status,
        observacoes = p_observacoes
    WHERE id_equipamento = p_id_equipamento;
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE sp_excluir_equipamento (
    IN p_id_equipamento BIGINT
)
BEGIN
    DELETE FROM equipamentos WHERE id_equipamento = p_id_equipamento;
END //
DELIMITER ;

-- TRIGGERS PARA ALIMENTAR A TABELA DE LOGS (EQUIPAMENTOS)


DELIMITER //
CREATE TRIGGER trg_equipamento_insert
AFTER INSERT ON equipamentos
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'equipamentos',
        NEW.id_equipamento,
        'INSERÇÃO',
        CONCAT('Novo equipamento cadastrado: ', NEW.modelo, ' | Nº Série: ', NEW.numero_serie, ' | Localização: ', NEW.localizacao),
        CURRENT_USER()
    );
END //
DELIMITER ;


DELIMITER //
CREATE TRIGGER trg_equipamento_update
AFTER UPDATE ON equipamentos
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'equipamentos',
        NEW.id_equipamento,
        'ATUALIZAÇÃO',
        CONCAT('Equipamento atualizado. Modelo: ', OLD.modelo, ' → ', NEW.modelo, ' | Status: ', OLD.status, ' → ', NEW.status),
        CURRENT_USER()
    );
END //
DELIMITER ;

-- TRIGGERS PARA LOGS (CLIENTES)

DELIMITER //
CREATE TRIGGER trg_cliente_insert
AFTER INSERT ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'clientes',
        NEW.id_cliente,
        'INSERÇÃO',
        CONCAT('Novo cliente cadastrado: ', NEW.nome_completo, ' | CPF: ', NEW.cpf),
        CURRENT_USER()
    );
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_cliente_update
AFTER UPDATE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'clientes',
        NEW.id_cliente,
        'ATUALIZAÇÃO',
        CONCAT('Cliente atualizado: ', OLD.nome_completo, ' → ', NEW.nome_completo, ' | Status: ', OLD.status, ' → ', NEW.status),
        CURRENT_USER()
    );
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_cliente_delete
AFTER DELETE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'clientes',
        OLD.id_cliente,
        'EXCLUSÃO',
        CONCAT('Cliente removido: ', OLD.nome_completo, ' | CPF: ', OLD.cpf),
        CURRENT_USER()
    );
END //
DELIMITER ;

-- TRIGGERS PARA LOGS (SUPORTE)

DELIMITER //
CREATE TRIGGER trg_suporte_insert
AFTER INSERT ON suportes
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'suportes',
        NEW.os_id,
        'INSERÇÃO',
        CONCAT('Nova OS criada: ', NEW.titulo, ' | Status: ', NEW.status),
        CURRENT_USER()
    );
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_suporte_update
AFTER UPDATE ON suportes
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'suportes',
        NEW.os_id,
        'ATUALIZAÇÃO',
        CONCAT('OS atualizada: ', OLD.status, ' → ', NEW.status),
        CURRENT_USER()
    );
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_suporte_delete
AFTER DELETE ON suportes
FOR EACH ROW
BEGIN
    INSERT INTO log (
        tabela_afetada,
        id_registro_afetado,
        tipo_acao,
        descricao_acao,
        usuario_responsavel
    ) VALUES (
        'suportes',
        OLD.os_id,
        'EXCLUSÃO',
        CONCAT('OS removida: ', OLD.titulo, ' | Status final: ', OLD.status),
        CURRENT_USER()
    );
END //
DELIMITER ;

SELECT * FROM log ORDER BY data_acao DESC;

SHOW procedure status;

