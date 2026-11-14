# Gestão de Compras Públicas – Front-end

Interface web do sistema de gestão e análise de compras públicas: consulta com filtros, cadastro, edição e exclusão de contratações, importação do ZIP original do Portal da Transparência e dashboard com gráficos.

Projeto da avaliação P3 da disciplina Programação Avançada Orientada a Objetos – FATEC Zona Leste.

A API fica no repositório irmão `gestao-compras-publicas-backend`, que também traz a fonte dos dados, as regras de importação e os endpoints.

## Tecnologias

- React 19 + TypeScript
- Vite
- MUI (Material UI)
- Recharts (gráficos)
- react-router-dom
- axios

## Configuração

```
npm install
cp .env.example .env
```

O `.env` tem uma variável só:

| Variável | Conteúdo |
|---|---|
| `API_URL` | endereço do back-end usado pelo proxy do Vite em desenvolvimento (padrão `http://localhost:8080`) |

## Como rodar

### Desenvolvimento

Com o back-end rodando:

```
npm run dev
```

e acesse `http://localhost:5173`. O Vite repassa as chamadas `/api` para o `API_URL`, então não é preciso configurar CORS.

### Build único (front servido pelo back)

```
npm run build:backend
```

Gera o build dentro de `../gestao-compras-publicas-backend/src/main/resources/static`. Depois basta subir o back-end e acessar a porta dele. Rode de novo sempre que o front mudar.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run build` | compila e gera o build em `dist/` |
| `npm run lint` | verifica o código com o oxlint |

## Telas

| Rota | Tela |
|---|---|
| `/contratacoes` | Lista paginada com os 5 filtros combináveis (órgão, período, modalidade, faixa de valor e fornecedor), ordenação por coluna, editar e excluir com confirmação |
| `/contratacoes/nova` | Cadastro, com órgão e fornecedor escolhidos da lista ou criados junto |
| `/contratacoes/{id}` | Edição |
| `/importacao` | Envio do ZIP, com lidas, importadas, rejeitadas, tempo, rejeições por motivo e tabela das linhas rejeitadas |
| `/dashboard` | Valor por órgão (top 10), quantidade por modalidade e evolução mensal (últimos 12 meses) |

Mensagens de sucesso e erro aparecem em todas as operações. Os erros de validação da API aparecem embaixo do campo correspondente. Datas em dd/mm/aaaa e valores em R$.

## Organização do código

```
src/
├── api/          cliente axios, tipos e funções de chamada da API
├── componentes/  layout, avisos, título de página, filtros e diálogo de confirmação
├── paginas/      uma página por tela
├── util/         formatação de moeda, número e data
├── tema.ts       tema do MUI em português
├── App.tsx       rotas
└── main.tsx      ponto de entrada
```
