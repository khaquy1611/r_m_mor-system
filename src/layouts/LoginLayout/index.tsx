import LogoCompany from '@/components/common/LogoCompany'
import Processing from '@/components/common/Processing'
import { ApiConstant, AppConstant, LangConstant, PathConstant } from '@/const'
import { getSelfInfo, login, selectAuth } from '@/reducer/auth'
import { alertError, alertSuccess, updateAlert } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { LoginFormControls } from '@/types'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { HttpStatusCode } from 'axios'
import clsx from 'clsx'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import LoginTheme from './components/LoginTheme'

const LoginLayout = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Login } = useTranslation(LangConstant.NS_LOGIN)
  const { token, permissions } = useSelector(selectAuth)

  const roles = !!Object.keys(permissions).length

  const [hasLogin, setHasLogin] = useState(false)

  const requestLogin = (
    { email, password }: LoginFormControls,
    setSubmitting: Function
  ) => {
    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18Login('MSG_LOGIN_SUCCESS'),
          })
        )
        navigateToHomePage()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }
  const navigateToHomePage = () => {
    const from = localStorage.getItem(AppConstant.LOCATION_FROM_LOCAL) || '/'
    navigate(from, { replace: true })
    localStorage.removeItem(AppConstant.LOCATION_FROM_LOCAL)
  }
  const handleLogin = (
    { email, password }: LoginFormControls,
    setSubmitting: Function
  ) => {
    setTimeout(() => {
      requestLogin(
        {
          email,
          password,
        },
        setSubmitting
      )
    }, 200)
  }

  useEffect(() => {
    if (!token) {
      setHasLogin(true)
      return
    }
    if (roles) {
      navigate(PathConstant.MAIN)
      return
    }
    dispatch(getSelfInfo())
      .unwrap()
      .finally(() => {
        setHasLogin(true)
      })
  }, [roles])

  useEffect(() => {
    localStorage.removeItem(ApiConstant.SESSION_INVALID)
  }, [])

  return !hasLogin ? (
    <Processing open />
  ) : (
    <Fragment>
      <LoginTheme className="display-flex">
        <Box className={classes.width50}>
          <LogoCompany />
        </Box>
        <Box className={clsx(classes.width50, 'center-root')}>
          <LoginForm onSubmit={handleLogin} />
        </Box>
      </LoginTheme>
    </Fragment>
  )
}
const useStyles = makeStyles(() => ({
  width50: {
    width: '50%',
  },
}))
export default LoginLayout
