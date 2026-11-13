import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

type Propriedades = {
  aberto: boolean
  titulo: string
  mensagem: string
  textoConfirmar: string
  processando: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export function DialogoConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmar,
  processando,
  onConfirmar,
  onCancelar,
}: Propriedades) {
  return (
    <Dialog open={aberto} onClose={processando ? undefined : onCancelar} maxWidth="xs" fullWidth>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensagem}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelar} disabled={processando}>
          Cancelar
        </Button>
        <Button onClick={onConfirmar} color="error" variant="contained" disabled={processando}>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
