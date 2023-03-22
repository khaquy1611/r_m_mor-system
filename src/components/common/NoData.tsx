import noDataImg from '@/ui/images/no-data.png'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'

const NoData = () => {
  const classes = useStyles()

  return (
    <Box className={clsx(classes.rootNoData)}>
      <img className={classes.noDataImg} src={noDataImg} />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootNoData: {
    width: '100%',
    height: '100%',
    minHeight: theme.spacing(30),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataImg: {
    width: '500px',
  },
}))

export default NoData
