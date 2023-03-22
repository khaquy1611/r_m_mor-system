import { LangConstant } from '@/const'
import { formatNumber } from '@/utils'
import { Box } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

export interface ItemRowTableProps {
  totalCost?: number
  isEmpty?: boolean
}

export default function ItemRowCellEnd(props: ItemRowTableProps) {
  const classes = useStyles()
  const { totalCost = 0, isEmpty = false } = props
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  return (
    <TableRow>
      <TableCell
        component="th"
        colSpan={100}
        className={clsx(
          classes.rootTableCell,
          isEmpty ? classes.emptyCell : ''
        )}
      >
        <Box data-title="box-bottom">
          {i18Project('TXT_TOTAL_COST')}: {formatNumber(totalCost)} VND
        </Box>
      </TableCell>
    </TableRow>
  )
}

const useStyles = makeStyles(() => ({
  rootTableCell: {
    '& [data-title ="box-bottom"]': {
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'end',
    },
  },
  emptyCell: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
  },
}))
