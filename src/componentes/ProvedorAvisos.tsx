import { useCallback, useMemo, useState, type ReactNode } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { AvisosContexto } from './avisosContexto'

type AvisoAberto = {
  mensagem: string
  tipo: 'success' | 'error'
}

export function ProvedorAvisos({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<AvisoAberto | null>(null)

  const avisarSucesso = useCallback((mensagem: string) => setAviso({ mensagem, tipo: 'success' }), [])
  const avisarErro = useCallback((mensagem: string) => setAviso({ mensagem, tipo: 'error' }), [])
  const avisos = useMemo(() => ({ avisarSucesso, avisarErro }), [avisarSucesso, avisarErro])

  const fechar = () => setAviso(null)

  return (
    <AvisosContexto.Provider value={avisos}>
      {children}
      <Snackbar
        open={aviso !== null}
        autoHideDuration={aviso?.tipo === 'error' ? 8000 : 4000}
        onClose={fechar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={fechar} severity={aviso?.tipo ?? 'success'} variant="filled" sx={{ width: '100%' }}>
          {aviso?.mensagem}
        </Alert>
      </Snackbar>
    </AvisosContexto.Provider>
  )
}
