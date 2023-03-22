import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import CommonButton from '@/components/buttons/CommonButton'
import Typography from '@/components/common/Typography'
import InputCheckbox from '@/components/inputs/InputCheckbox'
import LoginInputField from '@/components/login/LoginInputField'
import { LangConstant } from '@/const'
import { LoginFormControls } from '@/types'
import { Fingerprint, Login } from '@mui/icons-material'
import { Box, LinearProgress, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

interface LoginFormProps {
  onSubmit: (
    loginFormControls: LoginFormControls,
    setSubmitting: Function
  ) => void
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Login } = useTranslation(LangConstant.NS_LOGIN)

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      showPassword: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: 'Email Address',
          }) as string
        ),
      password: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: 'Password',
          }) as string
        ),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(
        {
          email: values.email.trim(),
          password: values.password.trim(),
        },
        setSubmitting
      )
    },
  })

  const handleTogglePassword = () => {
    loginFormik.setFieldValue('showPassword', !loginFormik.values.showPassword)
  }

  const handleEmailChange = (newEmail: string) => {
    loginFormik.setFieldValue('email', newEmail)
  }

  const handlePasswordChange = (newPassword: string) => {
    loginFormik.setFieldValue('password', newPassword)
  }

  return (
    <form onSubmit={loginFormik.handleSubmit}>
      <Box className={classes.rootLoginForm}>
        {loginFormik.isSubmitting && (
          <LinearProgress className={classes.linearProgress} />
        )}
        <Typography className={classes.title}>
          {i18Login('TXT_LOGIN_FORM_TITLE')}
        </Typography>
        <Box className={classes.formControls}>
          <LoginInputField
            placeholder={i18Login('PLH_EMAIL')}
            error={!!loginFormik.errors.email && !!loginFormik.touched.email}
            errorMessage={loginFormik.errors.email as string}
            value={loginFormik.values.email}
            onChange={handleEmailChange}
          />
          <LoginInputField
            type={loginFormik.values.showPassword ? 'text' : 'password'}
            placeholder={i18Login('PLH_PASSWORD')}
            error={
              !!loginFormik.errors.password && !!loginFormik.touched.password
            }
            errorMessage={loginFormik.errors.password as string}
            value={loginFormik.values.password}
            onChange={handlePasswordChange}
          />
          <InputCheckbox
            label={i18Login('LB_SHOW_PASSWORD')}
            checked={loginFormik.values.showPassword}
            onClick={handleTogglePassword}
          />
          <CommonButton
            disabled={loginFormik.isSubmitting}
            height={48}
            width={'100%'}
            type="submit"
            onClick={loginFormik.handleSubmit}
          >
            <Box className={classes.buttonSubmitChildren}>
              <Login />
              {i18Login('LB_LOGIN')}
            </Box>
          </CommonButton>
        </Box>
      </Box>
    </form>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootLoginForm: {
    background: theme.color.white,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(3, 5),
    boxShadow: '0px 6px 1px rgba(63, 48, 37, 0.25)',
  },
  title: {
    color: theme.color.black.primary,
    fontSize: 24,
    fontWeight: 700,
    textAlign: 'center',
  },
  formControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  linearProgress: {
    marginBottom: theme.spacing(3),
  },
  buttonSubmitChildren: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}))

export default LoginForm
