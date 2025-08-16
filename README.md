🌐 GraceNet API

API RESTful desenvolvida em Node.js com MySQL para gerenciamento de clientes, planos e redes de internet.
O projeto segue o padrão MVC (Model-View-Controller) e utiliza Stored Procedures no banco para manipulação de dados.

🚀 Tecnologias Utilizadas

Node.js (v18+)

Express.js

MySQL

dotenv para variáveis de ambiente

mysql2 para conexão com o banco

Procedures e Triggers no banco de dados

📂 Estrutura do Projeto
GraceNet/
├── config/
│   └── db.js              # Conexão com o banco de dados
├── controllers/
│   └── customerController.js
├── models/
│   └── customerModel.js
├── routes/
│   └── customerRoutes.js
├── index.js               # Arquivo principal do servidor
├── .env                   # Configurações de ambiente (DB_HOST, DB_USER, DB_PASS, DB_NAME)
└── README.md

🛠️ Configuração do Ambiente

Clone o repositório

git clone https://github.com/seu-usuario/GraceNet.git
cd GraceNet


Instale as dependências

npm install


Configure o banco MySQL

Crie um banco de dados (ex: gracenet)

Execute o script SQL com tabelas, procedures

Configure o arquivo .env:

DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=gracenet
PORT=3000


Inicie o servidor

npm start

📌 Endpoints Disponíveis
👥 Clientes

GET /api/customers → Lista todos os clientes

GET /api/customers/:id → Busca cliente por ID

POST /api/customers → Insere novo cliente

PUT /api/customers/:id → Atualiza cliente existente

DELETE /api/customers/:id → Remove cliente

📦 Exemplo de Requisição
Criar Cliente
POST /api/customers
{
  "cpf": "123.456.789-00",
  "nome_completo": "Jota da Silva",
  "data_nascimento": "1990-05-20",
  "rg": "12.345.678-9",
  "telefone": "(11) 98765-4321",
  "email": "joao.silva@example.com",
  "cep": "01001-000",
  "rua": "Avenida Paulista",
  "numero": "1234",
  "nome_rede": "JoaoNet",
  "senha_rede": "senhaSegura123",
  "plano": "Fibra 300MB",
  "vencimento": "20"
}

Resposta de Sucesso
{
  "Msg": "Cliente inserido com sucesso."
}

🗄️ Banco de Dados

Tabela clientes: Armazena dados pessoais e informações de rede

Procedures (sp_cliente_insert, sp_cliente_update, sp_cliente_delete): Realizam operações CRUD

Triggers (clientes_log): Registram alterações automaticamente no log

👨‍💻 Autor

Backend Desenvolvido por Jorge Alexandre
📧 Contato: [jorge.afilho01@gmail.com]
