import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, CommonState } from '@/reducer/common'
import { updateAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Division, ISkillSet, OptionItem, TableHeaderOption } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import StringFormat from 'string-format'
import {
  deletePartner,
  getListPartners,
  PartnerState,
  selectPartner,
} from '../../reducer/partner'
import { ListPartnersParams } from '../../types'
import { convertDataStatus } from '../customer-list'
import PartnerListActions from './PartnerListActions'
import TablePartnerList from './TablePartnerList'

const partnerListHeadCells: TableHeaderOption[] = [
  {
    id: 'id',
    align: 'left',
    disablePadding: true,
    label: 'Partner Code',
    checked: false,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Partner Name',
    checked: false,
  },
  {
    id: 'abbreviation',
    align: 'left',
    disablePadding: true,
    label: 'Partner Abbreviation',
    checked: false,
  },
  {
    id: 'location',
    align: 'left',
    disablePadding: true,
    label: 'Location',
    checked: false,
  },
  {
    id: 'languageIds',
    align: 'left',
    disablePadding: true,
    label: 'Language',
    checked: false,
  },
  {
    id: 'strength',
    align: 'left',
    disablePadding: true,
    label: 'Strength',
    checked: false,
  },
  {
    id: 'branch',
    align: 'left',
    disablePadding: true,
    label: 'Branch',
    checked: false,
  },
  {
    id: 'divisions',
    align: 'left',
    disablePadding: true,
    label: 'Division',
    checked: false,
  },
  {
    id: 'contactName',
    align: 'left',
    disablePadding: true,
    label: 'Contact Name',
    checked: false,
  },
  {
    id: 'collaborationStartDate',
    align: 'left',
    disablePadding: true,
    label: 'Collaboration Start Date',
    useSort: true,
    orderBy: 'desc',
    sortBy: 'collaborationStartDate',
    checked: false,
  },
  {
    id: 'priority',
    align: 'left',
    disablePadding: true,
    label: 'Priority',
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

const createData = (item: any) => {
  return {
    id: item.id,
    name: item.name,
    strength: item.strengths
      .map((skillSet: ISkillSet) => skillSet.name)
      .join(', '),
    branch: item.branch.name,
    contactName: item.contactName,
    collaborationStartDate: formatDate(item.collaborationStartDate),
    priority: item.priority.id,
    status: convertDataStatus(item.status),
    location: item.location?.name,
    divisions: item.divisions.map((div: Division) => div.name).join(', '),
    languageIds: JSON.parse(item.languageIds || '[]')
      .join(', ')
      .toUpperCase(),
    abbreviation: item.abbreviation,
  }
}

const PartnerList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Customer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { listPartners, isListFetching }: PartnerState =
    useSelector(selectPartner)
  const { permissions }: AuthState = useSelector(selectAuth)
  const { priorities }: CommonState = useSelector(commonSelector)
  const { partnerQueryParameters }: PartnerState = useSelector(selectPartner)
  const [listChecked, setListChecked] = useState<string[]>([])
  const [headCells, setHeadCells] = useState(() => {
    const newPartnerListHeadCells = cloneDeep(partnerListHeadCells)
    return permissions.usePartnerDelete
      ? partnerListHeadCells
      : newPartnerListHeadCells.splice(0, newPartnerListHeadCells.length - 1)
  })

  const rows = useMemo(() => {
    return listPartners?.map((item: any) => createData(item)) ?? []
  }, [listPartners])

  const dataExport = useMemo(() => {
    return rows
      .filter(item => listChecked.includes(item.id))
      .map(item => ({
        ...item,
        priority: priorities.find(
          (priority: OptionItem) => priority.value == item.priority
        )?.label,
        status: item.status.label,
      }))
  }, [rows, listChecked])

  const getListPartnersApi = (params: ListPartnersParams = {}) => {
    const _params = {
      ...params,
    }
    if (_params.skillSetIds?.length) {
      _params.skillSetIds = _params.skillSetIds
        .map((skillSet: any) => skillSet.value)
        .join(',')
    }
    if (_params.languageIds?.length) {
      _params.languageIds = _params.languageIds
        .map((lang: any) => lang.value)
        .join(',')
    }
    if (_params.divisionIds?.length) {
      _params.divisionIds = _params.divisionIds
        .map((division: any) => division.value)
        .join(',')
    }
    dispatch(getListPartners({ ..._params }))
  }

  const onDeleteCustomer = (id: string) => {
    dispatch(updateLoading(true))
    dispatch(deletePartner(id))
      .unwrap()
      .then(() => {
        dispatch(alertActionSuccess(id))
        getListPartnersApi(partnerQueryParameters)
      })
    dispatch(updateLoading(false))
  }

  const handleDeletePartner = (id: string) => {
    onDeleteCustomer(id)
  }

  useEffect(() => {
    getListPartnersApi(partnerQueryParameters)
  }, [partnerQueryParameters])

  useEffect(() => {
    dispatch(updateLoading(isListFetching))
  }, [isListFetching])

  const alertActionSuccess = (id: string) =>
    updateAlert({
      isShowAlert: true,
      alertInfo: {
        type: 'success',
        message: StringFormat(
          i18Customer('MSG_DELETE_PARTNER_ITEM_SUCCESS'),
          id
        ),
      },
    })

  return (
    <CommonScreenLayout title={i18Customer('TXT_PARTNER_MANAGEMENT_TITLE')}>
      <Box className={classes.partnerContainer}>
        <PartnerListActions
          dataExport={dataExport}
          headCells={headCells}
          listChecked={listChecked}
        />
        <TablePartnerList
          rows={rows}
          headCells={headCells}
          setHeadCells={setHeadCells}
          listChecked={listChecked}
          setListChecked={setListChecked}
          params={partnerQueryParameters}
          onDeletePartner={handleDeletePartner}
        />
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootPartnerList: {},
  title: {
    fontSize: 16,
    fontWeight: 700,
    borderBottom: `1px solid ${theme.color.grey.secondary}`,
    width: 'max-content',
    paddingBottom: '28px',
  },
  partnerContainer: {
    marginTop: theme.spacing(3),
  },
}))

export default PartnerList
