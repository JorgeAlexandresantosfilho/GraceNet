CREATE TABLE IF NOT EXISTS faturas (
    id_fatura INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    status ENUM('Pendente', 'Pago', 'Atrasado', 'Cancelado') DEFAULT 'Pendente',
    data_pagamento DATE,
    link_boleto VARCHAR(255),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
