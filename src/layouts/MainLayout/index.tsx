import Processing from '@/components/common/Processing'
import { ApiConstant, AppConstant, PathConstant } from '@/const'
import { SCREEN_TABLET } from '@/const/app.const'
import { AuthState, getSelfInfo, selectAuth } from '@/reducer/auth'
import { ScreenState, selectScreen, setIsShowSideBar } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import AllRoutesOfFeatures from './components/AllRoutesOfFeatures'
import HeaderTop from './components/HeaderTop'
import LeftNavigation from './components/LeftNavigation'
import Sidebar from './components/Sidebar'
import StringFormat from 'string-format'
import Cookies from 'js-cookie'

const MainLayout = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { token, permissions, staff }: AuthState = useSelector(selectAuth)
  const { isLoading, isShowSideBar }: ScreenState = useSelector(selectScreen)

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })
  const [hasRequestProfile, setHasRequestProfile] = useState(false)

  const isRoles = useMemo(() => {
    return !!Object.keys(permissions).length
  }, [permissions])

  const useSidebar = useMemo(() => {
    const pageIgnoreSidebar = [
      PathConstant.MAIN,
      PathConstant.MODULE_FINANCE,
      PathConstant.FINANCE_DASHBOARD,
      PathConstant.MODULE_CONTRACT,
      PathConstant.CONTRACT_LIST,
      PathConstant.CONTRACT_CREATE,
      PathConstant.CONTRACT_DETAIL_FORMAT,
    ]
    const detailId =
      location.pathname.split('/')[location.pathname.split('/').length - 1]
    const ignoreDetail = pageIgnoreSidebar.some((path: string) =>
      StringFormat(path, detailId).includes(location.pathname)
    )
    if (ignoreDetail) return !ignoreDetail
    return !pageIgnoreSidebar.includes(location.pathname)
  }, [location.pathname])

  const isHomePage = useMemo(
    () => location.pathname === PathConstant.MAIN,
    [location.pathname]
  )

  const isOverflowHidden = useMemo(() => {
    const pageIgnoreSidebar = [PathConstant.DAILY_REPORT]
    return pageIgnoreSidebar.includes(location.pathname)
  }, [location.pathname])

  if (!token) {
    window.location.href = PathConstant.LOGIN
    localStorage.setItem(AppConstant.LOCATION_FROM_LOCAL, location.pathname)
  }
  const handleShowSideBar = () => {
    dispatch(setIsShowSideBar(!isShowSideBar))
  }

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (dimensions.width > SCREEN_TABLET) {
      dispatch(setIsShowSideBar(true))
    } else {
      dispatch(setIsShowSideBar(false))
    }
  }, [dimensions])

  useEffect(() => {
    if (!token) return
    if (!isRoles && hasRequestProfile) {
      navigate(PathConstant.LOGIN)
      return
    }
    !isRoles &&
      dispatch(getSelfInfo()).finally(() => {
        setHasRequestProfile(true)
      })
  }, [hasRequestProfile])

  return !isRoles ? (
    <Processing open />
  ) : (
    <Fragment>
      <Processing open={isLoading} />
      <Box className={classes.rootMainLayout}>
        <LeftNavigation
          useSidebar={useSidebar}
          isShowSideBar={isShowSideBar}
          onShowSideBar={handleShowSideBar}
        />
        {useSidebar && <Sidebar isShowSideBar={isShowSideBar} />}
        <Box className={classes.rightLayout}>
          {!isHomePage && staff && <HeaderTop />}
          <Box
            className={clsx(
              classes.pages,
              !isHomePage && staff && classes.pageHeightHeaderExisted,
              isOverflowHidden && classes.hiddenScroll
            )}
            id="main__layout"
          >
            <AllRoutesOfFeatures />
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootMainLayout: {
    padding: 0,
    display: 'flex',
    height: '100vh',
  },
  rightLayout: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  pages: {
    width: '100%',
    height: '100%',
    flex: 1,
    overflow: 'auto',
  },
  pageHeightHeaderExisted: {
    height: 'calc(100% - 71px) !important',
  },
  hiddenScroll: {
    overflow: 'hidden',
  },
}))

export default MainLayout
