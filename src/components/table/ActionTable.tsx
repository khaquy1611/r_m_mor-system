import { IAction } from '@/types'
import { theme } from '@/ui/mui/v5'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ConditionalRender from '../ConditionalRender'

interface IProps {
  actions: IAction[]
  onClickDetail?: () => void
  onClickDelete?: () => void
}

export default function ActionTable(props: IProps) {
  const { actions, onClickDetail, onClickDelete } = props
  const classes = useStyles()

  return (
    <Box className={classes.rootActionTable}>
      {actions?.map((item: IAction) => [
        <ConditionalRender key={'edit'} conditional={item.type === 'edit'}>
          <EditRounded data-title="button" onClick={onClickDetail} />
        </ConditionalRender>,
        <ConditionalRender key={'delete'} conditional={item.type === 'delete'}>
          <DeleteRounded data-title="button" onClick={onClickDelete} />
        </ConditionalRender>,
      ])}
    </Box>
  )
}

const useStyles = makeStyles((themeMui: Theme) => ({
  rootActionTable: {
    display: 'flex',
    justifyContent: 'center',
    gap: themeMui.spacing(2),
    '& [data-title="button"]': {
      cursor: 'pointer',
      width: 'max-content',
      color: theme.color.black.secondary,
    },
  },
}))
