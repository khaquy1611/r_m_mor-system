import { LangConstant } from '@/const'
import { theme } from '@/ui/mui/v5'
import { Box, Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

interface HeaderProjectProps {}

const HeaderProjectList = ({}: HeaderProjectProps) => {
  const classes = useStyles()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  return (
    <Box className={classes.rootHeaderProjects}>
      <Box data-title="actions-and-filter">
        <Button variant="outlined">{i18Project('LB_SELECT_POSITION')}</Button>
        <Button variant="outlined">{i18Project('BUTTON_ADD')}</Button>
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((themeMui: Theme) => ({
  rootHeaderProjects: {
    width: '100%',
    marginBottom: '10px',
    '& [data-title="actions-and-filter"]': {
      display: 'flex',
      marginBottom: themeMui.spacing(4),
      flexWrap: 'wrap',
      gap: '20px',
      '& [data-title="wrap-filter"]': {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
      },
    },
  },
  labelAdd: {
    marginLeft: themeMui.spacing(0.5),
  },
  labelAction: {
    marginRight: themeMui.spacing(0.5),
  },
  buttonAdd: {
    height: theme.spacing(5),
  },
}))
export default HeaderProjectList
