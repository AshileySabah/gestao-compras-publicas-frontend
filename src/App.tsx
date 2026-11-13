import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './componentes/Layout'
import { ContratacoesPagina } from './paginas/ContratacoesPagina'
import { DashboardPagina } from './paginas/DashboardPagina'
import { ImportacaoPagina } from './paginas/ImportacaoPagina'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/contratacoes" replace />} />
        <Route path="/contratacoes" element={<ContratacoesPagina />} />
        <Route path="/importacao" element={<ImportacaoPagina />} />
        <Route path="/dashboard" element={<DashboardPagina />} />
        <Route path="*" element={<Navigate to="/contratacoes" replace />} />
      </Route>
    </Routes>
  )
}
