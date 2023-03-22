import '@/components/ErrorBoundary/ErrorBoundary.scss'
import { PathConstant } from '@/const'
import logo from '@/ui/images/logo-mor.png'
import { Box } from '@mui/material'
import i18next from 'i18next'

interface IProps {
  errorMessage?: string
}

const ErrorLayout = ({ errorMessage }: IProps) => {
  const handleGoHome = () => {
    window.location.href = PathConstant.MAIN
  }
  return (
    <Box className={'boundary__wrapper'}>
      <Box className={'content'}>
        <Box className={'formContent'}>
          <img src={logo} alt="logo" className={'logo'} />
          <h1 className={'title'}>{errorMessage || ''}</h1>
          <Box className={'link'} onClick={handleGoHome}>
            {i18next.t('common:LB_GO_HOME') as string}
          </Box>
        </Box>
      </Box>
      <footer className={'footer'}>
        {i18next.t('common:TXT_APP_NAME')} &#169; {new Date().getFullYear()}
      </footer>
    </Box>
  )
}

export default ErrorLayout
