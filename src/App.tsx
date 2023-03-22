import { AppConstant, PathConstant } from '@/const'
import LoginLayout from '@/layouts/LoginLayout'
import MainLayout from '@/layouts/MainLayout'
import { Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import ScreenAlert from './components/alerts/ScreenAlert'
import Page403Forbidden from './layouts/MainLayout/components/Page403Forbidden'
import Page404NotFound from './layouts/MainLayout/components/Page404NotFound'
import { AuthState, selectAuth } from './reducer/auth'

const App = () => {
  const { token }: AuthState = useSelector(selectAuth)

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(AppConstant.USER_LOCAL)
    }
    return () => {
      localStorage.removeItem(AppConstant.LOCATION_FROM_LOCAL)
    }
  }, [token])

  return (
    <Fragment>
      <ScreenAlert />
      <Routes>
        <Route path={PathConstant.LOGIN} element={<LoginLayout />} />
        <Route path={PathConstant.MAIN + '*'} element={<MainLayout />} />
        <Route path={PathConstant.PAGE_404} element={<Page404NotFound />} />
        <Route path={PathConstant.PAGE_403} element={<Page403Forbidden />} />
      </Routes>
    </Fragment>
  )
}

export default App
