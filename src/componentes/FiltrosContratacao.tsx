import { useState } from 'react'
import type { FormEvent } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import SearchIcon from '@mui/icons-material/Search'
import { filtroVazio } from '../api/contratacoes'
import type { FiltroContratacao } from '../api/contratacoes'
import type { Modalidade, Orgao } from '../api/tipos'

type Propriedades = {
  orgaos: Orgao[]
  modalidades: Modalidade[]
  onFiltrar: (filtro: FiltroContratacao) => void
}

export function FiltrosContratacao({ orgaos, modalidades, onFiltrar }: Propriedades) {
  const [filtro, setFiltro] = useState<FiltroContratacao>(filtroVazio)

  function alterar(campo: keyof FiltroContratacao, valor: string) {
    setFiltro((atual) => ({ ...atual, [campo]: valor }))
  }

  function filtrar(evento: FormEvent) {
    evento.preventDefault()
    onFiltrar(filtro)
  }

  function limpar() {
    setFiltro(filtroVazio)
    onFiltrar(filtroVazio)
  }

  const orgaoSelecionado = orgaos.find((orgao) => orgao.id === filtro.orgaoId) ?? null

  return (
    <Paper component="form" onSubmit={filtrar} sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        <Autocomplete
          sx={{ gridColumn: { md: 'span 2' } }}
          options={orgaos}
          value={orgaoSelecionado}
          onChange={(_, orgao) => setFiltro((atual) => ({ ...atual, orgaoId: orgao?.id ?? null }))}
          getOptionLabel={(orgao) => `${orgao.nome} (${orgao.codigo})`}
          isOptionEqualToValue={(opcao, valor) => opcao.id === valor.id}
          noOptionsText="Nenhum órgão encontrado"
          renderInput={(parametros) => <TextField {...parametros} label="Órgão" size="small" />}
        />
        <TextField
          select
          label="Modalidade"
          size="small"
          value={filtro.modalidade}
          onChange={(evento) => alterar('modalidade', evento.target.value)}
        >
          <MenuItem value="">Todas</MenuItem>
          {modalidades.map((modalidade) => (
            <MenuItem key={modalidade.valor} value={modalidade.valor}>
              {modalidade.descricao}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Fornecedor"
          size="small"
          placeholder="Parte do nome"
          value={filtro.fornecedor}
          onChange={(evento) => alterar('fornecedor', evento.target.value)}
        />
        <TextField
          label="Assinatura de"
          type="date"
          size="small"
          value={filtro.dataInicio}
          onChange={(evento) => alterar('dataInicio', evento.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Assinatura até"
          type="date"
          size="small"
          value={filtro.dataFim}
          onChange={(evento) => alterar('dataFim', evento.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Valor final mínimo (R$)"
          type="number"
          size="small"
          value={filtro.valorMinimo}
          onChange={(evento) => alterar('valorMinimo', evento.target.value)}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
        />
        <TextField
          label="Valor final máximo (R$)"
          type="number"
          size="small"
          value={filtro.valorMaximo}
          onChange={(evento) => alterar('valorMaximo', evento.target.value)}
          slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button onClick={limpar} startIcon={<FilterAltOffIcon />}>
          Limpar
        </Button>
        <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
          Filtrar
        </Button>
      </Box>
    </Paper>
  )
}
