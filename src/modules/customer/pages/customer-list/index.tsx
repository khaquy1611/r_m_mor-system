import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, PathConstant, TableConstant } from '@/const'
import {
  CustomerState,
  deleteCustomers,
  getListCustomers,
  selectCustomer,
  setQueryParameters,
} from '@/modules/customer/reducer/customer'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import moment from 'moment'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import StringFormat from 'string-format'
import { IListCustomersParams } from '../../types'

import { CUSTOMER_STATUS } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, CommonState } from '@/reducer/common'
import { Division, IStatus, OptionItem } from '@/types'
import { cloneDeep } from 'lodash'
import HeaderCustomer from './HeaderCustomer'
import { customerListHeadCells } from './instance'
import { convertKeyArrayToString } from '@/utils'

export interface DataTableCustomer {
  id: string
  customerName: string
  service: string
  contactName: string
  collaborationStartDate: string
  priority: string
  branch: string
  status: IStatus
  market: string
  divisions: string
  languageIds: string
  abbreviation: string
}

interface IShowModalDeleteCustomer {
  status: boolean
  idCustomer: string
}

interface IServiceItem {
  skillSetId?: number
  skillSetGroupId?: number
  name: string
  note?: string
}

export function convertDataStatus(item: any): IStatus {
  let _resultData = { status: '', label: '' }
  if (CUSTOMER_STATUS[item?.id]) {
    return CUSTOMER_STATUS[item?.id]
  }
  return _resultData
}
export function createData(item: any): DataTableCustomer {
  return {
    id: item.id,
    priority: item.priority?.id,
    status: convertDataStatus(item?.status),
    service: convertKeyArrayToString(item?.services),
    contactName: item.contactName,
    collaborationStartDate: moment(item.collaborationStartDate).format(
      'DD/MM/YYYY'
    ),
    customerName: item?.name,
    branch: item?.branch?.name,
    market: item.market?.name,
    divisions: item.divisions.map((div: Division) => div.name).join(', '),
    languageIds: JSON.parse(item.languageIds || '[]')
      .join(', ')
      .toUpperCase(),
    abbreviation: item.abbreviation,
  }
}

