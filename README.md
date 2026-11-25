# Gestão de Compras Públicas – Front-end

Interface web em React do sistema de gestão e análise de compras públicas. Por ela é possível importar o arquivo original de contratos do Portal da Transparência, cadastrar, consultar, alterar, excluir e filtrar contratações e ver os dados em gráficos.

A API (Java + Spring Boot) está em: https://github.com/AshileySabah/gestao-compras-publicas-backend. A fonte dos dados, as regras de tratamento e a configuração do banco estão no README de lá.

## Tecnologias

React 19 + TypeScript, Vite, MUI (Material UI), Recharts, react-router-dom e axios.

## Como executar

Pré-requisitos: Node.js e o back-end configurado.

```
npm install
cp .env.example .env
```

No `.env`, `API_URL` é o endereço do back-end (padrão `http://localhost:8080`).

**Desenvolvimento**

Com o back-end rodando:

```
npm run dev
```

Acesse `http://localhost:5173`. As chamadas para `/api` são repassadas ao back-end.

**Aplicação completa (front servido pelo back-end)**

Com os dois repositórios em pastas lado a lado:

```
npm run build:backend
```

Isso gera o front dentro do back-end. Depois, suba o back-end e acesse `http://localhost:8080`.

## Como usar

| Tela                      | O que faz                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Importação                | Envio do ZIP original do portal (clicando ou arrastando) e resultado com lidas, importadas, rejeitadas e o motivo de cada rejeição |
| Contratações              | Lista com os cinco filtros combináveis (órgão, período, modalidade, faixa de valor e fornecedor), edição e exclusão                |
| Nova contratação / Editar | Cadastro e edição, com as mensagens de erro de cada campo                                                                          |
| Dashboard                 | Gráficos de valor por órgão, quantidade por modalidade e evolução mensal                                                           |

Todas as operações mostram mensagem de sucesso ou de erro.
