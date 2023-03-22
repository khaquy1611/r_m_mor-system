import Typography from '@/components/common/Typography'
import modules from '@/modules/routes'
import { AuthState, selectAuth } from '@/reducer/auth'
import { ScreenState, selectScreen, updateModuleName } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { NavItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
interface ISidebar {
  isShowSideBar: boolean
}

const Sidebar = ({ isShowSideBar }: ISidebar) => {
  const classes = useStyles()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { moduleName }: ScreenState = useSelector(selectScreen)
  const { permissions }: AuthState = useSelector(selectAuth)

  const { pathname } = location

  const features = useMemo(() => {
    return modules.find(md => md.name === moduleName)?.features || []
  }, [moduleName])

  const handleNavigateManagementPage = (path: string) => {
    navigate(path)
  }
  const dispatchModuleName = () => {
    const multiPathname = location.pathname
      .split('/')
      .filter(pathname => pathname)
    dispatch(updateModuleName(multiPathname[0]))
  }

  useEffect(() => {
    dispatchModuleName()
  }, [pathname])

  return (
    <Box
      className={clsx(classes.rootSidebar, !isShowSideBar && 'hide-sidebar')}
    >
      <Box
        className={clsx(
          classes.sidebar,
          !isShowSideBar && 'hide-sidebar',
          'show-sidebar'
        )}
      >
        <Box className={clsx(classes.navList)}>
          {features
            .filter(feature => permissions[feature.role] || feature.role === '')
            .map((navItem: NavItem) => (
              <Typography
                className={classes.navItem}
                active={pathname.includes(navItem.pathRoot)}
                key={navItem.id}
                onClick={() =>
                  handleNavigateManagementPage(navItem.pathNavigate)
                }
              >
                {navItem.label}
              </Typography>
            ))}
        </Box>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootSidebar: {
    background: theme.color.grey.tertiary,
    borderRight: `1px solid ${theme.color.grey.secondary}`,
    position: 'relative',
    width: theme.spacing(30),
    transitionDuration: '350ms',
    height: '100%',
    transform: 'translateX(0%)',
    '&.hide-sidebar': {
      zIndex: '1',
      transform: 'translateX(-100%)',
      width: '0',
    },
    '&.show-sidebar': {
      flexShrink: 0,
      width: theme.spacing(30),
      maxWidth: theme.spacing(30),
    },
  },
  sidebar: {
    transitionDuration: '350ms',
    transform: 'translateX(0%)',
    '&.hide-sidebar': {
      zIndex: '1',
      transform: 'translateX(-100%)',
      width: '0',
    },
    '&.show-sidebar': {
      flexShrink: 0,
      width: theme.spacing(30),
      maxWidth: theme.spacing(30),
    },
  },
  sidebarHeader: {
    height: theme.spacing(9),
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    position: 'relative',
  },
  navList: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingLeft: '10px',
  },
  navItem: {
    fontSize: 16,
    cursor: 'pointer',
    '&:hover': {
      color: theme.color.blue.primary,
    },
  },
}))

export default Sidebar
