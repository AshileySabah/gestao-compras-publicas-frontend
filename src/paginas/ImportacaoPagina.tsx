import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { mensagemDeErro } from '../api/cliente'
import { importarZip } from '../api/importacoes'
import type { Contagem, ResultadoImportacao } from '../api/tipos'
import { TituloPagina } from '../componentes/TituloPagina'
import { useAvisos } from '../componentes/avisosContexto'
import { formatarNumero } from '../util/formatos'

function formatarTamanho(bytes: number): string {
  return bytes < 1024 * 1024 ? `${formatarNumero(Math.ceil(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}

function formatarTempo(milissegundos: number): string {
  return milissegundos < 1000 ? `${milissegundos} ms` : `${(milissegundos / 1000).toFixed(1).replace('.', ',')} s`
}

function Cartao({ titulo, valor, cor }: { titulo: string; valor: string; cor?: string }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {titulo}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, color: cor }}>
        {valor}
      </Typography>
    </Paper>
  )
}

function TabelaContagem({ titulo, contagens, vazio }: { titulo: string; contagens: Contagem[]; vazio: string }) {
  return (
    <Paper>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, pt: 2, pb: 1 }}>
        {titulo}
      </Typography>
      <Table size="small">
        <TableBody>
          {contagens.map((contagem) => (
            <TableRow key={contagem.descricao}>
              <TableCell>{contagem.descricao}</TableCell>
              <TableCell align="right">{formatarNumero(contagem.quantidade)}</TableCell>
            </TableRow>
          ))}
          {contagens.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} sx={{ color: 'text.secondary' }}>
                {vazio}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  )
}

export function ImportacaoPagina() {
  const { avisarSucesso, avisarErro } = useAvisos()
  const campoArquivo = useRef<HTMLInputElement>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [arrastando, setArrastando] = useState(false)
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null)
  const [pagina, setPagina] = useState(0)
  const [tamanho, setTamanho] = useState(10)

  function escolher(selecionado: File | undefined) {
    if (selecionado) {
      setArquivo(selecionado)
      setResultado(null)
    }
  }

  function soltar(evento: DragEvent) {
    evento.preventDefault()
    setArrastando(false)
    escolher(evento.dataTransfer.files[0])
  }

  async function importar() {
    if (!arquivo) {
      return
    }
    setImportando(true)
    setResultado(null)
    try {
      const dados = await importarZip(arquivo)
      setResultado(dados)
      setPagina(0)
      avisarSucesso(`Importação concluída: ${formatarNumero(dados.importadas)} contratações gravadas.`)
    } catch (erro) {
      avisarErro(mensagemDeErro(erro))
    } finally {
      setImportando(false)
    }
  }

  const linhasDaPagina = resultado?.linhasRejeitadas.slice(pagina * tamanho, pagina * tamanho + tamanho) ?? []

  return (
    <>
      <TituloPagina titulo="Importação" subtitulo="Envie o ZIP do Portal da Transparência (Compras e, se houver, Itens de compra)" />

      <Paper
        variant="outlined"
        onClick={() => !importando && campoArquivo.current?.click()}
        onDragOver={(evento) => {
          evento.preventDefault()
          setArrastando(true)
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={soltar}
        sx={{
          p: 4,
          mb: 2,
          textAlign: 'center',
          cursor: importando ? 'default' : 'pointer',
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: arrastando ? 'primary.main' : 'divider',
          bgcolor: arrastando ? 'action.hover' : 'background.paper',
        }}
      >
        <input
          ref={campoArquivo}
          type="file"
          accept=".zip"
          hidden
          onChange={(evento) => {
            escolher(evento.target.files?.[0])
            evento.target.value = ''
          }}
        />
        <UploadFileIcon color="primary" sx={{ fontSize: 48 }} />
        {arquivo ? (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {arquivo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatarTamanho(arquivo.size)} — clique ou arraste outro arquivo para trocar
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">Clique para escolher ou arraste o arquivo .zip aqui</Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<CloudUploadIcon />} disabled={!arquivo || importando} onClick={importar}>
          {importando ? 'Importando...' : 'Importar'}
        </Button>
      </Box>

      {importando && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Lendo, validando e gravando as contratações...
          </Typography>
        </Box>
      )}

      {resultado && (
        <>
          <Box sx={{ display: 'grid', gap: 2, mb: 2, gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
            <Cartao titulo="Linhas lidas" valor={formatarNumero(resultado.linhasLidas)} />
            <Cartao titulo="Importadas" valor={formatarNumero(resultado.importadas)} cor="success.main" />
            <Cartao titulo="Rejeitadas" valor={formatarNumero(resultado.rejeitadas)} cor={resultado.rejeitadas > 0 ? 'error.main' : undefined} />
            <Cartao titulo="Tempo de processamento" valor={formatarTempo(resultado.tempoProcessamentoMs)} />
          </Box>

          <Alert severity={resultado.arquivoItensEnviado ? 'info' : 'warning'} sx={{ mb: 2 }}>
            {resultado.arquivoItensEnviado
              ? 'O arquivo de itens veio no ZIP e foi usado para descobrir a modalidade quando o arquivo de compras não a trazia.'
              : 'O ZIP não tinha o arquivo de itens. Contratações sem modalidade no arquivo de compras ficaram como "Não informada".'}
          </Alert>

          <Box sx={{ display: 'grid', gap: 2, mb: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <TabelaContagem titulo="Rejeições por motivo" contagens={resultado.rejeicoesPorMotivo} vazio="Nenhuma linha rejeitada." />
            <TabelaContagem
              titulo="Modalidade das importadas, por origem"
              contagens={resultado.modalidadesPorOrigem}
              vazio="Nenhuma contratação importada."
            />
          </Box>

          {resultado.linhasRejeitadas.length > 0 && (
            <Paper>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, pt: 2, pb: 1 }}>
                Linhas rejeitadas
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Linha</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Contrato</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Motivo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Detalhe</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {linhasDaPagina.map((linha) => (
                      <TableRow key={linha.linha} hover>
                        <TableCell>{linha.linha}</TableCell>
                        <TableCell>{linha.numeroContrato ?? '—'}</TableCell>
                        <TableCell>{linha.motivo}</TableCell>
                        <TableCell>{linha.detalhe}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={resultado.linhasRejeitadas.length}
                page={pagina}
                rowsPerPage={tamanho}
                rowsPerPageOptions={[10, 25, 50]}
                onPageChange={(_, novaPagina) => setPagina(novaPagina)}
                onRowsPerPageChange={(evento) => {
                  setTamanho(Number(evento.target.value))
                  setPagina(0)
                }}
              />
            </Paper>
          )}
        </>
      )}
    </>
  )
}
