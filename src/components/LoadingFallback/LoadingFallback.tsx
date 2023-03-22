import { LangConstant } from '@/const'
import { CircularProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

interface IProps {
  pageLoading?: boolean
}

function LoadingFallback({ pageLoading }: IProps) {
  const { t: i18nCommon } = useTranslation(LangConstant.NS_COMMON)
  const classes = useStyles()

  return (
    <div
      className={clsx(
        classes.rootLoading,
        pageLoading ? classes.pageLoading : classes.componentLoading
      )}
    >
      <CircularProgress />
      <h4>{i18nCommon('MSG_LOADING_DATA')}</h4>
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    '& > h4': {
      paddingTop: 24,
    },
  },
  pageLoading: {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10000',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  componentLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
}))

export default LoadingFallback
