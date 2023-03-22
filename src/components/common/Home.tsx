import { Box, Theme } from '@mui/material'
import bannerUrl from '@/ui/images/banner.jpeg'
import { makeStyles } from '@mui/styles'

const Home = () => {
  const classes = useStyles()

  return <Box className={classes.rootHome}></Box>
}

const useStyles = makeStyles((theme: Theme) => ({
  rootHome: {
    backgroundColor: theme.color.blue.primary,
    backgroundImage: `url(${bannerUrl})`,
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
}))

export default Home
