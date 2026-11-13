import { api } from './cliente'
import type { Contratacao, Fornecedor, Modalidade, Orgao, Pagina } from './tipos'

export type ContratacaoRequest = {
  numeroContrato: string | null
  codigoUg: string | null
  nomeUg: string | null
  objeto: string | null
  modalidade: string | null
  dataAssinatura: string | null
  dataPublicacaoDou: string | null
  dataInicioVigencia: string | null
  dataFimVigencia: string | null
  valorInicial: number | null
  valorFinal: number | null
  numeroLicitacao: string | null
  orgaoId: number | null
  novoOrgao: {
    codigo: string | null
    nome: string | null
    codigoOrgaoSuperior: string | null
    nomeOrgaoSuperior: string | null
  } | null
  fornecedorId: number | null
  novoFornecedor: {
    documento: string | null
    nome: string | null
  } | null
}

export type FiltroContratacao = {
  orgaoId: number | null
  dataInicio: string
  dataFim: string
  modalidade: string
  valorMinimo: string
  valorMaximo: string
  fornecedor: string
}

export const filtroVazio: FiltroContratacao = {
  orgaoId: null,
  dataInicio: '',
  dataFim: '',
  modalidade: '',
  valorMinimo: '',
  valorMaximo: '',
  fornecedor: '',
}

export type Ordenacao = {
  campo: string
  direcao: 'asc' | 'desc'
}

export async function listarContratacoes(
  filtro: FiltroContratacao,
  pagina: number,
  tamanho: number,
  ordenacao: Ordenacao,
): Promise<Pagina<Contratacao>> {
  const parametros = new URLSearchParams()
  Object.entries(filtro).forEach(([chave, valor]) => {
    if (valor !== null && String(valor).trim() !== '') {
      parametros.append(chave, String(valor).trim())
    }
  })
  parametros.append('page', String(pagina))
  parametros.append('size', String(tamanho))
  parametros.append('sort', `${ordenacao.campo},${ordenacao.direcao}`)
  const resposta = await api.get<Pagina<Contratacao>>('/contratacoes', { params: parametros })
  return resposta.data
}

export async function buscarContratacao(id: string): Promise<Contratacao> {
  const resposta = await api.get<Contratacao>(`/contratacoes/${id}`)
  return resposta.data
}

export async function salvarContratacao(id: string | undefined, dados: ContratacaoRequest): Promise<Contratacao> {
  const resposta = id
    ? await api.put<Contratacao>(`/contratacoes/${id}`, dados)
    : await api.post<Contratacao>('/contratacoes', dados)
  return resposta.data
}

export async function buscarFornecedores(busca: string): Promise<Fornecedor[]> {
  const resposta = await api.get<Fornecedor[]>('/fornecedores', { params: { busca } })
  return resposta.data
}

export async function excluirContratacao(id: number): Promise<void> {
  await api.delete(`/contratacoes/${id}`)
}

export async function listarOrgaos(): Promise<Orgao[]> {
  const resposta = await api.get<Orgao[]>('/orgaos')
  return resposta.data
}

export async function listarModalidades(): Promise<Modalidade[]> {
  const resposta = await api.get<Modalidade[]>('/modalidades')
  return resposta.data
}
