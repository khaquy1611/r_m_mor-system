import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { AuthState, selectAuth } from '@/reducer/auth'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem, TableHeaderOption } from '@/types'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { STAFF_STATUS, STAFF_STEP } from '../../const'
import {
  resetFormStaff,
  setActiveStep,
  staffSelector,
} from '../../reducer/staff'
import { deleteStaff, getListStaff } from '../../reducer/thunk'
import { StaffState } from '../../types'
import { ListStaffParams } from '../../types/staff-list'
import StaffListActions from './StaffListActions'
import TableStaffList from './TableStaffList'

const staffListHeadCells: TableHeaderOption[] = [
  {
    id: 'code',
    align: 'left',
    disablePadding: true,
    label: 'Staff Code',
    checked: false,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Staff Name',
    checked: false,
  },
  {
    id: 'gender',
    align: 'left',
    disablePadding: true,
    label: 'Gender',
    checked: false,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: true,
    label: 'Email',
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
    id: 'division',
    align: 'left',
    disablePadding: true,
    label: 'Division',
    checked: false,
  },
  {
    id: 'onboardDate',
    align: 'left',
    disablePadding: true,
    label: 'Onboard Date',
    useSort: true,
    orderBy: 'desc',
    sortBy: 'onboardDate',
    checked: false,
  },
  {
    id: 'position',
    align: 'left',
    disablePadding: true,
    label: 'Position',
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

const convertStaffStatus = (status: any) => {
  if (STAFF_STATUS[status?.id]) {
    return STAFF_STATUS[status?.id]
  }
  return {
    status: '',
    label: '',
  }
}

const createData = (item: any) => {
  return {
    id: item.id.toString(),
    code: item.code,
    name: item.name,
    gender: item.gender?.name,
    email: item.email,
    branch: item.branch?.name,
    division: item.division?.name,
    onboardDate: item.onboardDate ? formatDate(item.onboardDate) : '',
    position: item.position?.name,
    status: convertStaffStatus(item.status),
  }
}

const StaffManagementList = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const { permissions }: AuthState = useSelector(selectAuth)
  const { staffList, isListFetching, staffQueryParameters }: StaffState =
    useSelector(staffSelector)

  const [listChecked, setListChecked] = useState<string[]>([])
  const [headCells, setHeadCells] = useState(() => {
    const newStaffListHeadCells = cloneDeep(staffListHeadCells)
    return permissions.usePartnerDelete
      ? staffListHeadCells
      : newStaffListHeadCells.splice(0, newStaffListHeadCells.length - 1)
  })

  const rows = useMemo(() => {
    return staffList?.map((item: any) => createData(item)) ?? []
  }, [staffList])

  const dataExport = useMemo(() => {
    return rows
      .filter(item => listChecked.includes(item.id))
      .map(item => ({
        ...item,
        status: item.status.label,
      }))
  }, [rows, listChecked])

  const getListStaffApi = (params: ListStaffParams) => {
    const _params = {
      ...params,
      divisionIds: !!params.divisionIds?.length
        ? params.divisionIds?.map((item: OptionItem) => item.id).join(',')
        : null,
      skillsId: !!params.skillsId?.length
        ? params.skillsId.map((skillSet: any) => skillSet.value).join(',')
        : null,
      positionIds: !!params.positionIds?.length
        ? params.positionIds
            .map((position: OptionItem) => position.value)
            .join(',')
        : null,
    }
    dispatch(getListStaff({ ..._params }))
  }

  const handleDeleteStaff = (id: string, code: string) => {
    dispatch(updateLoading(true))
    dispatch(deleteStaff({ id, code }))
      .unwrap()
      .then(() => {
        getListStaffApi(staffQueryParameters)
      })
    dispatch(updateLoading(false))
  }

  useEffect(() => {
    getListStaffApi(staffQueryParameters)
    // Reset detail staff and init staff step
    dispatch(resetFormStaff({}))
    dispatch(setActiveStep(STAFF_STEP.GENERAL_INFORMATION))
  }, [staffQueryParameters])

  useEffect(() => {
    dispatch(updateLoading(isListFetching))
  }, [isListFetching])

  return (
    <CommonScreenLayout title="Staff Management List">
      <Box className={classes.partnerContainer}>
        <StaffListActions
          dataExport={dataExport}
          headCells={headCells}
          listChecked={listChecked}
        />
        <TableStaffList
          rows={rows}
          headCells={headCells}
          setHeadCells={setHeadCells}
          listChecked={listChecked}
          setListChecked={setListChecked}
          params={staffQueryParameters}
          onDeleteStaff={handleDeleteStaff}
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

export default StaffManagementList
