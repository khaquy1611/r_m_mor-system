import ConditionalRender from '@/components/ConditionalRender'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { PathConstant, TableConstant } from '@/const'
import { TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent } from 'react'
import StringFormat from 'string-format'

interface TableContractListProps {
  headCells: TableHeaderOption[]
  rows: any
  setPageSize: (value: number) => void
  setPageNum: (value: number) => void
  pageNum: number
  pageSize: number
}

const TableContractRelated = ({
  headCells,
  rows,
  setPageSize,
  setPageNum,
  pageNum,
  pageSize,
}: TableContractListProps) => {
  const classes = useStyles()

  const handlePageChange = (_: any, newPage: number) => {
    setPageNum(newPage)
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setPageSize(newLimit)
    setPageNum(1)
  }

  const handleNavigateToDetailPage = (contractId: string) => {
    const url = StringFormat(PathConstant.CONTRACT_DETAIL_FORMAT, contractId)
    window.open(url)
  }

  return (
    <Box className={classes.rootTableContractList}>
      <TableShare
        keyName={'id'}
        headCells={headCells}
        rows={rows}
        childComp={(row: any) => (
          <ItemRowTableV2
            useRightClickOpenNewTab
            link={StringFormat(
              PathConstant.CONTRACT_DETAIL_FORMAT,
              row.contractId
            )}
            rowClassName={classes.rowClassName}
            row={row}
            key={`table-checkbox-${row['contractId']}`}
            uuId={row['contractId']}
            headCells={headCells}
            keyName={'id'}
            onClickDetail={handleNavigateToDetailPage}
          />
        )}
      />
      <ConditionalRender conditional={!!rows.length} fallback={''}>
        <TablePaginationShare
          rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
          totalElements={rows.length}
          pageLimit={pageSize}
          currentPage={pageNum}
          onChangePage={handlePageChange}
          onChangeLimitPage={handleRowsPerPageChange}
        />
      </ConditionalRender>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootTableContractList: {
    marginTop: theme.spacing(4),
  },
  rowClassName: {
    '& .first-item': {
      minWidth: '220px',
      display: 'inline-block',
    },
  },
}))

export default TableContractRelated
