import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { mensagemDeErro } from '../api/cliente'
import {
  excluirContratacao,
  filtroVazio,
  listarContratacoes,
  listarModalidades,
  listarOrgaos,
} from '../api/contratacoes'
import type { FiltroContratacao, Ordenacao } from '../api/contratacoes'
import type { Contratacao, Modalidade, Orgao, Pagina } from '../api/tipos'
import { DialogoConfirmacao } from '../componentes/DialogoConfirmacao'
import { FiltrosContratacao } from '../componentes/FiltrosContratacao'
import { TituloPagina } from '../componentes/TituloPagina'
import { useAvisos } from '../componentes/avisosContexto'
import { formatarData, formatarMoeda, formatarNumero } from '../util/formatos'

const colunas = [
  { campo: 'numeroContrato', titulo: 'Contrato', alinhamento: 'left' },
  { campo: 'orgao.nome', titulo: 'Órgão', alinhamento: 'left' },
  { campo: 'fornecedor.nome', titulo: 'Fornecedor', alinhamento: 'left' },
  { campo: 'modalidade', titulo: 'Modalidade', alinhamento: 'left' },
  { campo: 'dataAssinatura', titulo: 'Assinatura', alinhamento: 'left' },
  { campo: 'valorFinal', titulo: 'Valor final', alinhamento: 'right' },
] as const

export function ContratacoesPagina() {
  const navegar = useNavigate()
  const { avisarSucesso, avisarErro } = useAvisos()
  const [orgaos, setOrgaos] = useState<Orgao[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [filtro, setFiltro] = useState<FiltroContratacao>(filtroVazio)
  const [pagina, setPagina] = useState(0)
  const [tamanho, setTamanho] = useState(20)
  const [ordenacao, setOrdenacao] = useState<Ordenacao>({ campo: 'dataAssinatura', direcao: 'desc' })
  const [resultado, setResultado] = useState<Pagina<Contratacao> | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [recarga, setRecarga] = useState(0)
  const [paraExcluir, setParaExcluir] = useState<Contratacao | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    Promise.all([listarOrgaos(), listarModalidades()])
      .then(([listaOrgaos, listaModalidades]) => {
        setOrgaos(listaOrgaos)
        setModalidades(listaModalidades)
      })
      .catch((erro) => avisarErro(mensagemDeErro(erro)))
  }, [avisarErro])

  useEffect(() => {
    let ativo = true
    listarContratacoes(filtro, pagina, tamanho, ordenacao)
      .then((dados) => {
        if (!ativo) {
          return
        }
        if (dados.conteudo.length === 0 && pagina > 0) {
          setPagina(pagina - 1)
          return
        }
        setResultado(dados)
      })
      .catch((erro) => ativo && avisarErro(mensagemDeErro(erro)))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [filtro, pagina, tamanho, ordenacao, recarga, avisarErro])

  function filtrar(novoFiltro: FiltroContratacao) {
    setCarregando(true)
    setFiltro(novoFiltro)
    setPagina(0)
    setRecarga((atual) => atual + 1)
  }

  function ordenar(campo: string) {
    setCarregando(true)
    setOrdenacao((atual) => ({
      campo,
      direcao: atual.campo === campo && atual.direcao === 'asc' ? 'desc' : 'asc',
    }))
    setPagina(0)
  }

  function mudarPagina(novaPagina: number) {
    setCarregando(true)
    setPagina(novaPagina)
  }

  function mudarTamanho(novoTamanho: number) {
    setCarregando(true)
    setTamanho(novoTamanho)
    setPagina(0)
  }

  async function confirmarExclusao() {
    if (!paraExcluir) {
      return
    }
    setExcluindo(true)
    try {
      await excluirContratacao(paraExcluir.id)
      avisarSucesso(`Contratação ${paraExcluir.numeroContrato} excluída.`)
      setParaExcluir(null)
      setCarregando(true)
      setRecarga((atual) => atual + 1)
    } catch (erro) {
      avisarErro(mensagemDeErro(erro))
    } finally {
      setExcluindo(false)
    }
  }

  const total = resultado?.totalElementos ?? 0

  return (
    <>
      <TituloPagina
        titulo="Contratações"
        subtitulo="Consulta, cadastro, edição e exclusão de contratações"
        acoes={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navegar('/contratacoes/nova')}>
            Nova contratação
          </Button>
        }
      />

      <FiltrosContratacao orgaos={orgaos} modalidades={modalidades} onFiltrar={filtrar} />

      <Paper>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            {total === 1 ? '1 contratação encontrada' : `${formatarNumero(total)} contratações encontradas`}
          </Typography>
        </Box>
        <Box sx={{ height: 4 }}>{carregando && <LinearProgress />}</Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.campo} align={coluna.alinhamento} sx={{ fontWeight: 600 }}>
                    <TableSortLabel
                      active={ordenacao.campo === coluna.campo}
                      direction={ordenacao.campo === coluna.campo ? ordenacao.direcao : 'asc'}
                      onClick={() => ordenar(coluna.campo)}
                    >
                      {coluna.titulo}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultado?.conteudo.map((contratacao) => (
                <TableRow key={contratacao.id} hover>
                  <TableCell>
                    <Typography variant="body2">{contratacao.numeroContrato}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      UG {contratacao.codigoUg}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{contratacao.orgao.nome}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contratacao.orgao.codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{contratacao.fornecedor.nome}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contratacao.fornecedor.documento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={contratacao.modalidade.descricao}
                      size="small"
                      variant={contratacao.modalidade.codigo ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatarData(contratacao.dataAssinatura)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {formatarMoeda(contratacao.valorFinal)}
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => navegar(`/contratacoes/${contratacao.id}`)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => setParaExcluir(contratacao)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!carregando && resultado?.conteudo.length === 0 && (
                <TableRow>
                  <TableCell colSpan={colunas.length + 1} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Nenhuma contratação encontrada com esses filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={pagina}
          rowsPerPage={tamanho}
          rowsPerPageOptions={[10, 20, 50]}
          onPageChange={(_, novaPagina) => mudarPagina(novaPagina)}
          onRowsPerPageChange={(evento) => mudarTamanho(Number(evento.target.value))}
        />
      </Paper>

      <DialogoConfirmacao
        aberto={paraExcluir !== null}
        titulo="Excluir contratação"
        mensagem={`Deseja excluir a contratação ${paraExcluir?.numeroContrato ?? ''} (UG ${paraExcluir?.codigoUg ?? ''})? Essa ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        processando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setParaExcluir(null)}
      />
    </>
  )
}
