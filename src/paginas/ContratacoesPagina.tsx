import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import { api, mensagemDeErro } from '../api/cliente'
import type { Modalidade } from '../api/tipos'
import { TituloPagina } from '../componentes/TituloPagina'
import { useAvisos } from '../componentes/avisosContexto'

export function ContratacoesPagina() {
  const { avisarSucesso, avisarErro } = useAvisos()
  const [modalidades, setModalidades] = useState<Modalidade[] | null>(null)

  useEffect(() => {
    api
      .get<Modalidade[]>('/modalidades')
      .then((resposta) => {
        setModalidades(resposta.data)
        avisarSucesso('Conectado ao back-end.')
      })
      .catch((erro) => avisarErro(mensagemDeErro(erro)))
  }, [avisarSucesso, avisarErro])

  return (
    <>
      <TituloPagina titulo="Contratações" subtitulo="Consulta, cadastro, edição e exclusão de contratações" />
      {modalidades && <Alert severity="info">API conectada: {modalidades.length} modalidades disponíveis.</Alert>}
    </>
  )
}
