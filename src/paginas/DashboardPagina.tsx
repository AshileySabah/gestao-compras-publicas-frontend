import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { mensagemDeErro } from '../api/cliente'
import { buscarEvolucaoMensal, buscarQuantidadePorModalidade, buscarValorPorOrgao } from '../api/graficos'
import type { QuantidadePorModalidade, ValorPorMes, ValorPorOrgao } from '../api/tipos'
import { TituloPagina } from '../componentes/TituloPagina'
import { useAvisos } from '../componentes/avisosContexto'
import { formatarMoeda, formatarMoedaCompacta, formatarNumero } from '../util/formatos'

const nomesDosMeses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatarMes(mes: string): string {
  const [ano, numero] = mes.split('-')
  return `${nomesDosMeses[Number(numero) - 1]}/${ano.slice(2)}`
}

function encurtar(texto: string, limite: number): string {
  return texto.length > limite ? `${texto.slice(0, limite - 1)}…` : texto
}

type Dados = {
  orgaos: ValorPorOrgao[]
  modalidades: QuantidadePorModalidade[]
  meses: ValorPorMes[]
}

type PropriedadesTooltip<T> = {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: unknown }>
  linhas: (item: T) => ReactNode[]
}

function CaixaTooltip<T>({ active, payload, linhas }: PropriedadesTooltip<T>) {
  if (!active || !payload || payload.length === 0) {
    return null
  }
  const [titulo, ...resto] = linhas(payload[0].payload as T)
  return (
    <Paper elevation={3} sx={{ px: 1.5, py: 1, maxWidth: 320 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {titulo}
      </Typography>
      {resto.filter(Boolean).map((linha, indice) => (
        <Typography key={indice} variant="body2" color="text.secondary">
          {linha}
        </Typography>
      ))}
    </Paper>
  )
}

function CartaoGrafico({
  titulo,
  subtitulo,
  carregando,
  vazio,
  altura,
  children,
}: {
  titulo: string
  subtitulo: string
  carregando: boolean
  vazio: boolean
  altura: number
  children: ReactNode
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {subtitulo}
      </Typography>
      <Box sx={{ height: altura, display: carregando || vazio ? 'flex' : 'block', alignItems: 'center', justifyContent: 'center' }}>
        {carregando ? (
          <CircularProgress />
        ) : vazio ? (
          <Typography color="text.secondary">Nenhuma contratação no banco. Importe um arquivo para ver o gráfico.</Typography>
        ) : (
          children
        )}
      </Box>
    </Paper>
  )
}

export function DashboardPagina() {
  const tema = useTheme()
  const { avisarErro } = useAvisos()
  const [dados, setDados] = useState<Dados>({ orgaos: [], modalidades: [], meses: [] })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([buscarValorPorOrgao(), buscarQuantidadePorModalidade(), buscarEvolucaoMensal()])
      .then(([orgaos, modalidades, meses]) => setDados({ orgaos, modalidades, meses }))
      .catch((erro) => avisarErro(mensagemDeErro(erro)))
      .finally(() => setCarregando(false))
  }, [avisarErro])

  const cor = tema.palette.primary.main
  const grade = tema.palette.divider
  const textoEixo = { fill: tema.palette.text.secondary, fontSize: 12 }
  const orgaos = dados.orgaos.map((orgao) => ({ ...orgao, rotulo: `${encurtar(orgao.nome, 38)} (${orgao.codigo})` }))

  return (
    <>
      <TituloPagina titulo="Dashboard" subtitulo="Gráficos com os dados gravados no banco" />

      <Box sx={{ display: 'grid', gap: 2 }}>
        <CartaoGrafico
          titulo="Valor contratado por órgão"
          subtitulo="Os 10 órgãos com maior valor final somado"
          carregando={carregando}
          vazio={orgaos.length === 0}
          altura={420}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={orgaos} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
              <CartesianGrid horizontal={false} stroke={grade} />
              <XAxis type="number" tickFormatter={formatarMoedaCompacta} tick={textoEixo} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="rotulo" width={300} tick={textoEixo} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: tema.palette.action.hover }}
                content={({ active, payload }) => (
                  <CaixaTooltip<ValorPorOrgao>
                    active={active}
                    payload={payload}
                    linhas={(orgao) => [
                      `${orgao.nome} (${orgao.codigo})`,
                      `Valor final: ${formatarMoeda(orgao.valorTotal)}`,
                      orgao.unidadeExemplo ? `UG de exemplo: ${orgao.unidadeExemplo}` : null,
                    ]}
                  />
                )}
              />
              <Bar dataKey="valorTotal" fill={cor} radius={[0, 4, 4, 0]} maxBarSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </CartaoGrafico>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          <CartaoGrafico
            titulo="Contratações por modalidade"
            subtitulo="Quantidade de contratações em cada modalidade"
            carregando={carregando}
            vazio={dados.modalidades.length === 0}
            altura={420}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados.modalidades} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
                <CartesianGrid horizontal={false} stroke={grade} />
                <XAxis type="number" allowDecimals={false} tickFormatter={formatarNumero} tick={textoEixo} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="descricao" width={190} tick={textoEixo} axisLine={false} tickLine={false} interval={0} />
                <Tooltip
                  cursor={{ fill: tema.palette.action.hover }}
                  content={({ active, payload }) => (
                    <CaixaTooltip<QuantidadePorModalidade>
                      active={active}
                      payload={payload}
                      linhas={(item) => [item.descricao, `${formatarNumero(item.quantidade)} contratações`]}
                    />
                  )}
                />
                <Bar dataKey="quantidade" fill={cor} radius={[0, 4, 4, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CartaoGrafico>

          <CartaoGrafico
            titulo="Evolução mensal do valor contratado"
            subtitulo="Últimos 12 meses, pela data de assinatura"
            carregando={carregando}
            vazio={dados.meses.length === 0}
            altura={420}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dados.meses} margin={{ top: 8, right: 24, bottom: 0, left: 8 }}>
                <CartesianGrid vertical={false} stroke={grade} />
                <XAxis dataKey="mes" tickFormatter={formatarMes} tick={textoEixo} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatarMoedaCompacta} tick={textoEixo} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  cursor={{ stroke: grade }}
                  content={({ active, payload }) => (
                    <CaixaTooltip<ValorPorMes>
                      active={active}
                      payload={payload}
                      linhas={(item) => [
                        formatarMes(item.mes),
                        `Valor final: ${formatarMoeda(item.valorTotal)}`,
                        `${formatarNumero(item.quantidade)} ${item.quantidade === 1 ? 'contratação' : 'contratações'}`,
                      ]}
                    />
                  )}
                />
                <Line
                  type="linear"
                  dataKey="valorTotal"
                  stroke={cor}
                  strokeWidth={2}
                  dot={{ r: 4, fill: cor, stroke: tema.palette.background.paper, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CartaoGrafico>
        </Box>
      </Box>
    </>
  )
}
