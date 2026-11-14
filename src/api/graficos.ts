import { api } from './cliente'
import type { QuantidadePorModalidade, ValorPorMes, ValorPorOrgao } from './tipos'

export async function buscarValorPorOrgao(): Promise<ValorPorOrgao[]> {
  const resposta = await api.get<ValorPorOrgao[]>('/graficos/valor-por-orgao')
  return resposta.data
}

export async function buscarQuantidadePorModalidade(): Promise<QuantidadePorModalidade[]> {
  const resposta = await api.get<QuantidadePorModalidade[]>('/graficos/quantidade-por-modalidade')
  return resposta.data
}

export async function buscarEvolucaoMensal(): Promise<ValorPorMes[]> {
  const resposta = await api.get<ValorPorMes[]>('/graficos/evolucao-mensal')
  return resposta.data
}
