import ConditionalRender from '@/components/ConditionalRender'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import { AppDispatch } from '@/store'
import { TableHeaderOption } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import {
  PartnerState,
  selectPartner,
  setPartnerQueryParameters,
} from '../../reducer/partner'
import { ListPartnersParams } from '../../types'

interface TablePartnerListProps {
  params: ListPartnersParams
  listChecked: string[]
  setListChecked: Dispatch<SetStateAction<string[]>>
  onDeletePartner: (idPartner: string) => void
  headCells: TableHeaderOption[]
  setHeadCells: Dispatch<SetStateAction<TableHeaderOption[]>>
  rows: any
}
interface IShowModalDeletePartner {
  status: boolean
  idPartner: string
}

const TablePartnerList = ({
  params,
  listChecked,
  setListChecked,
  onDeletePartner,
  headCells,
  setHeadCells,
  rows,
}: TablePartnerListProps) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { total, partnerQueryParameters }: PartnerState =
    useSelector(selectPartner)

  const [showModalDeletePartner, setShowModalDeletePartner] =
    useState<IShowModalDeletePartner>({
      status: false,
      idPartner: '',
    })

  const handlePageChange = (_: any, newPage: number) => {
    const newQueryParameters = {
      ...partnerQueryParameters,
      pageNum: newPage,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
    setListChecked([])
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10)
    setListChecked([])
    const newQueryParameters = {
      ...partnerQueryParameters,
      pageNum: 1,
      pageSize: newLimit,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
  }

  const handleNavigateToDetailPage = (partnerId: string) => {
    const url = StringFormat(
      PathConstant.CUSTOMER_PARTNER_DETAIL_FORMAT,
      partnerId
    )
    navigate(url)
  }

  const handleDeletePartner = (id: string) => {
    setShowModalDeletePartner({
      status: true,
      idPartner: id,
    })
  }

  const handleCloseModalDeletePartner = () => {
    setShowModalDeletePartner({
      status: false,
      idPartner: '',
    })
  }

  const handleSubmitModalDeletePartner = () => {
    onDeletePartner(showModalDeletePartner.idPartner)
  }

  const handleSortChange = (index: number, orderBy: string | undefined) => {
    const newHeadCells = [...headCells]
    const newSortBy = newHeadCells[index].sortBy
    const newOrderBy = orderBy === 'asc' ? 'desc' : 'asc'
    newHeadCells[index].orderBy = newOrderBy
    setHeadCells(newHeadCells)
    const newQueryParameters = {
      ...partnerQueryParameters,
      orderBy: newOrderBy,
      sortBy: newSortBy,
    }
    dispatch(setPartnerQueryParameters(newQueryParameters))
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
    <Box className={classes.rootTablePartnerList}>
      <ModalDeleteRecords
        titleMessage={i18Customer('TXT_DELETE_PARTNER')}
        subMessage={StringFormat(
          i18Customer('MSG_CONFIRM_PARTNER_DELETE'),
          showModalDeletePartner.idPartner
        )}
        open={showModalDeletePartner.status}
        onClose={handleCloseModalDeletePartner}
        onSubmit={handleSubmitModalDeletePartner}
      />
      <TableShare
        keyName={'id'}
        isShowCheckbox
        headCells={headCells}
        selected={listChecked}
        rows={rows}
        onSelectAllClick={handleCheckAll}
        onSortChange={handleSortChange}
        childComp={(row: any) => (
          <ItemRowTableV2
            isShowCheckbox
            useRightClickOpenNewTab
            link={StringFormat(
              PathConstant.CUSTOMER_PARTNER_DETAIL_FORMAT,
              row.id
            )}
            row={row}
            key={`table-checkbox-${row['id']}`}
            uuId={row['id']}
            headCells={headCells}
            selected={listChecked}
            keyName={'id'}
            onClickItem={handleCheckItem}
            onClickDetail={handleNavigateToDetailPage}
            onClickDelete={handleDeletePartner}
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
  rootTablePartnerList: {
    marginTop: theme.spacing(4),
  },
}))

TablePartnerList.defaultProps = {}

export default TablePartnerList
