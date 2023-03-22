import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface InputTitleProps {
  title: string
  required?: boolean
}

const InputTitle = ({ title, required }: InputTitleProps) => {
  const classes = useStyles()
  return (
    <Box className={classes.rootInputTitle}>
      {title}
      {!!required && (
        <Box className={classes.mark} component="span">
          *
        </Box>
      )}
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootInputTitle: {
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  mark: {
    color: theme.color.error.secondary,
    marginLeft: theme.spacing(0.5),
  },
}))

export default InputTitle
