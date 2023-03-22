import i18next from 'i18next'
import ErrorLayout from '@/components/common/ErrorLayout'
import '@/components/ErrorBoundary/ErrorBoundary.scss'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/reducer/auth'
import { PathConstant } from '@/const'
import { Navigate, useLocation } from 'react-router-dom'

interface PageErrorProps {
  errorMessage?: string
}

const PageError = ({ errorMessage }: PageErrorProps) => {
  const location = useLocation()
  const { token, permissions } = useSelector(selectAuth)

  const roles = !!Object.keys(permissions).length

  if (!token) {
    window.location.href = PathConstant.LOGIN
  }

  if (!roles) {
    return (
      <Navigate to={PathConstant.MAIN} state={{ from: location }} replace />
    )
  }

  return <ErrorLayout errorMessage={errorMessage} />
}

export default PageError
