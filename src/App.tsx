import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './componentes/Layout'
import { ContratacaoFormularioPagina } from './paginas/ContratacaoFormularioPagina'
import { ContratacoesPagina } from './paginas/ContratacoesPagina'
import { DashboardPagina } from './paginas/DashboardPagina'
import { ImportacaoPagina } from './paginas/ImportacaoPagina'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/contratacoes" replace />} />
        <Route path="/contratacoes" element={<ContratacoesPagina />} />
        <Route path="/contratacoes/nova" element={<ContratacaoFormularioPagina />} />
        <Route path="/contratacoes/:id" element={<ContratacaoFormularioPagina />} />
        <Route path="/importacao" element={<ImportacaoPagina />} />
        <Route path="/dashboard" element={<DashboardPagina />} />
        <Route path="*" element={<Navigate to="/contratacoes" replace />} />
      </Route>
    </Routes>
  )
}
