🌱 Frontend – Analisador de Sustentabilidade Digital

Aplicação desenvolvida em React + TypeScript + Vite, focada em analisar o impacto ambiental de prompts de IA (consumo de água e energia) e exibir os resultados de maneira visual, clara e educativa.

🚀 Tecnologias Utilizadas

React (com Hooks)

TypeScript

Vite (ambiente de build rápido)

styled-components (estilização e responsividade)

Fetch API (requisições ao backend)

ESLint + TypeScript Rules (qualidade do código)

📁 Estrutura Geral do Projeto
src/
 ├── App.tsx          # Componente principal da aplicação
 ├── api/             # Módulos responsáveis por chamadas HTTP
 ├── styles/          # Componentes estilizados (styled-components)
 └── main.tsx         # Ponto de entrada da aplicação

🧠 O que este front-end faz?

Este front-end permite que o usuário:

Cole um prompt de IA em uma caixa de texto.

Clique em Analisar impacto.

A aplicação envia esse prompt para o backend com:

POST /analise { texto: "conteúdo do prompt" }


O backend retorna informações como:

Prompt original

Prompt otimizado

Partes desnecessárias

Consumo de água e energia antes e depois

A interface exibe:

✔ Prompt Otimizado

Incluindo:

Trechos removidos riscados e em vermelho

Redesenho do texto otimizado

✔ Cartões de Consumo

Exibe quatro cards:

Card	Informação
💧 Água Gasta	Antes
⚡ Energia Gasta	Antes
✅ Após Otimização	Água + Energia
⬇️ Economia Total	Economia final

Todos estilizados com ícones e cores.

📡 Comunicação com a API

A chamada principal é:

async function postAnaliseMensagemFixa(prompt: string)


Ela:

Envia o prompt ao backend

Tem lógica de retry com backoff exponencial

Converte o JSON recebido no formato esperado pelo React

Retorna um objeto do tipo:

interface AnaliseOtimizacao {
  prompt_original: string;
  prompt_otimizado: string;
  partes_desnecessarias: string[];
  consumo: {
    antes: { agua_ml: number; energia_wh: number };
    depois: { agua_ml: number; energia_wh: number };
    economia: { agua_ml: number; energia_wh: number };
  };
}

🎨 Interface e UX

Toda a UI é construída com styled-components, incluindo:

Layout principal centralizado

Cartões responsivos (grid adaptável)

Caixa especial para o prompt otimizado

Destaque visual para partes desnecessárias (<ParteRemovida>)

Botão com animações e estados (hover, disabled)

Mensagens de erro com caixa vermelha

Design moderno e leve baseado em tons de azul e branco

▶ Como executar o projeto

Requisitos:

Node.js 18+

NPM ou Yarn

1️⃣ Instalar dependências
npm install

2️⃣ Rodar o servidor de desenvolvimento
npm run dev


A aplicação ficará disponível em:

http://localhost:5173

🧩 Variáveis importantes no código
URL da API:
const API_URL = "http://127.0.0.1:8000/analise";


Caso o backend esteja em outra máquina/porta, basta alterar essa constante.

🛠 ESLint e Boas Práticas

O projeto utiliza as regras padrões do Vite + React + TS.
Para projetos maiores, é recomendado habilitar:

Regras type-checked do TypeScript

Plugins react-x e react-dom

(Como descrito na documentação gerada pelo Vite.)

📦 Build de Produção
npm run build