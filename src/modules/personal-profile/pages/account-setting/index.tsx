import CommonButton from '@/components/buttons/CommonButton'
import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import CardForm from '@/components/Form/CardForm'
import PasswordField from '@/components/modal/ModalChangePassword/PasswordField'
import ModalConfirm from '@/components/modal/ModalConfirm'
import { LangConstant, PathConstant } from '@/const'
import { changePassword, logout } from '@/reducer/auth'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { EventInput } from '@/types'
import { passwordRegex } from '@/utils/yup'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

const AccountSetting = () => {
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Login } = useTranslation(LangConstant.NS_LOGIN)
  const { t: i18Setting } = useTranslation(LangConstant.NS_SETTING)
  const dispatch = useDispatch<AppDispatch>()
  const [isConfirmChangePassword, setIsConfirmChangePassword] = useState(false)
  const [payload, setPayload] = useState<any>({})
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18('LB_CURRENT_PASSWORD'),
          }) as string
        ),
      newPassword: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18('LB_NEW_PASSWORD'),
          }) as string
        )
        .notOneOf(
          [Yup.ref('currentPassword')],
          i18('MSG_PASSWORD_DIFF') as string
        )
        .matches(passwordRegex, i18Login('MSG_PASSWORD_INVALID') as string),
      confirmNewPassword: Yup.string()
        .trim()
        .required(
          i18('MSG_INPUT_REQUIRE', {
            name: i18('LB_RETYPE_NEW_PASSWORD'),
          }) as string
        )
        .oneOf(
          [Yup.ref('newPassword')],
          i18('MSG_PASSWORD_NOT_MATCH') as string
        ),
    }),
    onSubmit: values => {
      setIsConfirmChangePassword(true)
      setPayload(values)
    },
  })
  const handleChangePassword = () => {
    setIsConfirmChangePassword(false)
    dispatch(changePassword(payload))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18('MSG_CHANGE_PASSWORD_SUCCESS'),
          })
        )
        dispatch(updateLoading(true))
        dispatch(logout())
          .unwrap()
          .then(() => {
            window.location.href = PathConstant.LOGIN
          })
        dispatch(updateLoading(false))
      })
  }

  const handleChange = (e: EventInput, keyName: string) => {
    const value = e.target.value.replaceAll(' ', '')
    formik.setFieldValue(keyName, value)
  }

  return (
    <CommonScreenLayout title={''}>
      <CardForm title={i18('TXT_CHANGE_YOUR_PASSWORD')}>
        <form onSubmit={formik.handleSubmit}>
          <Box className={clsx(classes.listFields, classes.rootAccountSetting)}>
            <PasswordField
              required
              value={formik.values.currentPassword}
              label={i18('LB_CURRENT_PASSWORD') as string}
              placeholder={i18('PLH_PASSWORD') as string}
              keyName="currentPassword"
              error={
                !!formik.errors.currentPassword &&
                !!formik.touched.currentPassword
              }
              errorMessage={formik.errors.currentPassword}
              onChange={handleChange}
            />
            <PasswordField
              required
              value={formik.values.newPassword}
              label={i18('LB_NEW_PASSWORD') as string}
              placeholder={i18('PLH_NEW_PASSWORD') as string}
              keyName="newPassword"
              error={
                !!formik.errors.newPassword && !!formik.touched.newPassword
              }
              errorMessage={formik.errors.newPassword}
              onChange={handleChange}
            />
            <PasswordField
              required
              value={formik.values.confirmNewPassword}
              label={i18('LB_RETYPE_NEW_PASSWORD') as string}
              placeholder={i18('PLH_NEW_PASSWORD') as string}
              keyName="confirmNewPassword"
              error={
                !!formik.errors.confirmNewPassword &&
                !!formik.touched.confirmNewPassword
              }
              errorMessage={formik.errors.confirmNewPassword}
              onChange={handleChange}
            />
            <CommonButton type="submit" width={100} height={40}>
              {i18('LB_SUBMIT')}
            </CommonButton>
          </Box>
        </form>
      </CardForm>
      {isConfirmChangePassword && (
        <ModalConfirm
          title={i18('TXT_CHANGE_YOUR_PASSWORD')}
          description={i18Setting('TXT_CONFIRM_CHANGE_PASSWORD')}
          open={isConfirmChangePassword}
          onClose={() => {
            setIsConfirmChangePassword(false)
          }}
          onSubmit={handleChangePassword}
        />
      )}
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  listFields: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  rootAccountSetting: {
    width: '300px',
  },
}))

export default AccountSetting
