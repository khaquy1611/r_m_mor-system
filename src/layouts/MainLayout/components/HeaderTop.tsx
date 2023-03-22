import Notifications from '@/components/notify/Notifications'
import { PathConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { getAbbreviations, invertColor } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import String2Color from 'string-to-color'
const HeaderTop = () => {
  const { t: i18 } = useTranslation()
  const { staff }: AuthState = useSelector(selectAuth)
  const navigate = useNavigate()
  const colorBackground = String2Color(staff?.name)
  const colorShortName = invertColor(colorBackground)
  const classes = useStyles({
    background: colorBackground,
    color: colorShortName,
  })
  const shortName = getAbbreviations(staff?.name ?? '')

  const handleOpenProfile = () => {
    navigate(PathConstant.YOUR_PROFILE)
  }
  return (
    <Box className={classes.rootHeaderLayout}>
      <Box className="header-left">
        <Box className="title">{i18('TXT_APP_NAME')}</Box>
      </Box>

      <Box className="header-right">
        <Box className={classes.headerDots}>
          <Notifications />
        </Box>
        <Box className={classes.line}></Box>
        {!!staff && (
          <Box className="my-profile" onClick={handleOpenProfile}>
            <Box className={classes.avatar}>{shortName}</Box>
            <Box className={classes.info}>
              <Box className="username">{staff?.name}</Box>
              <Box className="position">{staff?.positionName}</Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootHeaderLayout: {
    width: '100%',
    height: '71px',
    background: '#ffffff',
    alignItems: 'center',
    padding: theme.spacing(1, 6.5, 1, 6.5),
    boxShadow: 'rgba(17, 17, 26, 0.1) 0px 1px 0px',
    position: 'sticky',
    zIndex: '3',
    top: '0',
    display: 'flex',
    justifyContent: 'space-between',
    '& .my-profile': {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    '& .title': {
      fontWeight: 700,
      fontSize: 18,
      color: theme.color.blue.primary,
    },
    '& .header-right': {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      margin: '0 20px 0 20px',
    },
  },
  headerDots: {
    display: 'flex',
  },
  avatar: {
    width: '40px',
    height: '40px',
    background: ({ background }: any) => background,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: ({ color }: any) => color,
    marginRight: '10px',
    position: 'relative',
  },
  info: {
    '& .username': {
      fontSize: '18px',
      fontWeight: '700',
      maxWidth: '240px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    '& .position': {
      fontSize: '14px',
      fontWeight: '400',
    },
  },
  line: {
    width: '1px',
    height: '50px',
    background: '#dee2e6',
    margin: '0 10px 0 10px',
  },
}))
export default HeaderTop
