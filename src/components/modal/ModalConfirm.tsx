import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../common/Modal'
import Typography from '../common/Typography'

interface ModalConfirmProps {
  open: boolean
  title: string
  description: string
  useNextStep?: boolean
  cancelDisabled?: boolean
  titleSubmit?: string
  labelButtonCustom?: string
  isButtonCustom?: boolean
  onClose: () => void
  onSubmit: () => void
  onDontSave?: () => void
  onSubmitCustom?: () => void
}

const ModalConfirm = ({
  open,
  title,
  description,
  useNextStep,
  titleSubmit,
  labelButtonCustom,
  cancelDisabled = false,
  isButtonCustom = false,
  onClose,
  onSubmit,
  onDontSave,
  onSubmitCustom,
}: ModalConfirmProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    handleClose()
    onSubmit()
  }

  const handleDontSave = () => {
    handleClose()
    !!onDontSave && onDontSave()
  }

  return (
    <Modal
      open={open}
      title={title}
      labelSubmit={
        useNextStep
          ? titleSubmit
            ? titleSubmit
            : i18('LB_SAVE_CHANGES')
          : titleSubmit
          ? titleSubmit
          : i18('LB_SUBMIT')
      }
      labelButtonCustom={labelButtonCustom}
      isButtonCustom={isButtonCustom}
      useButtonCancel={!useNextStep}
      useButtonDontSave={useNextStep}
      cancelDisabled={cancelDisabled}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onDontSave={handleDontSave}
      onSubmitCustom={onSubmitCustom}
    >
      <Box className={classes.foreground}>
        <Typography className={classes.description}>{description}</Typography>
      </Box>
    </Modal>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    fontSize: '16px !important',
  },
  foreground: {
    background: theme.color.black.porcelain,
    padding: theme.spacing(2, 3),
  },
  confirmed: {
    marginTop: theme.spacing(2),
  },
}))

export default ModalConfirm
