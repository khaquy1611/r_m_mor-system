import { getTextEllipsis } from '@/utils'
import { Box, Dialog, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CommonButton from '../buttons/CommonButton'
import ConditionalRender from '../ConditionalRender'
import CloseIcon from '../icons/CloseIcon'
import Typography from './Typography'

interface ModalProps {
  open: boolean
  title?: any
  width?: number | string
  maxWidth?: number
  cancelDisabled?: boolean
  submitDisabled?: boolean
  labelSubmit?: any
  labelCancel?: string
  labelButtonCustom?: string
  children: ReactNode
  useButtonCancel?: boolean
  useButtonDontSave?: boolean
  isButtonCustom?: boolean
  className?: string
  useEditMode?: boolean
  onClose: () => void
  onSubmit?: () => void
  onSubmitCustom?: () => void
  onDontSave?: () => void
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined
  hideFooter?: boolean
}

const Modal = ({
  color,
  open,
  title,
  width,
  submitDisabled,
  labelSubmit,
  labelButtonCustom,
  children,
  onClose,
  onSubmit,
  onSubmitCustom,
  useButtonDontSave,
  isButtonCustom,
  onDontSave,
  className,
  maxWidth,
  hideFooter,
}: ModalProps) => {
  const classes = useStyles({ color, maxWidth })
  const { t: i18 } = useTranslation()

  const handleSubmit = () => {
    !!onSubmit && onSubmit()
  }

  useEffect(() => {
    function escape(e: any) {
      if (open && e.key == 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <Dialog
      className={clsx(classes.rootModal, className)}
      open={open}
      disableEscapeKeyDown
    >
      <Box className={clsx(classes.modal, 'modal')} style={{ width }}>
        <Box className={classes.modalHeader}>
          <Typography className={classes.title} title={title}>
            {getTextEllipsis(title)}
          </Typography>
          <CloseIcon onClick={onClose} />
        </Box>
        <Box className={clsx(classes.modalContent, 'modal-content')}>
          {children}
        </Box>
        <ConditionalRender conditional={!hideFooter}>
          <Box className={classes.modalFooter}>
            {!!useButtonDontSave && (
              <CommonButton
                color="warning"
                className={classes.btnSubmit}
                disabled={submitDisabled}
                onClick={!!onDontSave ? onDontSave : () => {}}
              >
                {i18('LB_DONT_SAVE')}
              </CommonButton>
            )}
            {isButtonCustom && (
              <CommonButton
                type="submit"
                className={classes.btnSubmit}
                color={color}
                disabled={submitDisabled}
                onClick={onSubmitCustom}
              >
                {labelButtonCustom}
              </CommonButton>
            )}
            <CommonButton
              type="submit"
              className={classes.btnSubmit}
              color={color}
              disabled={submitDisabled}
              onClick={handleSubmit}
            >
              {labelSubmit}
            </CommonButton>
          </Box>
        </ConditionalRender>
      </Box>
    </Dialog>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootModal: {
    '& .MuiPaper-root': {
      maxWidth: (props: any) => props.maxWidth,
    },
  },
  modal: {
    maxHeight: '100%',
    borderRadius: '4px',
    borderTop: (props: any) =>
      `6px solid ${
        props.color === 'error'
          ? theme.color.error.primary
          : theme.color.blue.primary
      }`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'auto',
  },
  modalHeader: {
    height: theme.spacing(7),
    padding: theme.spacing(0, 1.5, 0, 3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: theme.color.grey.tertiary,
    flexShrink: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  modalContent: {
    padding: theme.spacing(2, 3),
    fontSize: `${theme.spacing(2)}`,
    height: 'calc(100% - 120px)',
    overflow: 'auto',
    flex: 1,
  },
  modalFooter: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    background: theme.color.grey.tertiary,
  },
  buttonCancel: {
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    color: `${theme.color.black.secondary} !important`,
    width: 'max-content',
  },
  btnSubmit: {
    width: 'max-content !important',
  },
  confirmed: {
    padding: theme.spacing(0, 3, 3, 3),
  },
}))

Modal.defaultProps = {
  width: 600,
  maxWidth: '100vw',
  labelSubmit: 'Submit',
}

export default Modal
