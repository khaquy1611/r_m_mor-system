import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ModuleProject = () => {
  const location = useLocation()
  const { permissions }: AuthState = useSelector(selectAuth)
  const { useProjectDashboard } = permissions
  return (
    <Navigate
      to={
        useProjectDashboard
          ? PathConstant.PROJECT_DASHBOARD
          : PathConstant.PROJECT_LIST
      }
      state={{ from: location }}
      replace
    />
  )
}

export default ModuleProject
