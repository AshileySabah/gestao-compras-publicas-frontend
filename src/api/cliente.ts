import axios from 'axios'
import type { ErroApi } from './tipos'

export const api = axios.create({ baseURL: '/api' })

export function erroDaApi(erro: unknown): ErroApi | null {
  if (axios.isAxiosError<ErroApi>(erro) && erro.response?.data?.mensagem) {
    return erro.response.data
  }
  return null
}

export function mensagemDeErro(erro: unknown): string {
  const erroApi = erroDaApi(erro)
  if (erroApi) {
    return erroApi.mensagem
  }
  if (axios.isAxiosError(erro) && !erro.response) {
    return 'Não foi possível falar com o servidor. Confira se o back-end está rodando.'
  }
  return 'Ocorreu um erro inesperado. Tente novamente.'
}
