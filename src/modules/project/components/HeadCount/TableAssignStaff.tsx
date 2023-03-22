import ButtonAddPlus from '@/components/buttons/ButtonAddPlus'
import ConditionalRender from '@/components/ConditionalRender'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import { IAssignStaffState } from '@/modules/project/types'
import { AuthState, selectAuth } from '@/reducer/auth'
import { alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IAction, Pagination, TableHeaderOption } from '@/types'
import {
  formatDate,
  formatNumberToCurrency,
  getTextEllipsis,
  uuid,
} from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { projectSelector, setAssignStaff } from '../../reducer/project'
import {
  createProjectStaffHeadcount,
  deleteProjectStaffHeadcount,
  getProjectHeadcount,
  getProjectStaffHeadcount,
  updateProjectStaffHeadcount,
} from '../../reducer/thunk'
import { convertPayloadAssignStaff } from '../../utils'
import ModalAddAssignStaff from '../ModalAddAssignStaff'

export interface IStaff extends IAssignStaffState {
  action?: IAction[]
}

interface PopupConfirmDeleteState {
  status: boolean
  id: string
  code: string
}

interface IProps {
  staffSelected: any
  setStaffSelected: Dispatch<SetStateAction<any>>
  openModalAddAssignStaff: boolean
  setOpenModalAddAssignStaff: Dispatch<SetStateAction<boolean>>
  flagTriggerGetListStaff: boolean
  setFlagTriggerGetListStaff: Dispatch<SetStateAction<boolean>>
  query: Pagination
  setQuery: Dispatch<SetStateAction<Pagination>>
}

const createData = (item: any): IStaff => {
  return {
    id: !!item.id ? item.id : uuid(),
    staffId: item.staffId,
    staffCode: item.staffCode ?? '',
    staffName: item.staffName,
    branch: item.branch,
    division: item.division,
    position: item.position,
    assignStartDate: !!item.assignStartDate
      ? new Date(item.assignStartDate)
      : null,
    assignEndDate: !!item.assignEndDate ? new Date(item.assignEndDate) : null,
    projectHeadcount: item?.projectHeadcount ?? '',
    role: item.role ?? '',
    action: [{ type: 'delete' }],
  }
}

