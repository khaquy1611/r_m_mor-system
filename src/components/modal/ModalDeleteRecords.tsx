import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Modal from '../common/Modal'
import Typography from '../common/Typography'

interface ModalDeleteRecordsProps {
  titleMessage: string
  subMessage: string
  open: boolean
  labelSubmit?: any
  onClose: () => void
  onSubmit: () => void
}

const ModalDeleteRecords = ({
  open,
  onClose,
  labelSubmit,
  onSubmit,
  titleMessage,
  subMessage,
}: ModalDeleteRecordsProps) => {
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    handleClose()
    onSubmit()
  }

  return (
    <Modal
      open={open}
      title={titleMessage}
      labelSubmit={labelSubmit || 'Delete'}
      color="error"
      onClose={handleClose}
      onSubmit={handleSubmit}
    >
      <Box className={classes.foreground}>
        <Typography className={classes.description}>{subMessage}</Typography>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    fontSize: '16px !important',
    wordBreak: 'break-all',
  },
  foreground: {
    background: theme.color.black.porcelain,
    padding: theme.spacing(2, 3),
  },
  confirmed: {
    marginTop: theme.spacing(2),
  },
}))

export default ModalDeleteRecords
