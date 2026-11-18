# 🦆 Quackly

> **Surpresas na fatura? Comigo, não!**

Aplicação web de gestão financeira pessoal e educação gamificada, desenvolvida como Projeto Interdisciplinar (PI) do curso de **Desenvolvimento de Software Multiplataforma (DSM)** da FATEC Indaiatuba. Este repositório contém a conversão do site original (HTML + CSS puro) para **React**.

---

## 🛠️ Stack

- **React 19 + Vite** (JavaScript)
- **React Router** (gerenciamento de rotas SPA)
- **CSS único** em `src/styles/global.css` (organizado por seções comentadas)
- **Bootstrap 5 + Bootstrap Icons** via CDN (usados apenas para grid, utilitários e ícones, como no site original)

---

## 🚀 Rodando Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na máquina.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```

---

## 📁 Estrutura do Projeto

```text
src/
├── assets/            # Imagens importadas diretamente nos componentes
├── components/        # Button, Card, CoinBackground, Footer, FormInput, Navbar, Sidebar
├── layouts/           # AuthLayout (login/cadastro) e DashboardLayout (área logada)
├── pages/             # Home, Login, Cadastro, Gestao, Aprendizado
├── services/          # Reservado para futuras chamadas de API / back-end
├── styles/
│   └── global.css     # Folha de estilos principal da aplicação
├── App.jsx            # Definição de rotas + ScrollManager
└── main.jsx           # Ponto de entrada
```

---

## 🧭 Rotas

| Rota | Página |
| :--- | :--- |
| `/` | Landing page |
| `/login` | Login |
| `/cadastro` | Criar conta |
| `/aprendizado` | Questionários |
| `/gestao` | Gerenciamento e Metas |
| `/historico` | Entradas e Saídas |

---

## 🧩 Componentes e Variants

Os componentes base reutilizáveis são controlados via `variants`:

- **`Button`**: `primary | pill | outline | nav | social | submit | action`
- **`Card`**: `feature | floating | pricing | stat | goal | quiz`