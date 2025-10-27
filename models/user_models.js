const db = require('../config/db');
const bcrypt = require('bcrypt');

async function UserCreate(matricula, nome_completo, login, senha_hash, perfil_id, status_usuario, ) {
    
}
/*	usuario_id 	INT AUTO_INCREMENT PRIMARY KEY,
    matricula VARCHAR(11) NOT NULL,
    nome_completo VARCHAR(255) NOT NULL,
    login VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil_id INT,
    status_usuario ENUM('Ativo', 'Inativo', 'Bloqueado'),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_modificacao TIMESTAMP,
    ultimo_login TIMESTAMP,
    FOREIGN KEY (perfil_id) REFERENCES perfis_acesso(perfil_id)*/