const CustomerList = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { customerList, isListFetching, queryParameters }: CustomerState =
    useSelector(selectCustomer)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { priorities }: CommonState = useSelector(commonSelector)

  const [listChecked, setListChecked] = useState<string[]>([])
  const [rows, setRows] = useState<Array<any>>([])
  const [showModalDeleteCustomers, setShowModalDeleteCustomers] =
    useState<IShowModalDeleteCustomer>({ status: false, idCustomer: '' })

  const [headCells, setHeadCells] = useState(() => {
    const newCustomerListHeadCells = cloneDeep(customerListHeadCells)
    return permissions.useCustomerDelete
      ? customerListHeadCells
      : newCustomerListHeadCells.splice(0, newCustomerListHeadCells.length - 1)
  })

  const dataExport = useMemo(() => {
    return rows
      .filter(item => listChecked.includes(item.id))
      .map(item => ({
        ...item,
        status: item.status.label,
        priority: priorities.find(
          (priority: OptionItem) => priority.value == item.priority
        )?.label,
      }))
  }, [rows, listChecked, priorities])

  const getListCustomersApi = (params = {}) => {
    const _params: IListCustomersParams = {
      ...params,
    }
    if (_params.skillSetIds?.length) {
      _params.skillSetIds = _params.skillSetIds
        .map((skillSet: any) => skillSet.value)
        .join(',')
    }
    if (_params.languageIds?.length) {
      _params.languageIds = _params.languageIds
        .map((lang: OptionItem) => lang.id)
        .join(',')
    }
    if (_params.divisionIds?.length) {
      _params.divisionIds = _params.divisionIds
        .map((division: OptionItem) => division.id)
        .join(',')
    }
    dispatch(getListCustomers({ ..._params }))
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    const newQueryParameters = {
      ...queryParameters,
      pageNum: +newPage,
    }
    setListChecked([])
    dispatch(setQueryParameters(newQueryParameters))
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    const newQueryParameters = {
      ...queryParameters,
      pageNum: 1,
      pageSize: +event.target.value,
    }
    dispatch(setQueryParameters(newQueryParameters))
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

  const handleClickDetail = (id: string) => {
    navigate(`${PathConstant.CUSTOMER_LIST}/${id}`)
  }

  const onDeleteCustomer = () => {
    dispatch(updateLoading(true))
    dispatch(deleteCustomers(showModalDeleteCustomers.idCustomer))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: StringFormat(
              i18Customer('MSG_DELETE_CUSTOMER_ITEM_SUCCESS'),
              showModalDeleteCustomers.idCustomer
            ),
          })
        )
        getListCustomersApi(queryParameters)
      })
    dispatch(updateLoading(false))
  }

  const handleCloseModalDeleteCustomers = () => {
    setShowModalDeleteCustomers({ status: false, idCustomer: '' })
  }

  const handleSubmitModalDeleteCustomers = () => {
    onDeleteCustomer()
  }

  const handleDeleteCustomer = async (customerId: string) => {
    setShowModalDeleteCustomers({ status: true, idCustomer: customerId })
  }

  const handleSortChange = (index: number, orderBy: string | undefined) => {
    const newHeadCells = [...headCells]
    const newSortBy = newHeadCells[index].sortBy
    const newOrderBy = orderBy === 'asc' ? 'desc' : 'asc'
    newHeadCells[index].orderBy = newOrderBy
    setHeadCells(newHeadCells)
    const newQueryParameters = {
      ...queryParameters,
      orderBy: newOrderBy,
      sortBy: newSortBy,
    }
    dispatch(setQueryParameters(newQueryParameters))
  }

  useEffect(() => {
    getListCustomersApi(queryParameters)
  }, [queryParameters])

  useEffect(() => {
    if (customerList?.content) {
      setRows(customerList.content.map((item: any) => createData(item)))
    }
  }, [customerList?.content])

  useEffect(() => {
    dispatch(updateLoading(isListFetching))
  }, [isListFetching])

  return (
    <CommonScreenLayout title={i18Customer('TXT_CUSTOMER_MANAGEMENT_TITLE')}>
      <ModalDeleteRecords
        titleMessage={i18Customer('TXT_DELETE_CUSTOMER')}
        subMessage={StringFormat(
          i18Customer('MSG_CONFIRM_CUSTOMER_DELETE'),
          showModalDeleteCustomers.idCustomer
        )}
        open={showModalDeleteCustomers.status}
        onClose={handleCloseModalDeleteCustomers}
        onSubmit={handleSubmitModalDeleteCustomers}
      />
      <Box className={classes.rootCustomerList}>
        <HeaderCustomer listChecked={listChecked} dataExport={dataExport} />
        <TableShare
          isShowCheckbox
          keyName={'id'}
          headCells={headCells}
          rows={rows}
          limitPage={queryParameters.pageSize}
          pageCurrent={queryParameters.pageNum}
          selected={listChecked}
          onSortChange={handleSortChange}
          childComp={(row: any) => (
            <ItemRowTableV2
              isShowCheckbox
              useRightClickOpenNewTab
              link={StringFormat(PathConstant.CUSTOMER_DETAIL_FORMAT, row.id)}
              row={row}
              key={`table-checkbox-${row['id']}`}
              uuId={row['id']}
              selected={listChecked}
              headCells={headCells}
              keyName={'id'}
              onClickItem={handleCheckItem}
              onClickDelete={handleDeleteCustomer}
              onClickDetail={handleClickDetail}
            />
          )}
          onSelectAllClick={handleCheckAll}
        />
        <ConditionalRender conditional={!!rows.length} fallback={''}>
          <TablePaginationShare
            rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
            totalElements={customerList?.totalElements}
            pageLimit={queryParameters.pageSize as number}
            currentPage={queryParameters.pageNum as number}
            onChangePage={handleChangePage}
            onChangeLimitPage={handleChangeRowsPerPage}
          />
        </ConditionalRender>
      </Box>
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootCustomerList: {
    width: '100%',
    marginBottom: '10px',
  },
}))
export default CustomerList
