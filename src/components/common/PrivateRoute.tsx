import { Fragment, ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { PathConstant } from '@/const'

interface PrivateRouteProps {
  isAuth: boolean | undefined
  redirectPath?: string
  children: ReactNode
}

const PrivateRoute = ({
  isAuth,
  redirectPath,
  children,
}: PrivateRouteProps) => {
  const location = useLocation()
  if (!isAuth) {
    return (
      <Navigate
        to={redirectPath || PathConstant.PAGE_403}
        state={{ from: location }}
        replace
      />
    )
  }
  return <Fragment>{children}</Fragment>
}

export default PrivateRoute
