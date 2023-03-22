import { LangConstant } from '@/const'
import { formatNumber } from '@/utils'
import { Box } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

export interface ItemRowTableProps {
  totalActualRevenue?: number | undefined | string
  totalExpectRevenue?: number | undefined | string
  isEmpty?: boolean
}

export default function ItemRowCellEnd(props: ItemRowTableProps) {
  const classes = useStyles()
  const {
    totalActualRevenue = 0,
    totalExpectRevenue = 0,
    isEmpty = false,
  } = props
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)

  return (
    <>
      <TableRow>
        <TableCell
          component="th"
          className={isEmpty ? classes.emptyCell : ''}
          colSpan={100}
        >
          <Box className={clsx(classes.rootTableCell)}>
            {i18Project('TOTAL_EXPECTED_REVENUE')}:{' '}
            {formatNumber(totalExpectRevenue)} VND
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" colSpan={100}>
          <Box className={classes.rootTableCell}>
            {i18Project('TOTAL_ACTUAL_REVENUE')}:{' '}
            {formatNumber(totalActualRevenue)} VND
          </Box>
        </TableCell>
      </TableRow>
    </>
  )
}

const useStyles = makeStyles(() => ({
  rootTableCell: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'end',
  },
  emptyCell: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
  },
}))
