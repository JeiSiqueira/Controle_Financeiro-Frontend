# Controle Financeiro — Frontend

Frontend da aplicação **Controle Financeiro**, desenvolvido para gerenciamento de receitas, despesas e categorias.

O projeto foi desenvolvido como parte do meu portfólio para colocar em prática conhecimentos de desenvolvimento frontend, integração com APIs REST, autenticação e construção de interfaces com React e TypeScript.

## Sobre o projeto

A aplicação permite que usuários autenticados gerenciem suas movimentações financeiras através de uma interface web integrada à API do projeto.

O frontend se comunica com uma API desenvolvida em **C# e ASP.NET Core**, utilizando autenticação baseada em **JWT**.

### Principais funcionalidades

* Cadastro e login de usuários
* Autenticação utilizando JWT
* Proteção de rotas
* Dashboard financeiro
* Visualização de receitas
* Visualização de despesas
* Visualização do saldo
* Cadastro de novas transações
* Edição e exclusão de transações
* Listagem de categorias
* Criação de categorias durante o cadastro de uma transação
* Integração com API REST
* Tratamento de erros nas requisições

## Tecnologias utilizadas

* React
* TypeScript
* Vite
* Axios
* React Router
* CSS
* HTML

## Estrutura do projeto

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   └── Navbar.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Me.tsx
│   │   └── NovaTransacao.tsx
│   │
│   ├── services/
│   │   └── api.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
│
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Integração com o Backend

O frontend utiliza **Axios** para realizar as requisições à API.

As principais operações incluem:

```text
POST   /api/Auth/register
POST   /api/Auth/login
GET    /api/Auth/me

GET    /api/Transacoes
POST   /api/Transacoes
PUT    /api/Transacoes
DELETE /api/Transacoes/{id}

GET    /api/Categorias
POST   /api/Categorias
```

Após o login, o token JWT é armazenado no navegador e utilizado nas requisições que exigem autenticação.

## Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm

### Instalação

Clone o repositório:

```bash
git clone https://github.com/JeiSiqueira/Controle_Financeiro-Frontend.git
```

Entre na pasta:

```bash
cd Controle_Financeiro-Frontend
```

Instale as dependências:

```bash
npm install
```

### Executando o projeto

Execute:

```bash
npm run dev
```

A aplicação será disponibilizada pelo Vite, normalmente em:

```text
http://localhost:5173
```

## Backend

Este frontend depende da API do projeto **Controle Financeiro**.

O backend foi desenvolvido utilizando:

* C#
* .NET 8
* ASP.NET Core Web API
* Entity Framework Core
* MySQL
* JWT
* BCrypt
* Swagger

Repositório do backend:

https://github.com/JeiSiqueira/Controle_Financeiro

## Objetivo do projeto

Este projeto faz parte do meu portfólio de desenvolvimento e tem como objetivo demonstrar, na prática, conhecimentos em:

* Desenvolvimento frontend
* React e TypeScript
* Consumo de APIs REST
* Autenticação JWT
* Gerenciamento de estado
* Rotas protegidas
* Integração frontend e backend
* Organização de projetos
* Git e GitHub

## Próximos passos

Algumas melhorias planejadas para o projeto:

* Melhorar a experiência visual da aplicação
* Tornar a interface totalmente responsiva
* Adicionar filtros de transações
* Adicionar gráficos financeiros
* Melhorar feedbacks de sucesso e erro
* Adicionar tela de cadastro de usuário
* Melhorar validações dos formulários

---

Desenvolvido por **Jeimili Siqueira**.

