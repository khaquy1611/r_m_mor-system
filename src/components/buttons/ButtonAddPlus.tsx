import { Add } from '@mui/icons-material'
import { Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

interface IProps {
  onClick: () => void
  label: string
  textTransform?: string
}

function ButtonAddPlus({
  onClick,
  label,
  textTransform = 'capitalize',
}: IProps) {
  const classes = useStyles({ textTransform })
  return (
    <Button
      className={classes.rootButtonAddPlus}
      data-title="btn"
      onClick={onClick}
    >
      <Add data-title="icon-add" className={classes.iconAdd} />
      <span className={classes.textButton}>{label}</span>
    </Button>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootButtonAddPlus: {
    gap: theme.spacing(1),
    padding: '0 !important',
  },
  iconAdd: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '50%',
    backgroundColor: theme.color.blue.primary,
    color: theme.color.white,
  },
  textButton: {
    color: theme.color.black.primary,
    textTransform: (props: any) => props.textTransform,
    fontWeight: 400,
  },
}))

export default ButtonAddPlus
