# Gestão de Compras Públicas – Front-end

Interface web em React do sistema de gestão e análise de compras públicas. Por ela é possível importar o arquivo original de contratos do Portal da Transparência, cadastrar, consultar, alterar, excluir e filtrar contratações e ver os dados em gráficos.

A API (Java + Spring Boot) está em: https://github.com/AshileySabah/gestao-compras-publicas-backend. A fonte dos dados, as regras de tratamento e a configuração do banco estão no README de lá.

## Tecnologias

React 19 + TypeScript, Vite, MUI (Material UI), Recharts, react-router-dom e axios.

## Como executar

Pré-requisitos: JDK 17 ou mais recente para o back, Node.js 20.19.0 ou maior para o front e o `.env` de cada repositório criado a partir do `.env.example`. As variáveis do banco estão explicadas no README do back-end; no front, `API_URL` é o endereço do back.

Os dois repositórios têm o mesmo script `dev.sh`, executado na raiz do repositório:

| Caso                                                    | Comando         | Endereço                    |
| ------------------------------------------------------- | --------------- | --------------------------- |
| Back com os dados do banco                              | `./dev.sh -BD`  | `http://localhost:8080/api` |
| Back sem dados no banco (apaga e recria as tabelas)     | `./dev.sh -BZ`  | `http://localhost:8080/api` |
| Front em desenvolvimento (com o back já rodando)        | `./dev.sh -F`   | `http://localhost:5173`     |
| Front e back juntos, com os dados do banco              | `./dev.sh -FBD` | `http://localhost:8080`     |
| Front e back juntos, sem dados no banco                 | `./dev.sh -FBZ` | `http://localhost:8080`     |

Os comandos são para o Git Bash, Linux ou macOS. No PowerShell ou no cmd, use `.\dev.cmd` com a mesma flag (ex.: `.\dev.cmd -BZ`). Os comandos que sobem o front abrem o navegador sozinhos.

Para subir só o repositório em que você está (`-BD` e `-BZ` no back, `-F` no front), não é preciso ter o outro clonado. Nos demais casos, inclusive `-FBD` e `-FBZ`, os dois repositórios precisam estar clonados na mesma pasta, e o comando pode ser executado em qualquer um deles.

## Como usar

| Tela                      | O que faz                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Importação                | Envio do ZIP original do portal (clicando ou arrastando) e resultado com lidas, importadas, rejeitadas e o motivo de cada rejeição |
| Contratações              | Lista com os cinco filtros combináveis (órgão, período, modalidade, faixa de valor e fornecedor), edição e exclusão                |
| Nova contratação / Editar | Cadastro e edição, com as mensagens de erro de cada campo                                                                          |
| Dashboard                 | Gráficos de valor por órgão, quantidade por modalidade e evolução mensal                                                           |

Todas as operações mostram mensagem de sucesso ou de erro.
