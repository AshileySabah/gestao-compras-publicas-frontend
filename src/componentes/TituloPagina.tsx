import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Propriedades = {
  titulo: string
  subtitulo?: string
  acoes?: ReactNode
}

export function TituloPagina({ titulo, subtitulo, acoes }: Propriedades) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography variant="body2" color="text.secondary">
            {subtitulo}
          </Typography>
        )}
      </Box>
      {acoes}
    </Box>
  )
}
