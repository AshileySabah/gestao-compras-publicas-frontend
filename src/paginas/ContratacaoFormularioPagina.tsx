import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SaveIcon from '@mui/icons-material/Save'
import { erroDaApi, mensagemDeErro } from '../api/cliente'
import {
  buscarContratacao,
  buscarFornecedores,
  listarModalidades,
  listarOrgaos,
  salvarContratacao,
} from '../api/contratacoes'
import type { ContratacaoRequest } from '../api/contratacoes'
import type { Contratacao, Fornecedor, Modalidade, Orgao } from '../api/tipos'
import { TituloPagina } from '../componentes/TituloPagina'
import { useAvisos } from '../componentes/avisosContexto'

type Formulario = {
  numeroContrato: string
  codigoUg: string
  nomeUg: string
  objeto: string
  numeroLicitacao: string
  modalidade: string
  dataAssinatura: string
  dataPublicacaoDou: string
  dataInicioVigencia: string
  dataFimVigencia: string
  valorInicial: string
  valorFinal: string
}

type NovoOrgao = {
  codigo: string
  nome: string
  codigoOrgaoSuperior: string
  nomeOrgaoSuperior: string
}

type NovoFornecedor = {
  documento: string
  nome: string
}

const formularioVazio: Formulario = {
  numeroContrato: '',
  codigoUg: '',
  nomeUg: '',
  objeto: '',
  numeroLicitacao: '',
  modalidade: 'NAO_INFORMADA',
  dataAssinatura: '',
  dataPublicacaoDou: '',
  dataInicioVigencia: '',
  dataFimVigencia: '',
  valorInicial: '',
  valorFinal: '',
}

const novoOrgaoVazio: NovoOrgao = { codigo: '', nome: '', codigoOrgaoSuperior: '', nomeOrgaoSuperior: '' }

const novoFornecedorVazio: NovoFornecedor = { documento: '', nome: '' }

const origensModalidade: Record<string, string> = {
  ARQUIVO_COMPRAS: 'veio do arquivo de compras',
  DERIVADA_ITEM: 'derivada do arquivo de itens',
  INFORMADA_MANUALMENTE: 'informada manualmente',
  NAO_INFORMADA: 'não informada',
}

function texto(valor: string): string | null {
  return valor.trim() === '' ? null : valor.trim()
}

function numero(valor: string): number | null {
  return valor.trim() === '' ? null : Number(valor)
}

function paraFormulario(contratacao: Contratacao): Formulario {
  return {
    numeroContrato: contratacao.numeroContrato,
    codigoUg: contratacao.codigoUg,
    nomeUg: contratacao.nomeUg ?? '',
    objeto: contratacao.objeto ?? '',
    numeroLicitacao: contratacao.numeroLicitacao ?? '',
    modalidade: contratacao.modalidade.valor,
    dataAssinatura: contratacao.dataAssinatura,
    dataPublicacaoDou: contratacao.dataPublicacaoDou ?? '',
    dataInicioVigencia: contratacao.dataInicioVigencia ?? '',
    dataFimVigencia: contratacao.dataFimVigencia ?? '',
    valorInicial: contratacao.valorInicial === null ? '' : String(contratacao.valorInicial),
    valorFinal: String(contratacao.valorFinal),
  }
}

function Secao({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {titulo}
        </Typography>
        {acao}
      </Box>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
        {children}
      </Box>
    </Paper>
  )
}

