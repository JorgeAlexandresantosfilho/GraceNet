# Projeto ISP – Dashboard Administrativo

Sistema em desenvolvimento para gerenciamento de um provedor de internet (ISP). O objetivo é oferecer uma plataforma intuitiva e moderna para administradores e equipes de suporte, centralizando as operações do dia a dia.

## 🎯 Objetivo
Desenvolver um dashboard administrativo que permita gerenciar clientes, planos e chamados de suporte de forma eficiente, além de fornecer insights e métricas para acompanhamento do crescimento do negócio.

## 🛠️ Tecnologias Utilizadas
- **React 19** com Hooks
- **TypeScript**
- **TailwindCSS 3** para estilização
- **Vite** como ambiente de desenvolvimento e build
- **Lucide React** para iconografia

## ✨ Funcionalidades Implementadas

O projeto está organizado em quatro seções principais, cada uma com suas próprias funcionalidades:

### 1. Dashboard
Visão geral e consolidada das métricas mais importantes do negócio:
- **Cards de Estatísticas:** Acompanhamento de novos clientes, total de clientes ativos, plano mais vendido e chamados de suporte abertos.
- **Clientes Recentes:** Lista rápida dos últimos clientes cadastrados com seus respectivos status (Ativo, Pendente, Inativo).
- **Gráfico de Crescimento:** Visualização simplificada do crescimento no número de clientes ao longo dos meses.

### 2. Gestão de Clientes
Tela dedicada ao gerenciamento completo da base de clientes:
- **Tabela de Clientes:** Exibição detalhada com informações como nome, contato, plano, status e data de vencimento.
- **Busca Dinâmica:** Campo de busca para encontrar clientes por nome, e-mail ou telefone.
- **Filtro por Status:** Permite filtrar a visualização de clientes por "Ativo", "Pendente" ou "Inativo".

### 3. Gestão de Planos
Área para visualização e gerenciamento dos planos de internet oferecidos:
- **Visualização em Cards:** Apresentação individual de cada plano com detalhes como velocidade, preço e recursos inclusos.
- **Tabela Comparativa:** Resumo de todos os planos em formato de tabela, incluindo o cálculo da receita mensal estimada por plano.

### 4. Central de Suporte
Interface para acompanhar e gerenciar os chamados de suporte técnico:
- **Cards de Resumo:** Métricas rápidas sobre o status dos tickets (Abertos, Em Andamento, Resolvidos).
- **Listagem de Chamados:** Exibição detalhada de cada ticket, incluindo cliente, descrição do problema, status e prioridade.
- **Filtros Avançados:** Opções para filtrar os chamados por status e por nível de prioridade (Alta, Média, Baixa).

## 🚀 Como Executar o Projeto
Para visualizar localmente:

```bash
# Clone o repositório
git clone [https://github.com/gusmariz/Projeto-ISP.git](https://github.com/gusmariz/Projeto-ISP.git)

# Entre na pasta do projeto
cd Projeto-ISP

# Instale as dependências
npm install

# Rode o projeto em ambiente de desenvolvimento
npm run dev
```

## 📌 Público-Alvo
- Administradores da empresa
- Gerentes de Operações
- Suporte Técnico
- Analistas de Dados