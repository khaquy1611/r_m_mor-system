import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'

interface IStatusType {
  status: 'success' | 'error' | 'inProgress' | 'draft' | 'info' | string
  label: string
}

interface IProps {
  typeStatus: IStatusType
}

export default function StatusItem(props: IProps) {
  const { typeStatus } = props
  const classes = useStyles()
  const resultData = (status: string, label: string) => {
    let _resultData = { status: '', label: '' }
    if (status) {
      _resultData = {
        status: status,
        label: label,
      }
    }
    return _resultData
  }
  const statusItem = useMemo(
    () => resultData(typeStatus?.status, typeStatus?.label),
    [typeStatus?.status, typeStatus?.label]
  )

  return (
    <Box className={classes.rootStatusItem}>
      <div className={clsx(classes.rootStatusItem, statusItem?.status)}>
        {statusItem?.label}
      </div>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStatusItem: {
    width: 'max-content',
    borderRadius: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(0.5, 1),
    '&.success': {
      background: theme.color.green.primary,
      color: theme.color.white,
    },
    '&.error': {
      background: theme.color.error.primary,
      color: theme.color.white,
    },
    '&.inProgress': {
      background: theme.color.orange.primary,
      color: theme.color.white,
    },
    '&.draft': {
      background: theme.color.grey.primary,
      color: theme.color.white,
    },
    '&.info': {
      background: theme.color.blue.fourth,
      color: theme.color.white,
    },
  },
}))
