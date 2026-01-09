# Conta-Certa Electron

Aplicativo desktop para **gerenciamento de cobranças**, desenvolvido com **Electron** e **TypeScript**, focado em organização, controle e acompanhamento de contas a pagar e a receber.

O projeto utiliza tecnologias modernas do ecossistema JavaScript para entregar uma aplicação multiplataforma (Windows, macOS e Linux) com execução local.

---

## Índice

- Sobre o Projeto
- Funcionalidades
- Tecnologias Utilizadas
- Estrutura do Projeto
- Instalação
- Licença

---

## Sobre o Projeto

O **Conta-Certa** é um sistema de gerenciamento de cobranças voltado para uso pessoal ou pequeno negócio, permitindo controlar valores, vencimentos e status de pagamentos de forma simples e centralizada.

Este repositório corresponde à versão **Electron**, permitindo que o sistema seja utilizado como um aplicativo desktop.

---

## Funcionalidades

> As funcionalidades abaixo refletem o objetivo do projeto e podem evoluir conforme o desenvolvimento.

- Visão geral das finanças
- Cadastro de clientes e faturamentos
- Backups automáticos
- Envio automatizado de cobranças pelo WhatsApp
- Edição e exclusão de registros
- Organização por status (pendente, pago)
- Visualização centralizada das cobranças
- Persistência de dados local e no Google Drive

---

## Tecnologias Utilizadas

- **Electron** – Criação de aplicações desktop multiplataforma
- **TypeScript** – Programação do processo principal
- **Node.js** – Runtime de JavaScript
- **ReactJs e Tailwindcss** – Interface do usuário

---

## Estrutura do Projeto

Conta-Certa/
├─ electron/
│  ├─ @types/
│  ├─ controllers/
│  ├─ errors/
│  ├─ services/
│  ├─ utils/
│  ├─ events.ts
│  ├─ main.ts
│  └─ preload.ts
│
├─ prisma/
│  ├─ migrations/
│  ├─ local.db
│  └─ schema.prisma
│
├─ public/
│  └─ locales/
│     ├─ en/
│     └─ pt-BR/
│
├─ src/
│  ├─ @types/
│  ├─ assets/
│  ├─ components/
│  ├─ contexts/
│  ├─ hooks/
│  ├─ pages/
│  ├─ utils/
│  ├─ i18n.ts
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
│
├─ node_modules/
│
├─ .eslintrc.cjs
├─ .gitignore
├─ .prettierrc
├─ index.html
├─ LICENSE
├─ package.json
├─ package-lock.json
├─ postcss.config.cjs
├─ tailwind.config.js
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ README.md

---

## Instalação

**O app ainda está em desenvolvimento, mas logo poderá ser baixado através da aba release do repositório.**

---

## Licença
Este projeto está licenciado sob a **Apache License 2.0**.

Consulte o arquivo **LICENSE** para mais informações.