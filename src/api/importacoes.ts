import { api } from './cliente'
import type { ResultadoImportacao } from './tipos'

export async function importarZip(arquivo: File): Promise<ResultadoImportacao> {
  const dados = new FormData()
  dados.append('arquivo', arquivo)
  const resposta = await api.post<ResultadoImportacao>('/importacoes', dados)
  return resposta.data
}