const TableAssignStaff = ({
  staffSelected,
  setStaffSelected,
  openModalAddAssignStaff,
  setOpenModalAddAssignStaff,
  flagTriggerGetListStaff,
  setFlagTriggerGetListStaff,
  query,
  setQuery,
}: IProps) => {
  //const
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const paramUrl = useParams()

  const { assignStaffs, generalInfo, totalStaffAssignment } =
    useSelector(projectSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const { startDate, endDate } = generalInfo

  //State
  const [isAssignNewStaff, setIsAssignNewStaff] = useState(false)
  const [rows, setRows] = useState<IStaff[]>(assignStaffs)
  const [openPopupConfirmDelete, setOpenPopupConfirmDelete] =
    useState<PopupConfirmDeleteState>({
      status: false,
      id: '',
      code: '',
    })

  const isViewDetail = useMemo(() => {
    return !!paramUrl?.projectId
  }, [])

  const formDisabled = useMemo(() => {
    if (!isViewDetail) return false
    return !permissions.useProjectUpdateHeadcountInfo
  }, [permissions.useProjectUpdateHeadcountInfo])

  const _headerConfig: TableHeaderOption[] = useMemo(() => {
    const headCells: TableHeaderOption[] = [
      {
        id: 'staffCode',
        align: 'left',
        disablePadding: true,
        label: 'Staff Code',
        render: (value: any) => (
          <Box className={classes.firstItem} title={value}>
            {value ? getTextEllipsis(value) : ''}
          </Box>
        ),
      },
      {
        id: 'staffName',
        align: 'left',
        disablePadding: true,
        label: 'Staff Name',
      },
      {
        id: 'branch',
        align: 'left',
        disablePadding: true,
        label: 'Branch',
        render: (value: any) => (
          <Box title={value?.name}>
            {value?.name ? getTextEllipsis(value?.name) : ''}
          </Box>
        ),
      },
      {
        id: 'division',
        align: 'left',
        disablePadding: true,
        label: 'Division',
        render: (value: any) => (
          <Box title={value?.name ?? ''}>
            {value?.name ? getTextEllipsis(value?.name) : ''}
          </Box>
        ),
      },
      {
        id: 'assignStartDate',
        align: 'left',
        disablePadding: true,
        label: 'Assign Start Date',
        render: (value: any) => <Box>{!!value ? formatDate(value) : ''}</Box>,
      },
      {
        id: 'assignEndDate',
        align: 'left',
        disablePadding: true,
        label: 'Assign End Date',
        render: (value: any) => <Box>{!!value ? formatDate(value) : ''}</Box>,
      },
      {
        id: 'projectHeadcount',
        align: 'left',
        disablePadding: true,
        label: 'Assign Effort',
        render: (value: any) => (
          <Box
            className={classes.tableCell}
            title={`${!!value ? formatNumberToCurrency(value) : 0}%`}
          >{`${!!value ? formatNumberToCurrency(value) : 0}%`}</Box>
        ),
      },
      {
        id: 'role',
        align: 'left',
        disablePadding: true,
        label: 'Role',
        render: (value: any) => (
          <Box className={classes.tableCell} title={value}>
            {getTextEllipsis(value.toString())}
          </Box>
        ),
      },
      {
        id: 'action',
        align: 'center',
        disablePadding: true,
        label: 'Action',
      },
    ]
    return !formDisabled ? headCells : headCells.slice(0, -1)
  }, [formDisabled])

  const getListAssignHeadcount = (paginate: Pagination) => {
    const _payload = {
      projectId: paramUrl?.projectId ?? '',
      params: {
        ...paginate,
      },
    }
    dispatch(updateLoading(true))
    dispatch(getProjectStaffHeadcount(_payload))
      .unwrap()
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }

  const refreshStaffs = () => {
    getListAssignHeadcount(query)
    setOpenModalAddAssignStaff(false)
    setOpenPopupConfirmDelete({ status: false, id: '', code: '' })
    setFlagTriggerGetListStaff(!flagTriggerGetListStaff)
    dispatch(getProjectHeadcount(paramUrl.projectId as string))
  }

  const handleShowMessageUpdateSuccess = () => {
    dispatch(
      alertSuccess({
        message: i18Project('MSG_UPDATE_PROJECT_STAFF_HEADCOUNT_SUCCESS', {
          id: staffSelected.staffCode || '',
        }),
      })
    )
  }

  const handleShowMessageDeleteSuccess = () => {
    dispatch(
      alertSuccess({
        message: i18Project('MSG_DELETE_PROJECT_STAFF_HEADCOUNT_SUCCESS', {
          id: openPopupConfirmDelete.code || '',
        }),
      })
    )
  }

  const handleDeleteStaff = (id: string, staff: IStaff) => {
    setOpenPopupConfirmDelete({
      status: true,
      id: staff.id ?? '',
      code: staff.staffCode ?? '',
    })
  }

  const handleDeleteStaffHeadcount = () => {
    if (openPopupConfirmDelete.id) {
      if (isViewDetail) {
        dispatch(
          deleteProjectStaffHeadcount({
            projectId: paramUrl?.projectId ?? '',
            id: openPopupConfirmDelete.id ?? '',
          })
        )
          .unwrap()
          .then(() => {
            handleShowMessageDeleteSuccess()
            refreshStaffs()
          })
      } else {
        let newStaff: any[] = []
        const indexStaff = rows.findIndex(
          (item: any) => item.id === openPopupConfirmDelete.id
        )
        if (indexStaff > -1) {
          rows.splice(indexStaff, 1)
          newStaff = cloneDeep(rows)
          dispatch(setAssignStaff(newStaff))
          handleShowMessageDeleteSuccess()
        }
      }
    }
  }

  const handleClickDetail = (id: string) => {
    const itemSelected = assignStaffs.find((row: IStaff) => row.id === id)
    if (!!itemSelected) {
      setStaffSelected(itemSelected)
      setOpenModalAddAssignStaff(true)
      setIsAssignNewStaff(false)
    }
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setQuery((prev: Pagination) => ({
      ...prev,
      pageNum: newPage,
    }))
    getListAssignHeadcount({
      ...query,
      pageNum: newPage,
    })
  }
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery((prev: Pagination) => ({
      ...prev,
      pageNum: 1,
      pageSize: +event.target.value,
    }))
    getListAssignHeadcount({
      pageNum: 1,
      pageSize: +event.target.value,
    })
  }

  const handleCreateProjectAssignStaff = (data: any) => {
    const _payload = {
      projectId: paramUrl?.projectId ?? '',
      data,
    }
    dispatch(createProjectStaffHeadcount(_payload))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18Project('MSG_CREATE_PROJECT_STAFF_HEADCOUNT_SUCCESS'),
          })
        )
        refreshStaffs()
      })
  }

  const handleAddStaff = (data: any) => {
    if (isViewDetail) {
      handleCreateProjectAssignStaff(convertPayloadAssignStaff(data))
    } else {
      const _rows = cloneDeep(rows)
      _rows.push(createData(data))
      setRows(_rows)
      dispatch(setAssignStaff(_rows))
      setOpenModalAddAssignStaff(false)
    }
  }

  const handleUpdateStaff = (data: any) => {
    if (isViewDetail) {
      dispatch(
        updateProjectStaffHeadcount({
          projectId: paramUrl?.projectId ?? '',
          id: data?.id ?? '',
          data: convertPayloadAssignStaff(data),
        })
      )
        .unwrap()
        .then(() => {
          handleShowMessageUpdateSuccess()
          refreshStaffs()
        })
    } else {
      const _rows = cloneDeep(assignStaffs)
      const indexStaffChanged = _rows.findIndex(
        (row: IStaff) => row?.id === data?.id
      )
      if (indexStaffChanged > -1) {
        _rows.splice(indexStaffChanged, 1, data)
        dispatch(setAssignStaff(_rows))
        setOpenModalAddAssignStaff(false)
      }
    }
  }

  const checkErrorRow = (row: any) => {
    const isErrorStartDate = moment(row.assignStartDate).isBefore(
      startDate,
      'day'
    )
    const isErrorEndDate = moment(row.assignEndDate).isAfter(endDate, 'day')
    return isErrorEndDate || isErrorStartDate
  }

  const handleOpenModalNewAssignStaff = () => {
    setOpenModalAddAssignStaff(true)
    setIsAssignNewStaff(true)
  }

  const handleSubmit = (assignStaff: any, isAssignNewStaff: boolean) => {
    if (isAssignNewStaff) {
      handleAddStaff(assignStaff)
    } else {
      handleUpdateStaff(assignStaff)
    }
  }

  useEffect(() => {
    const _rows = assignStaffs.map(createData)
    setRows(_rows)
  }, [assignStaffs])

  useEffect(() => {
    if (isViewDetail && !assignStaffs.length) {
      getListAssignHeadcount(query)
    }
  }, [query])

  return (
    <Box>
      <TableShare
        keyName={'id'}
        headCells={_headerConfig}
        rows={rows}
        isShowCheckbox={false}
        childComp={(row: any) => (
          <ItemRowTableV2
            row={row}
            key={`table-checkbox-${row['id']}`}
            isShowCheckbox={false}
            uuId={row['id']}
            headCells={_headerConfig}
            keyName={'id'}
            onClickItem={() => {}}
            onClickDelete={handleDeleteStaff}
            onClickDetail={handleClickDetail}
            rowClassName={checkErrorRow(row) ? classes.rowError : ''}
          />
        )}
      />

      <Box className={classes.footer}>
        <Box
          sx={{
            marginTop: rows.length === 0 ? '24px' : 0,
          }}
        >
          {!formDisabled && (
            <ButtonAddPlus
              label={i18Project('LB_ASSIGN_NEW_STAFF')}
              onClick={handleOpenModalNewAssignStaff}
            />
          )}
        </Box>
        <ConditionalRender conditional={!!rows.length}>
          <TablePaginationShare
            rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
            totalElements={totalStaffAssignment}
            pageLimit={query.pageSize}
            currentPage={query.pageNum}
            onChangePage={handleChangePage}
            onChangeLimitPage={handleChangeRowsPerPage}
          />
        </ConditionalRender>
      </Box>

      {openModalAddAssignStaff && (
        <ModalAddAssignStaff
          open
          disabled={formDisabled}
          isAssignNewStaff={isAssignNewStaff}
          flagTriggerGetListStaff={flagTriggerGetListStaff}
          isProjectDetail={isViewDetail}
          dataStaff={staffSelected}
          onCloseModal={() => setOpenModalAddAssignStaff(false)}
          onSubmit={handleSubmit}
        />
      )}

      <ModalDeleteRecords
        titleMessage={i18Project('TXT_DELETE_PROJECT_ASSIGN_STAFF')}
        subMessage={i18Project('MSG_DELETE_STAFF_EFFORT', {
          code: openPopupConfirmDelete.code,
        })}
        open={openPopupConfirmDelete.status}
        onClose={() =>
          setOpenPopupConfirmDelete({ status: false, id: '', code: '' })
        }
        onSubmit={handleDeleteStaffHeadcount}
      />
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootProjectList: {
    width: '100%',
  },
  headerFilter: {
    display: 'flex',
    gap: '12px',
    paddingBottom: theme.spacing(1),
    '& [data-title ="btn-add"]': {
      height: theme.spacing(5),
    },
  },
  tableCell: {
    width: 'max-content',
  },
  firstItem: {
    color: theme.color.blue.primary,
  },
  rowError: {
    backgroundColor: theme.color.error.tertiary,

    '&:hover': {
      backgroundColor: `${theme.color.error.tertiary} !important`,
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

export default TableAssignStaff
