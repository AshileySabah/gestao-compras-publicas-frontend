import { NavLink, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import BarChartIcon from '@mui/icons-material/BarChart'
import ListAltIcon from '@mui/icons-material/ListAlt'
import UploadFileIcon from '@mui/icons-material/UploadFile'

const paginas = [
  { caminho: '/contratacoes', titulo: 'Contratações', icone: <ListAltIcon /> },
  { caminho: '/importacao', titulo: 'Importação', icone: <UploadFileIcon /> },
  { caminho: '/dashboard', titulo: 'Dashboard', icone: <BarChartIcon /> },
]

export function Layout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
          <AccountBalanceIcon />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Gestão de Compras Públicas
          </Typography>
          {paginas.map((pagina) => (
            <Button
              key={pagina.caminho}
              component={NavLink}
              to={pagina.caminho}
              color="inherit"
              startIcon={pagina.icone}
              sx={{ '&.active': { bgcolor: 'rgba(255, 255, 255, 0.18)' } }}
            >
              {pagina.titulo}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
