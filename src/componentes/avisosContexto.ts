import { createContext, useContext } from 'react'

export type Avisos = {
  avisarSucesso: (mensagem: string) => void
  avisarErro: (mensagem: string) => void
}

export const AvisosContexto = createContext<Avisos | null>(null)

export function useAvisos(): Avisos {
  const avisos = useContext(AvisosContexto)
  if (!avisos) {
    throw new Error('useAvisos precisa estar dentro de ProvedorAvisos')
  }
  return avisos
}
