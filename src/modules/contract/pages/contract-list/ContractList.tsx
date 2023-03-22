import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { CONTRACT_STATUS } from '@/const/app.const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IStatus, TableHeaderOption } from '@/types'
import { formatDate, formatNumberToCurrency } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import i18next from 'i18next'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { IListContractsParams } from '../../models'
import { contractSelector, IContractState } from '../../reducer/contract'
import { getListContracts } from '../../reducer/thunk'
import ContractListActions from './ContractListActions'
import TableContractList from './TableContractList'

const contractListHeadCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_CONTRACT_NUMBER'),
    checked: false,
  },
  {
    id: 'buyer',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_BUYER'),
    checked: false,
  },
  {
    id: 'seller',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_SELLER'),
    checked: false,
  },
  {
    id: 'branch',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_BRANCH'),
    checked: false,
  },
  {
    id: 'contractGroup',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_CONTRACT_GROUP'),
    checked: false,
  },
  {
    id: 'contractType',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_CONTRACT_TYPE'),
    checked: false,
  },
  {
    id: 'contractStartDate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_CONTRACT_START_DATE'),
    useSort: true,
    orderBy: 'desc',
    sortBy: 'startDate',
    checked: false,
  },
  {
    id: 'contractEndDate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_CONTRACT_END_DATE'),
    useSort: true,
    orderBy: 'desc',
    sortBy: 'endDate',
    checked: false,
  },
  {
    id: 'contractSignDate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_CONTRACT_SIGN_DATE'),
    orderBy: 'desc',
    sortBy: 'contractSignDate',
    checked: false,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: i18next.t('common:LB_STATUS'),
    checked: false,
  },
  {
    id: 'value',
    align: 'center',
    disablePadding: true,
    label: i18next.t('common:LB_EXPECTED_VALUE'),
    useSort: true,
    orderBy: 'desc',
    sortBy: 'value',
    checked: false,
  },
  {
    id: 'contactPerson',
    align: 'center',
    disablePadding: true,
    label: i18next.t('contract:LB_CONTACT_PERSON'),
    checked: false,
  },
]

export function convertDataStatus(item: any): IStatus {
  let _resultData = { status: '', label: '' }
  if (CONTRACT_STATUS[item?.id]) {
    return CONTRACT_STATUS[item?.id]
  }
  return _resultData
}
const createData = (item: any) => {
  return {
    contractId: item.contractId || '',
    code: item.contractNumber || '',
    branch: item.branch?.name || '',
    contractGroup: item.group?.name || '',
    contractType: item.type?.name || '',
    contractStartDate:
      item.startDate && item.startDate > 0 ? formatDate(item.startDate) : '',
    contractEndDate:
      item.endDate && item.endDate > 0 ? formatDate(item.endDate) : '',
    status: convertDataStatus(item.status),
    value: item.value ? formatNumberToCurrency(item.value) : '',
    contactPerson: item.contactPerson?.name || '',
    contractSignDate:
      item.signDate && item.signDate > 0 ? formatDate(item.signDate) : '',
    buyer: item.buyer?.name,
    seller: item.seller?.name,
  }
}

const ContractList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)

  const { listContracts, isListFetching }: IContractState =
    useSelector(contractSelector)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { contractQueryParameters }: IContractState =
    useSelector(contractSelector)
  const [headCells, setHeadCells] = useState(() => {
    const newContractListHeadCells = cloneDeep(contractListHeadCells)
    return permissions.usePartnerDelete
      ? contractListHeadCells
      : newContractListHeadCells.splice(0, newContractListHeadCells.length - 1)
  })

  const rows = useMemo(() => {
    return listContracts?.map((item: any) => createData(item)) ?? []
  }, [listContracts])

  const getListContractsApi = (params: IListContractsParams = {}) => {
    const _params = {
      ...params,
    }
    dispatch(getListContracts({ ..._params }))
  }

  useEffect(() => {
    getListContractsApi(contractQueryParameters)
  }, [contractQueryParameters])

  useEffect(() => {
    dispatch(updateLoading(isListFetching))
  }, [isListFetching])

  return (
    <CommonScreenLayout title={i18Contract('TXT_CONTRACT_MANAGEMENT_TITLE')}>
      <Box className={classes.contractContainer}>
        <ContractListActions />
        <TableContractList
          rows={rows}
          headCells={headCells}
          setHeadCells={setHeadCells}
          params={contractQueryParameters}
        />
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  contractContainer: {
    marginTop: theme.spacing(3),
  },
}))

export default ContractList
