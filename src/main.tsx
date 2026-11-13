import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import App from './App'
import { ProvedorAvisos } from './componentes/ProvedorAvisos'
import { tema } from './tema'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <BrowserRouter>
        <ProvedorAvisos>
          <App />
        </ProvedorAvisos>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