export function ContratacaoFormularioPagina() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { avisarSucesso, avisarErro } = useAvisos()
  const [formulario, setFormulario] = useState<Formulario>(formularioVazio)
  const [origemModalidade, setOrigemModalidade] = useState<string | null>(null)
  const [orgaos, setOrgaos] = useState<Orgao[]>([])
  const [modalidades, setModalidades] = useState<Modalidade[]>([])
  const [orgao, setOrgao] = useState<Orgao | null>(null)
  const [criarOrgao, setCriarOrgao] = useState(false)
  const [novoOrgao, setNovoOrgao] = useState<NovoOrgao>(novoOrgaoVazio)
  const [fornecedor, setFornecedor] = useState<Fornecedor | null>(null)
  const [criarFornecedor, setCriarFornecedor] = useState(false)
  const [novoFornecedor, setNovoFornecedor] = useState<NovoFornecedor>(novoFornecedorVazio)
  const [buscaFornecedor, setBuscaFornecedor] = useState('')
  const [fornecedoresEncontrados, setFornecedoresEncontrados] = useState<Fornecedor[]>([])
  const [errosDosCampos, setErrosDosCampos] = useState<Record<string, string>>({})
  const [carregando, setCarregando] = useState(Boolean(id))
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    Promise.all([listarOrgaos(), listarModalidades()])
      .then(([listaOrgaos, listaModalidades]) => {
        setOrgaos(listaOrgaos)
        setModalidades(listaModalidades)
      })
      .catch((erro) => avisarErro(mensagemDeErro(erro)))
  }, [avisarErro])

  useEffect(() => {
    if (!id) {
      return
    }
    buscarContratacao(id)
      .then((contratacao) => {
        setFormulario(paraFormulario(contratacao))
        setOrigemModalidade(contratacao.origemModalidade)
        setOrgao(contratacao.orgao)
        setFornecedor(contratacao.fornecedor)
        setCarregando(false)
      })
      .catch((erro) => {
        avisarErro(mensagemDeErro(erro))
        navegar('/contratacoes', { replace: true })
      })
  }, [id, avisarErro, navegar])

  useEffect(() => {
    const espera = setTimeout(() => {
      buscarFornecedores(buscaFornecedor)
        .then(setFornecedoresEncontrados)
        .catch((erro) => avisarErro(mensagemDeErro(erro)))
    }, 300)
    return () => clearTimeout(espera)
  }, [buscaFornecedor, avisarErro])

  function alterar(campo: keyof Formulario, valor: string) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }))
  }

  function erroDoCampo(campo: string) {
    return { error: Boolean(errosDosCampos[campo]), helperText: errosDosCampos[campo] }
  }

  function montarDados(): ContratacaoRequest {
    return {
      numeroContrato: texto(formulario.numeroContrato),
      codigoUg: texto(formulario.codigoUg),
      nomeUg: texto(formulario.nomeUg),
      objeto: texto(formulario.objeto),
      numeroLicitacao: texto(formulario.numeroLicitacao),
      modalidade: formulario.modalidade,
      dataAssinatura: texto(formulario.dataAssinatura),
      dataPublicacaoDou: texto(formulario.dataPublicacaoDou),
      dataInicioVigencia: texto(formulario.dataInicioVigencia),
      dataFimVigencia: texto(formulario.dataFimVigencia),
      valorInicial: numero(formulario.valorInicial),
      valorFinal: numero(formulario.valorFinal),
      orgaoId: criarOrgao ? null : (orgao?.id ?? null),
      novoOrgao: criarOrgao
        ? {
            codigo: texto(novoOrgao.codigo),
            nome: texto(novoOrgao.nome),
            codigoOrgaoSuperior: texto(novoOrgao.codigoOrgaoSuperior),
            nomeOrgaoSuperior: texto(novoOrgao.nomeOrgaoSuperior),
          }
        : null,
      fornecedorId: criarFornecedor ? null : (fornecedor?.id ?? null),
      novoFornecedor: criarFornecedor
        ? { documento: texto(novoFornecedor.documento), nome: texto(novoFornecedor.nome) }
        : null,
    }
  }

  async function salvar(evento: FormEvent) {
    evento.preventDefault()
    setErrosDosCampos({})
    if (!criarOrgao && !orgao) {
      setErrosDosCampos({ orgaoId: 'Escolha um órgão ou marque "Novo órgão".' })
      return
    }
    if (!criarFornecedor && !fornecedor) {
      setErrosDosCampos({ fornecedorId: 'Escolha um fornecedor ou marque "Novo fornecedor".' })
      return
    }
    setSalvando(true)
    try {
      const salva = await salvarContratacao(id, montarDados())
      avisarSucesso(id ? `Contratação ${salva.numeroContrato} atualizada.` : `Contratação ${salva.numeroContrato} cadastrada.`)
      navegar('/contratacoes')
    } catch (erro) {
      const campos = erroDaApi(erro)?.campos ?? []
      setErrosDosCampos(Object.fromEntries(campos.map((campo) => [campo.campo, campo.mensagem])))
      avisarErro(mensagemDeErro(erro))
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  const opcoesFornecedor =
    fornecedor && !fornecedoresEncontrados.some((item) => item.id === fornecedor.id)
      ? [fornecedor, ...fornecedoresEncontrados]
      : fornecedoresEncontrados

  return (
    <Box component="form" onSubmit={salvar} noValidate>
      <TituloPagina
        titulo={id ? 'Editar contratação' : 'Nova contratação'}
        subtitulo={id ? `Contrato ${formulario.numeroContrato} — UG ${formulario.codigoUg}` : 'Cadastro manual de contratação'}
      />

      <Secao titulo="Contrato">
        <TextField
          label="Número do contrato"
          required
          size="small"
          value={formulario.numeroContrato}
          onChange={(evento) => alterar('numeroContrato', evento.target.value)}
          {...erroDoCampo('numeroContrato')}
        />
        <TextField
          label="Código da UG"
          required
          size="small"
          value={formulario.codigoUg}
          onChange={(evento) => alterar('codigoUg', evento.target.value)}
          {...erroDoCampo('codigoUg')}
        />
        <TextField
          label="Nome da UG"
          size="small"
          sx={{ gridColumn: { md: 'span 2' } }}
          value={formulario.nomeUg}
          onChange={(evento) => alterar('nomeUg', evento.target.value)}
          {...erroDoCampo('nomeUg')}
        />
        <TextField
          select
          label="Modalidade"
          size="small"
          sx={{ gridColumn: { md: 'span 2' } }}
          value={modalidades.length > 0 ? formulario.modalidade : ''}
          onChange={(evento) => alterar('modalidade', evento.target.value)}
          {...erroDoCampo('modalidade')}
          helperText={
            errosDosCampos.modalidade ??
            (origemModalidade ? `Origem atual: ${origensModalidade[origemModalidade]}. Se trocar, passa a ser informada manualmente.` : undefined)
          }
        >
          {modalidades.map((modalidade) => (
            <MenuItem key={modalidade.valor} value={modalidade.valor}>
              {modalidade.descricao}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Número da licitação"
          size="small"
          value={formulario.numeroLicitacao}
          onChange={(evento) => alterar('numeroLicitacao', evento.target.value)}
          {...erroDoCampo('numeroLicitacao')}
        />
        <Box />
        <TextField
          label="Objeto"
          size="small"
          multiline
          minRows={3}
          sx={{ gridColumn: '1 / -1' }}
          value={formulario.objeto}
          onChange={(evento) => alterar('objeto', evento.target.value)}
          {...erroDoCampo('objeto')}
        />
      </Secao>

      <Secao
        titulo="Órgão"
        acao={
          <FormControlLabel
            control={<Switch checked={criarOrgao} onChange={(evento) => setCriarOrgao(evento.target.checked)} />}
            label="Novo órgão"
          />
        }
      >
        {criarOrgao ? (
          <>
            <TextField
              label="Código do órgão"
              required
              size="small"
              value={novoOrgao.codigo}
              onChange={(evento) => setNovoOrgao({ ...novoOrgao, codigo: evento.target.value })}
              {...erroDoCampo('novoOrgao.codigo')}
            />
            <TextField
              label="Nome do órgão"
              required
              size="small"
              value={novoOrgao.nome}
              onChange={(evento) => setNovoOrgao({ ...novoOrgao, nome: evento.target.value })}
              {...erroDoCampo('novoOrgao.nome')}
            />
            <TextField
              label="Código do órgão superior"
              size="small"
              value={novoOrgao.codigoOrgaoSuperior}
              onChange={(evento) => setNovoOrgao({ ...novoOrgao, codigoOrgaoSuperior: evento.target.value })}
              {...erroDoCampo('novoOrgao.codigoOrgaoSuperior')}
            />
            <TextField
              label="Nome do órgão superior"
              size="small"
              value={novoOrgao.nomeOrgaoSuperior}
              onChange={(evento) => setNovoOrgao({ ...novoOrgao, nomeOrgaoSuperior: evento.target.value })}
              {...erroDoCampo('novoOrgao.nomeOrgaoSuperior')}
            />
          </>
        ) : (
          <Autocomplete
            sx={{ gridColumn: '1 / -1' }}
            options={orgaos}
            value={orgao}
            onChange={(_, selecionado) => setOrgao(selecionado)}
            getOptionLabel={(item) => `${item.nome} (${item.codigo})`}
            isOptionEqualToValue={(opcao, valor) => opcao.id === valor.id}
            noOptionsText="Nenhum órgão encontrado"
            renderInput={(parametros) => (
              <TextField {...parametros} label="Órgão" required size="small" {...erroDoCampo('orgaoId')} />
            )}
          />
        )}
      </Secao>

      <Secao
        titulo="Fornecedor"
        acao={
          <FormControlLabel
            control={<Switch checked={criarFornecedor} onChange={(evento) => setCriarFornecedor(evento.target.checked)} />}
            label="Novo fornecedor"
          />
        }
      >
        {criarFornecedor ? (
          <>
            <TextField
              label="Documento"
              required
              size="small"
              value={novoFornecedor.documento}
              onChange={(evento) => setNovoFornecedor({ ...novoFornecedor, documento: evento.target.value })}
              {...erroDoCampo('novoFornecedor.documento')}
              helperText={
                errosDosCampos['novoFornecedor.documento'] ??
                'CPF (11 dígitos), CNPJ (14 dígitos), estrangeiro (EX...) ou -11 para sigiloso'
              }
            />
            <TextField
              label="Nome do fornecedor"
              required
              size="small"
              sx={{ gridColumn: { md: 'span 3' } }}
              value={novoFornecedor.nome}
              onChange={(evento) => setNovoFornecedor({ ...novoFornecedor, nome: evento.target.value })}
              {...erroDoCampo('novoFornecedor.nome')}
            />
          </>
        ) : (
          <Autocomplete
            sx={{ gridColumn: '1 / -1' }}
            options={opcoesFornecedor}
            value={fornecedor}
            onChange={(_, selecionado) => setFornecedor(selecionado)}
            onInputChange={(_, valor, motivo) => {
              if (motivo === 'input') {
                setBuscaFornecedor(valor)
              }
            }}
            filterOptions={(opcoes) => opcoes}
            getOptionLabel={(item) => `${item.nome} (${item.documento})`}
            isOptionEqualToValue={(opcao, valor) => opcao.id === valor.id}
            noOptionsText="Nenhum fornecedor encontrado"
            renderInput={(parametros) => (
              <TextField
                {...parametros}
                label="Fornecedor"
                required
                size="small"
                placeholder="Digite parte do nome ou do documento"
                {...erroDoCampo('fornecedorId')}
              />
            )}
          />
        )}
      </Secao>

      <Secao titulo="Datas e valores">
        <TextField
          label="Data de assinatura"
          type="date"
          required
          size="small"
          value={formulario.dataAssinatura}
          onChange={(evento) => alterar('dataAssinatura', evento.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          {...erroDoCampo('dataAssinatura')}
        />
        <TextField
          label="Publicação no DOU"
          type="date"
          size="small"
          value={formulario.dataPublicacaoDou}
          onChange={(evento) => alterar('dataPublicacaoDou', evento.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          {...erroDoCampo('dataPublicacaoDou')}
        />
        <TextField
          label="Início da vigência"
          type="date"
          size="small"
          value={formulario.dataInicioVigencia}
          onChange={(evento) => alterar('dataInicioVigencia', evento.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          {...erroDoCampo('dataInicioVigencia')}
        />
        <TextField
          label="Fim da vigência"
          type="date"
          size="small"
          value={formulario.dataFimVigencia}
          onChange={(evento) => alterar('dataFimVigencia', evento.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          {...erroDoCampo('dataFimVigencia')}
        />
        <TextField
          label="Valor inicial (R$)"
          type="number"
          size="small"
          value={formulario.valorInicial}
          onChange={(evento) => alterar('valorInicial', evento.target.value)}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          {...erroDoCampo('valorInicial')}
        />
        <TextField
          label="Valor final (R$)"
          type="number"
          required
          size="small"
          value={formulario.valorFinal}
          onChange={(evento) => alterar('valorFinal', evento.target.value)}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
          {...erroDoCampo('valorFinal')}
        />
      </Secao>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button onClick={() => navegar('/contratacoes')} disabled={salvando}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  )
}
