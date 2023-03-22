import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ModalFeedBack from '@/components/modal/ModalFeedBack'
import { PathConstant } from '@/const'
import { ID_MODULE_SETTING } from '@/const/app.const'
import { MODULE_SETTING } from '@/const/path.const'
import modules from '@/modules/routes'
import { AuthState, logout, selectAuth } from '@/reducer/auth'
import { sendFeedback } from '@/reducer/common'
import {
  alertSuccess,
  ScreenState,
  selectScreen,
  updateLoading,
} from '@/reducer/screen'
import { AppDispatch } from '@/store'
import morLogoSingle from '@/ui/images/mor-logo-single.png'
import {
  Feedback,
  FormatIndentDecrease,
  FormatIndentIncrease,
  Logout,
  Settings,
} from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
interface ILeftNavigation {
  useSidebar: boolean
  isShowSideBar: boolean
  onShowSideBar: () => void
}

const LeftNavigation = ({
  isShowSideBar,
  onShowSideBar,
  useSidebar,
}: ILeftNavigation) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { pathname } = useLocation()
  const { t: i18 } = useTranslation()
  const { moduleName }: ScreenState = useSelector(selectScreen)
  const { permissions }: AuthState = useSelector(selectAuth)

  const [isShowModalLogout, setIsShowModalLogout] = useState(false)
  const [isShowFeedback, setIsShowFeedback] = useState(false)

  const isActiveSetting = useMemo(
    () => pathname.includes(MODULE_SETTING),
    [pathname]
  )

  const handleNavigateToHomePage = () => {
    navigate(PathConstant.MAIN)
  }

  const alertFeedBackSuccess = () => {
    dispatch(
      alertSuccess({
        message: i18('MSG_FEEDBACK_SUCCESS'),
      })
    )
  }

  const handleNavigateToModule = (pathNavigate: string) => {
    const isCurrentModule: boolean = pathname.includes(pathNavigate)
    if (!isCurrentModule) {
      navigate(pathNavigate)
    }
  }

  const handleLogout = () => {
    dispatch(updateLoading(true))
    dispatch(logout())
      .unwrap()
      .then(() => {
        window.location.href = PathConstant.LOGIN
      })
    dispatch(updateLoading(false))
  }

  const checkShowModule = (listPermission: Array<string>) => {
    return listPermission.some((key: string) => permissions[key])
  }

  const submitFeedBack = (value: any) => {
    dispatch(sendFeedback(value))
      .unwrap()
      .then(response => {
        setIsShowFeedback(false)
        dispatch(alertFeedBackSuccess)
      })
  }

  const isActive = (moduleName: string) => {
    const currentModuleName = pathname.split('/')[1]
    return moduleName === currentModuleName
  }

  return (
    <Box className={clsx(classes.rootLeftNavigation, 'position-rel')}>
      <Box
        className={clsx(classes.logoContainer, 'center-root')}
        onClick={handleNavigateToHomePage}
      >
        <img src={morLogoSingle} />
      </Box>
      <Box className={classes.modules}>
        {modules.map(
          md =>
            checkShowModule(md.roles) &&
            (md.id != ID_MODULE_SETTING ? (
              <Box
                title={md.labelName}
                key={md.id}
                className={clsx(classes.module, isActive(md.name) && 'active')}
                onClick={() => handleNavigateToModule(md.pathNavigate)}
              >
                <md.Icon
                  className={clsx(
                    classes.moduleIcon,
                    isActive(md.name) && 'active'
                  )}
                />
                <Box>{md.labelName}</Box>
              </Box>
            ) : (
              ''
            ))
        )}
        <Box className={clsx(classes.modules, classes.bottomContainer)}>
          <Box
            title={i18('LB_FEEDBACK')}
            className={clsx(classes.module, classes.feedback)}
            onClick={() => {
              setIsShowFeedback(true)
            }}
          >
            <Feedback className={clsx(classes.moduleIcon)} />
          </Box>
          <Box
            title={i18('LB_SETTING')}
            className={clsx(classes.module, isActiveSetting && 'show-sidebar')}
            onClick={() => {
              handleNavigateToModule(MODULE_SETTING)
            }}
          >
            <Settings className={clsx(classes.moduleIcon, 'icon-active')} />
            <Box>{i18('LB_SETTING')}</Box>
          </Box>
          {useSidebar && (
            <Box
              className={classes.toggleMenu}
              onClick={onShowSideBar}
              title="toggle-menu"
            >
              {isShowSideBar ? (
                <FormatIndentDecrease />
              ) : (
                <FormatIndentIncrease />
              )}
            </Box>
          )}
          <Box className={classes.line}></Box>
          <Box onClick={() => setIsShowModalLogout(true)} title="logout">
            <Logout className={classes.logoutImg} />
          </Box>
        </Box>
        <ModalDeleteRecords
          labelSubmit={i18('LB_LOG_OUT')}
          open={isShowModalLogout}
          onClose={() => setIsShowModalLogout(false)}
          onSubmit={handleLogout}
          titleMessage={i18('LB_LOG_OUT')}
          subMessage={i18('MSG_LOG_OUT')}
        />
        {isShowFeedback && (
          <ModalFeedBack
            onClose={() => setIsShowFeedback(false)}
            onSubmit={submitFeedBack}
          />
        )}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => {
  const borderGrey = `1px solid ${theme.color.grey.secondary}`
  return {
    feedback: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(2.3),
      width: '30px !important',
      fontWeight: 700,
      zIndex: 999999,
      color: theme.color.blue.primary,
      padding: 'unset !important',
      '& svg': {
        color: theme.color.blue.primary,
      },
      '&:hover': {
        background: `#FFFFFF !important`,
      },
    },
    bottomContainer: {
      cursor: 'pointer',
      margin: 'unset !important',
      position: 'absolute',
      bottom: theme.spacing(2),
      width: '100%',
    },
    logoutImg: {
      color: theme.color.black.secondary,
      width: '24px !important',
      height: '24px !important',
      transform: 'rotate(180deg)',
      marginTop: theme.spacing(1.5),
    },
    rootLeftNavigation: {
      zIndex: '2',
      width: theme.spacing(9),
      minWidth: theme.spacing(9),
      height: '100%',
      background: theme.color.white,
      borderRight: borderGrey,
    },
    logoContainer: {
      height: theme.spacing(9),
      borderBottom: borderGrey,
      cursor: 'pointer',
      '& img': {
        width: theme.spacing(5),
      },
    },
    modules: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    module: {
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: 10,
      lineHeight: 1,
      borderRadius: 0,
      width: 'calc(100%)',
      padding: theme.spacing(1, 0),
      backgroundColor: 'transparent',
      '&.show-sidebar': {
        background: theme.color.blue.primary,
        color: theme.color.white,
        '& .icon-active': {
          color: theme.color.white,
        },
        '&:hover': {
          background: theme.color.blue.primary,
          color: theme.color.white,
        },
      },
      '&:hover': {
        backgroundColor: theme.color.grey.secondary,
        color: '#000',
      },
      '&.active': {
        color: theme.color.white,
        backgroundColor: `${theme.color.blue.primary}`,
        fontWeight: 700,
      },
    },
    moduleIcon: {
      fontSize: '32px !important',
      color: theme.color.black.secondary,

      '&.active': {
        color: theme.color.white,
      },
    },
    toggleMenu: {
      width: '100%',
      height: theme.spacing(6),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transitionDuration: '250ms',

      '&:hover': {
        backgroundColor: `${theme.color.grey.secondary}`,
      },

      '& svg': {
        fontSize: 32,
        color: theme.color.black.secondary,
      },
    },
    line: {
      borderTop: `1px solid ${theme.color.grey.secondary}`,
      width: '80%',
    },
    active: {
      color: `${theme.color.blue.primary} !important`,
    },
  }
})

export default LeftNavigation
