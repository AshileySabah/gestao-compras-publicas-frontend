const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const formatoMoedaCompacto = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const formatoNumero = new Intl.NumberFormat('pt-BR')

export function formatarMoeda(valor: number | null | undefined): string {
  return valor === null || valor === undefined ? '—' : formatoMoeda.format(valor)
}

export function formatarMoedaCompacta(valor: number): string {
  return formatoMoedaCompacto.format(valor)
}

export function formatarNumero(valor: number): string {
  return formatoNumero.format(valor)
}

export function formatarData(dataIso: string | null | undefined): string {
  if (!dataIso) {
    return '—'
  }
  const [ano, mes, dia] = dataIso.split('-')
  return `${dia}/${mes}/${ano}`
}
