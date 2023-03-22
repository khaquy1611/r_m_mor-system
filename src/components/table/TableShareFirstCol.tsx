import { TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ItemRowTableV2 from './ItemRowTableV2'
import TableShare from './TableShare'

interface TableShareFirstColProps {
  headCells: TableHeaderOption[]
  rows: any
  useKeyIndex?: boolean
  doubleFirstCol: string
}

const TableShareFirstCol = ({
  headCells,
  rows,
  useKeyIndex = false,
  doubleFirstCol,
}: TableShareFirstColProps) => {
  const classes = useStyles()

  return (
    <TableShare
      keyName={'id'}
      doubleFirstCol={!!rows.length ? doubleFirstCol : ''}
      headCells={
        !!rows.length ? headCells : headCells.slice(1, headCells.length)
      }
      rows={rows}
      isShowCheckbox={false}
      childComp={(row: any, index: number) => (
        <ItemRowTableV2
          rowClassName={classes.rowClassName}
          row={row}
          key={`table-checkbox-${!useKeyIndex ? row['id'] : index}`}
          isShowCheckbox={false}
          uuId={row['id']}
          headCells={headCells}
          keyName={'id'}
          onClickItem={() => {}}
          onClickDelete={() => {}}
          onClickDetail={() => {}}
        />
      )}
    />
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rowClassName: {
    '& td:first-child': {
      borderRight: `1px solid ${theme.color.grey.secondary}`,
    },
    '& .first-item': {
      display: 'inline-block',
      width: '160px',
    },
  },
}))

export default TableShareFirstCol
