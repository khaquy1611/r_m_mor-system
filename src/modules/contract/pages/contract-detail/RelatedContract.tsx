import { LangConstant, TableConstant } from '@/const'
import { CONTRACT_STATUS } from '@/const/app.const'
import { IStatus, TableHeaderOption } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { contractSelector, IContractState } from '../../reducer/contract'
import CardForm from '@/components/Form/CardForm'
import i18next from '@/languages'
import TableContractRelated from '../contract-list/TableContractRelated'

const contractListHeadCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: i18next.t('common:LB_CONTRACT_NUMBER'),
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
    orderBy: 'desc',
    sortBy: 'startDate',
    checked: false,
  },
  {
    id: 'contractEndDate',
    align: 'left',
    disablePadding: true,
    label: i18next.t('contract:LB_CONTRACT_END_DATE'),
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
    label: 'Status',
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
    contractId: item.id || '',
    code: item.contractNumber || '',
    contractGroup: item.group?.name || '',
    contractType: item.type?.name || '',
    contractStartDate:
      item.startDate && item.startDate > 0 ? formatDate(item.startDate) : '',
    contractEndDate:
      item.endDate && item.endDate > 0 ? formatDate(item.endDate) : '',
    status: convertDataStatus(item.status),
    contractSignDate:
      item.signDate && item.signDate > 0 ? formatDate(item.signDate) : '',
  }
}

const RelatedContract = () => {
  const classes = useStyles()
  const { t: i18Contract } = useTranslation(LangConstant.NS_CONTRACT)
  const { relatedContracts }: IContractState = useSelector(contractSelector)
  const [pageSize, setPageSize] = useState(TableConstant.LIMIT_DEFAULT)
  const [pageNum, setPageNum] = useState(1)

  const rows = useMemo(() => {
    let _listRows = relatedContracts?.map((item: any) => createData(item)) ?? []
    return _listRows.slice(
      (pageNum - 1) * pageSize,
      (pageNum - 1) * pageSize + pageSize
    )
  }, [relatedContracts, pageNum, pageSize])

  return (
    <CardForm title={i18Contract('TXT_RELATED_CONTRACT')}>
      <Box className={classes.contractContainer}>
        <TableContractRelated
          rows={rows}
          headCells={contractListHeadCells}
          setPageSize={setPageSize}
          pageNum={pageNum}
          pageSize={pageSize}
          setPageNum={setPageNum}
        />
      </Box>
    </CardForm>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootContractList: {},
  rootContractGeneralInformation: {},
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

export default RelatedContract
