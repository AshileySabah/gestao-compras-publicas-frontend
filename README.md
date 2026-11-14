# Gestão de Compras Públicas – Front-end

Sistema web para gestão e análise de compras públicas. Ele importa o arquivo original de contratos do governo federal publicado no Portal da Transparência, trata as inconsistências desse arquivo, grava os registros válidos em um banco PostgreSQL hospedado no Neon e permite cadastrar, consultar, alterar, excluir, filtrar e visualizar os dados em gráficos.

Este repositório é a interface web, feita em React. O projeto é a avaliação P3 da disciplina Programação Avançada Orientada a Objetos da FATEC Zona Leste.

## Repositório do back-end

A API (Java + Spring Boot) está em: https://github.com/AshileySabah/gestao-compras-publicas-backend

A fonte dos dados, a modelagem, as regras de tratamento da importação, os endpoints e a configuração do banco estão documentados no README do back-end.

## Tecnologias

| Parte | Escolha |
|---|---|
| Biblioteca de interface | React 19 + TypeScript |
| Build e servidor de desenvolvimento | Vite |
| Componentes visuais | MUI (Material UI), com tema em português |
| Gráficos | Recharts |
| Rotas | react-router-dom |
| Chamadas à API | axios |
| Verificação do código | oxlint |

## Pré-requisitos e configuração

- Node.js.
- O back-end configurado e rodando (ver o README do back-end).

Instale as dependências e crie o `.env` a partir do exemplo:

```
npm install
cp .env.example .env
```

| Variável | Conteúdo |
|---|---|
| `API_URL` | endereço do back-end usado pelo proxy do Vite em desenvolvimento (padrão `http://localhost:8080`; ajuste se o back usar outra porta em `SERVER_PORT`) |

O `.env` está no `.gitignore`.

## Como executar

### Desenvolvimento

Com o back-end rodando:

```
npm run dev
```

e acesse `http://localhost:5173`. O Vite repassa as chamadas `/api` para o `API_URL`, então não é preciso configurar CORS. As alterações no código aparecem na hora no navegador.

### Build único (front servido pelo back-end)

Os dois repositórios precisam estar em pastas lado a lado:

```
pasta-qualquer/
├── gestao-compras-publicas-backend/
└── gestao-compras-publicas-frontend/
```

Aqui no front:

```
npm run build:backend
```

Isso gera o build dentro de `../gestao-compras-publicas-backend/src/main/resources/static`. Depois, basta subir o back-end e acessar a porta dele (por exemplo `http://localhost:8080`): a aplicação inteira roda com um comando só. Rode o `build:backend` de novo sempre que o front mudar.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run build` | compila e gera o build em `dist/` |
| `npm run lint` | verifica o código com o oxlint |
| `npm run preview` | serve localmente o build de `dist/` |

## Telas

| Rota | Tela | O que faz |
|---|---|---|
| `/contratacoes` | Contratações | Lista paginada com contrato, órgão, fornecedor, modalidade, data de assinatura e valor final. Painel com os 5 filtros combináveis (órgão, período, modalidade, faixa de valor e fornecedor), botões Filtrar e Limpar, ordenação por coluna, editar e excluir com confirmação |
| `/contratacoes/nova` | Nova contratação | Cadastro manual. Órgão e fornecedor podem ser escolhidos entre os existentes (com busca) ou criados junto |
| `/contratacoes/{id}` | Editar contratação | Edição, mostrando a origem atual da modalidade |
| `/importacao` | Importação | Envio do ZIP original do portal (clicando ou arrastando), com indicador de carregamento, cartões de lidas, importadas, rejeitadas e tempo, rejeições por motivo, modalidades por origem e tabela das linhas rejeitadas com linha, contrato, motivo e detalhe |
| `/dashboard` | Dashboard | Três gráficos com dados do banco: valor total por órgão (top 10), quantidade por modalidade e evolução mensal dos últimos 12 meses, com título, legenda, eixos em R$ e tooltip |

Todas as operações mostram mensagem de sucesso ou de erro. Os erros de validação devolvidos pela API aparecem embaixo do campo correspondente. Datas aparecem em dd/mm/aaaa e valores no formato brasileiro (R$).

## Organização do código

```
src/
├── api/          cliente axios, tipos dos dados e funções de chamada da API
├── componentes/  layout com o menu, avisos de sucesso e erro, título de página, painel de filtros e diálogo de confirmação
├── paginas/      uma página por tela
├── util/         formatação de moeda, número e data
├── tema.ts       tema do MUI em português
├── App.tsx       rotas
└── main.tsx      ponto de entrada
```
