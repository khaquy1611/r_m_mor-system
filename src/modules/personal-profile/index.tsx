import { PathConstant } from '@/const'
import { Navigate, useLocation } from 'react-router-dom'

const ModulePersonalProfile = () => {
  const location = useLocation()
  return (
    <Navigate
      to={PathConstant.YOUR_PROFILE}
      state={{ from: location }}
      replace
    />
  )
}

export default ModulePersonalProfile
