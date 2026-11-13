export type Modalidade = {
  valor: string
  codigo: string | null
  descricao: string
}

export type Orgao = {
  id: number
  codigo: string
  nome: string
  codigoOrgaoSuperior: string | null
  nomeOrgaoSuperior: string | null
}

export type TipoFornecedor = 'PF' | 'PJ' | 'ESTRANGEIRO' | 'SIGILOSO'

export type Fornecedor = {
  id: number
  documento: string
  nome: string
  tipo: TipoFornecedor
}

export type Contratacao = {
  id: number
  numeroContrato: string
  codigoUg: string
  nomeUg: string | null
  objeto: string | null
  modalidade: Modalidade
  origemModalidade: string
  dataAssinatura: string
  dataPublicacaoDou: string | null
  dataInicioVigencia: string | null
  dataFimVigencia: string | null
  valorInicial: number | null
  valorFinal: number
  numeroLicitacao: string | null
  origemRegistro: 'IMPORTACAO' | 'CADASTRO_MANUAL'
  orgao: Orgao
  fornecedor: Fornecedor
}

export type Pagina<T> = {
  conteudo: T[]
  pagina: number
  tamanho: number
  totalElementos: number
  totalPaginas: number
}

export type Contagem = {
  descricao: string
  quantidade: number
}

export type LinhaRejeitada = {
  linha: number
  numeroContrato: string | null
  motivo: string
  detalhe: string
}

export type ResultadoImportacao = {
  linhasLidas: number
  importadas: number
  rejeitadas: number
  tempoProcessamentoMs: number
  arquivoItensEnviado: boolean
  rejeicoesPorMotivo: Contagem[]
  modalidadesPorOrigem: Contagem[]
  linhasRejeitadas: LinhaRejeitada[]
}

export type ErroApi = {
  status: number
  mensagem: string
  campos: { campo: string; mensagem: string }[]
}
