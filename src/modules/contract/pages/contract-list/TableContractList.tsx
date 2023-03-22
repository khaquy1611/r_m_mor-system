import ConditionalRender from '@/components/ConditionalRender'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { PathConstant, TableConstant } from '@/const'
import { AppDispatch } from '@/store'
import { TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { IListContractsParams } from '../../models'
import {
  contractSelector,
  IContractState,
  setContractQueryParameters,
} from '../../reducer/contract'

interface TableContractListProps {
  params: IListContractsParams
  headCells: TableHeaderOption[]
  setHeadCells: Dispatch<SetStateAction<TableHeaderOption[]>>
  rows: any
}
const TableContractList = ({
  params,
  headCells,
  setHeadCells,
  rows,
}: TableContractListProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { total, contractQueryParameters }: IContractState =
    useSelector(contractSelector)

  const handlePageChange = (_: any, newPage: number) => {
    const newQueryParameters = {
      ...contractQueryParameters,
      pageNum: newPage,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    const newQueryParameters = {
      ...contractQueryParameters,
      pageNum: 1,
      pageSize: newLimit,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  const handleNavigateToDetailPage = (contractId: string) => {
    const url = StringFormat(PathConstant.CONTRACT_DETAIL_FORMAT, contractId)
    navigate(url)
  }

  const handleSortChange = (index: number, orderBy: string | undefined) => {
    const newHeadCells = [...headCells]
    const newSortBy = newHeadCells[index].sortBy
    const newOrderBy = orderBy === 'asc' ? 'desc' : 'asc'
    newHeadCells[index].orderBy = newOrderBy
    setHeadCells(newHeadCells)
    const newQueryParameters = {
      ...contractQueryParameters,
      orderBy: newOrderBy,
      sortBy: newSortBy,
    }
    dispatch(setContractQueryParameters(newQueryParameters))
  }

  return (
    <Box className={classes.rootTableContractList}>
      <TableShare
        keyName={'id'}
        headCells={headCells}
        rows={rows}
        onSortChange={handleSortChange}
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
          totalElements={total}
          pageLimit={params.pageSize as number}
          currentPage={params.pageNum as number}
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

export default TableContractList
