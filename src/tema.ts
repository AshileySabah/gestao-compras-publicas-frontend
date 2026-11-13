import { createTheme } from '@mui/material/styles'
import { ptBR } from '@mui/material/locale'

export const tema = createTheme(
  {
    palette: {
      primary: { main: '#1d4e89' },
      secondary: { main: '#2e7d5b' },
      background: { default: '#f4f6f9' },
    },
    shape: { borderRadius: 8 },
  },
  ptBR,
)
