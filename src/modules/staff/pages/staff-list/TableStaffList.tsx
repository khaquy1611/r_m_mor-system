import ConditionalRender from '@/components/ConditionalRender'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { PathConstant, TableConstant } from '@/const'
import { AppDispatch } from '@/store'
import { TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { setStaffQueryParameters, staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'

interface TableStaffListProps {
  params: ListStaffParams
  onDeleteStaff: (staffId: string, staffCode: string) => void
  listChecked: string[]
  setListChecked: Dispatch<SetStateAction<string[]>>
  headCells: TableHeaderOption[]
  setHeadCells: Dispatch<SetStateAction<TableHeaderOption[]>>
  rows: any
}
interface IShowModalDeleteStaff {
  status: boolean
  staffId: string
  staffCode: string
}

const TableStaffList = ({
  params,
  onDeleteStaff,
  listChecked,
  setListChecked,
  headCells,
  setHeadCells,
  rows,
}: TableStaffListProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { total, staffQueryParameters }: StaffState = useSelector(staffSelector)

  const [showModalDeleteStaff, setShowModalDeleteStaff] =
    useState<IShowModalDeleteStaff>({
      status: false,
      staffId: '',
      staffCode: '',
    })

  const handlePageChange = (_: any, newPage: number) => {
    const newQueryParameters = {
      ...staffQueryParameters,
      pageNum: newPage,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
    setListChecked([])
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    const newQueryParameters = {
      ...staffQueryParameters,
      pageNum: 1,
      pageSize: newLimit,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
    setListChecked([])
  }

  const handleNavigateToDetailPage = (staffId: string) => {
    const url = StringFormat(PathConstant.STAFF_DETAIL_FORMAT, staffId)
    navigate(url)
  }

  const handleDeleteStaff = (id: string, row: any) => {
    setShowModalDeleteStaff({
      status: true,
      staffId: id,
      staffCode: row?.code,
    })
  }

  const handleCloseModalDeleteStaff = () => {
    setShowModalDeleteStaff({
      status: false,
      staffId: '',
      staffCode: '',
    })
  }

  const handleSubmitModalDeleteStaff = () => {
    onDeleteStaff(showModalDeleteStaff.staffId, showModalDeleteStaff.staffCode)
  }

  const handleSortChange = (index: number, orderBy: string | undefined) => {
    const newHeadCells = [...headCells]
    const newSortBy = newHeadCells[index].sortBy
    const newOrderBy = orderBy === 'asc' ? 'desc' : 'asc'
    newHeadCells[index].orderBy = newOrderBy
    setHeadCells(newHeadCells)
    const newQueryParameters = {
      ...staffQueryParameters,
      orderBy: newOrderBy,
      sortBy: newSortBy,
    }
    dispatch(setStaffQueryParameters(newQueryParameters))
  }

  const handleCheckAll = (
    event: ChangeEvent<HTMLInputElement>,
    newListChecked: Array<any>
  ) => {
    setListChecked(newListChecked)
  }

  const handleCheckItem = (id: string) => {
    const newListChecked = [...listChecked]
    const indexById = listChecked.findIndex(_id => _id === id)
    if (indexById !== -1) {
      newListChecked.splice(indexById, 1)
    } else {
      newListChecked.push(id)
    }
    setListChecked(newListChecked)
  }

  return (
    <Box className={classes.rootTableStaffList}>
      <ModalDeleteRecords
        titleMessage="Delete Staff"
        subMessage={`Do you wish to delete Staff ${showModalDeleteStaff.staffCode}?`}
        open={showModalDeleteStaff.status}
        onClose={handleCloseModalDeleteStaff}
        onSubmit={handleSubmitModalDeleteStaff}
      />
      <TableShare
        isShowCheckbox
        keyName={'id'}
        headCells={headCells}
        rows={rows}
        selected={listChecked}
        onSortChange={handleSortChange}
        onSelectAllClick={handleCheckAll}
        childComp={(row: any) => (
          <ItemRowTableV2
            isShowCheckbox
            useRightClickOpenNewTab
            link={StringFormat(PathConstant.STAFF_DETAIL_FORMAT, row.id)}
            selected={listChecked}
            row={row}
            key={`table-checkbox-${row['id']}`}
            uuId={row['id']}
            headCells={headCells}
            keyName={'id'}
            onClickDetail={handleNavigateToDetailPage}
            onClickDelete={handleDeleteStaff}
            onClickItem={handleCheckItem}
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
  rootTableStaffList: {
    marginTop: theme.spacing(4),
  },
}))

TableStaffList.defaultProps = {}

export default TableStaffList
