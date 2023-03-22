import CommonButton from '@/components/buttons/CommonButton'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import ItemRowTableV2 from '@/components/table/ItemRowTableV2'
import TablePaginationShare from '@/components/table/TablePaginationShare'
import TableShare from '@/components/table/TableShare'
import { LangConstant, TableConstant } from '@/const'
import ModalAddCost, {
  IProjectCost,
} from '@/modules/project/components/ModalAddCost'
import ProjectStepAction from '@/modules/project/components/ProjectStep/ProjectStepAction'
import { CONFIG_PROJECT_STEPS } from '@/modules/project/const'
import {
  projectSelector,
  setProjectCost,
} from '@/modules/project/reducer/project'
import {
  createProjectCost,
  deleteProjectCost,
  getProjectCosts,
  updateProjectCost,
} from '@/modules/project/reducer/thunk'
import { IListProjectsParams, ProjectState } from '@/modules/project/types'
import { convertPayloadCost } from '@/modules/project/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, CommonState, getCurrencies } from '@/reducer/common'
import { alertSuccess, updateAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { formatNumber, uuid } from '@/utils'
import { Box, Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import { headCellProjectCost } from '../../project-list/instance'
import ItemRowCellEnd from './ItemRowCellEnd'

interface IProps {
  onSubmit: () => void
}
interface IShowModalDeleteCost {
  status: boolean
  projectId: string
  ids: string
  code: string
}
const Cost = ({ onSubmit }: IProps) => {
  //const
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const { projectId } = useParams()
  const {
    activeStep,
    projectCosts,
    totalProjectCost,
    totalMoneyCost,
  }: ProjectState = useSelector(projectSelector)
  const { listCurrency }: CommonState = useSelector(commonSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  const isViewDetail = useMemo(() => {
    return !!projectId
  }, [projectId])
  //State
  const [params, setParams] = useState<IListProjectsParams>({
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
  })
  const [rows, setRows] = useState<any[]>([])
  const [page, setPage] = useState(TableConstant.PAGE_CURRENT_DEFAULT)
  const [pageLimit, setPageLimit] = useState(TableConstant.LIMIT_DEFAULT)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [idDetail, setIdDetail] = useState('')
  const [isUpdate, setIsUpdate] = useState(false)
  const [showModalDeleteProject, setShowModalDeleteProject] =
    useState<IShowModalDeleteCost>({
      status: false,
      projectId: '',
      ids: '',
      code: '',
    })
  const [idDelete, setIdDelete] = useState('')
  const [code, setCode] = useState('')

  //Effect
  useEffect(() => {
    if (isViewDetail) {
      dispatch(getProjectCosts({ projectId, params }))
    }
  }, [isViewDetail, params, projectId])

  useEffect(() => {
    if (projectCosts) {
      setRows(projectCosts)
    }
  }, [projectCosts])

  //Memo
  const headCells = useMemo(() => {
    const _headCellProjectCost = cloneDeep(headCellProjectCost)
    return permissions.useProjectUpdateCostInfo
      ? _headCellProjectCost
      : _headCellProjectCost.slice(0, -1)
  }, [headCellProjectCost, permissions.useProjectUpdateCostInfo])

  const totalCost = useMemo(() => {
    let _totalCost = 0
    rows.forEach((item: any) => {
      _totalCost = _totalCost + Number(item?.cost) * Number(item?.rate)
    })
    return _totalCost
  }, [rows])

  const rowsPageCurrent = useMemo(() => {
    let rowsPage = cloneDeep(rows)
    let _rowsPage = rowsPage.map((item: any, index: number) => ({
      ...item,
      no: isViewDetail ? item.id : index + 1,
      cost: formatNumber(item.cost),
      rate: formatNumber(item.rate),
      currency:
        item.currency.label ||
        listCurrency.find(cur => cur.id == item.currency.value)?.code ||
        '',
      source: item?.source.label,
      costOrigin: item?.costOrigin.label,
      date: moment(item.date).format('MM/YYYY'),
    }))
    if (!isViewDetail) {
      _rowsPage = _rowsPage.slice(
        (page - 1) * pageLimit,
        (page - 1) * pageLimit + pageLimit
      )
    }
    return _rowsPage
  }, [rows, page, pageLimit])

  // Function
  const handleClick = () => {}
  const handleClickDetail = (id: string, row: any) => {
    setIsUpdate(true)
    setIdDetail(id)
    setIsOpenModal(!isOpenModal)
    setCode(row.no)
  }
  const handleChangePage = (_: unknown, newPage: number) => {
    setParams((prev: any) => ({
      ...prev,
      pageNum: Number(newPage),
    }))
    setPage(newPage)
  }
  const alertActionUpdateSuccess = updateAlert({
    isShowAlert: true,
    alertInfo: {
      type: 'success',
      message: StringFormat(i18Project('MSG_UPDATE_COST'), idDetail),
    },
  })
  const alertActionDeleteSuccess = updateAlert({
    isShowAlert: true,
    alertInfo: {
      type: 'success',
      message: StringFormat(
        i18Project('MSG_DELETE_PROJECT_COST_SUCCESS'),
        showModalDeleteProject.code
      ),
    },
  })
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setPageLimit(parseInt(event.target.value, 10))
    setParams((prev: any) => ({
      ...prev,
      pageNum: 1,
      pageSize: parseInt(event.target.value, 10),
    }))
  }

  const handleAddCost = () => {
    setIsUpdate(false)
    setIsOpenModal(!isOpenModal)
  }

  const setOpenModal = () => {
    setIsOpenModal(!isOpenModal)
  }
  const handleAddNewCost = (value: any) => {
    const newData = convertData(value)
    if (isViewDetail) {
      dispatch(
        createProjectCost({
          projectId,
          data: convertPayloadCost(newData),
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getProjectCosts({ projectId, params }))
          setIsOpenModal(!isOpenModal)
        })
    } else {
      setIsOpenModal(!isOpenModal)
      dispatch(setProjectCost([newData, ...rows]))
      dispatch(
        alertSuccess({
          message: i18Project('MSG_CREATE_PROJECT_COST_SUCCESS', {
            projectId: '',
          }),
        })
      )
    }
  }
  const handleUpdateCost = (value: any, id: string | undefined) => {
    const newData = convertData(value)
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(
        updateProjectCost({
          projectId,
          id,
          data: convertPayloadCost(newData),
        })
      )
        .unwrap()
        .then(() => {
          dispatch(alertActionUpdateSuccess)
          dispatch(getProjectCosts({ projectId, params }))
          setIsOpenModal(!isOpenModal)
        })
      dispatch(updateLoading(false))
    } else {
      let newCost: any[] = []
      const indexCost = rows.findIndex((item: any) => item.id === id)
      if (indexCost > -1) {
        newCost = cloneDeep(rows)
        newCost[indexCost] = newData
        dispatch(setProjectCost(newCost))
        dispatch(
          alertSuccess({
            message: StringFormat(i18Project('MSG_UPDATE_COST'), code),
          })
        )
      }
      setIsOpenModal(!isOpenModal)
    }
  }

  const handleCloseModal = () => {
    setIsOpenModal(!isOpenModal)
  }

  const handleDeleteItem = (id: string, row: any) => {
    setShowModalDeleteProject({
      status: true,
      projectId: projectId ? projectId : '',
      ids: id,
      code: row.no.toString(),
    })
    setIdDelete(id)
  }

  const handleCloseModalDeleteCost = () => {
    setShowModalDeleteProject({
      status: false,
      projectId: '',
      ids: '',
      code: '',
    })
  }

  const handleSubmitModalDeleteCost = () => {
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(
        deleteProjectCost({
          projectId: showModalDeleteProject.projectId,
          ids: showModalDeleteProject.ids,
          code: showModalDeleteProject.code,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getProjectCosts({ projectId, params }))
          dispatch(alertActionDeleteSuccess)
          setShowModalDeleteProject({
            status: false,
            projectId: '',
            ids: '',
            code: '',
          })
        })
      dispatch(updateLoading(false))
    } else {
      deleteCostModeCreate()
    }
  }
  const deleteCostModeCreate = () => {
    let newCost: any[] = []
    const indexCost = rows.findIndex(
      (item: any) => item.id === showModalDeleteProject.ids
    )
    if (indexCost > -1) {
      newCost = cloneDeep(rows)
      newCost.splice(indexCost, 1)
      dispatch(setProjectCost(newCost))
      dispatch(alertActionDeleteSuccess)
    }
  }
  const handleNext = () => {
    onSubmit()
  }

  const convertData = (value: IProjectCost) => ({
    id: uuid(),
    no: 0,
    costOrigin: value?.costOrigin,
    date: value.date,
    rate: value?.rate,
    source: value.source,
    currency: value.currency,
    cost: value?.cost,
    note: value.note,
    action: [{ type: 'delete' }],
  })

  useEffect(() => {
    if (!listCurrency.length) {
      dispatch(getCurrencies())
    }
  }, [])

  return (
    <Box>
      <CardForm title={'Project Cost'}>
        {permissions.useProjectUpdateCostInfo && (
          <Box className={classes.headerFilter}>
            <CommonButton data-title="btn-add" onClick={handleAddCost}>
              {i18Project('LB_ADD_NEW_COST')}
            </CommonButton>
          </Box>
        )}
        <TableShare
          keyName={'id'}
          headCells={headCells}
          rows={rowsPageCurrent}
          limitPage={pageLimit}
          pageCurrent={page}
          isShowCheckbox={false}
          isShowTotal={true}
          childComp={(row: any, index: number) => (
            <ItemRowTableV2
              row={row}
              key={`table-checkbox-${row['id']}`}
              isShowCheckbox={false}
              uuId={row['id']}
              headCells={headCells}
              keyName={'id'}
              onClickItem={handleClick}
              onClickDelete={handleDeleteItem}
              onClickDetail={handleClickDetail}
            />
          )}
          childCompEnd={
            <ItemRowCellEnd
              totalCost={isViewDetail ? totalMoneyCost : totalCost}
              isEmpty={rows.length == 0}
            />
          }
        />
        <ConditionalRender conditional={!!rows.length} fallback={''}>
          <TablePaginationShare
            rowsPerPageOptions={TableConstant.ROWS_PER_PAGE_OPTIONS}
            totalElements={isViewDetail ? totalProjectCost : rows.length}
            pageLimit={pageLimit}
            currentPage={page}
            onChangePage={handleChangePage}
            onChangeLimitPage={handleChangeRowsPerPage}
          />
        </ConditionalRender>
        {isOpenModal && (
          <ModalAddCost
            open
            disabled={!permissions.useProjectUpdateCostInfo}
            setOpen={setOpenModal}
            onSubmit={handleAddNewCost}
            onUpdate={handleUpdateCost}
            onCloseModal={handleCloseModal}
            isViewMode={isUpdate}
            id={idDetail}
            projectId={projectId}
          />
        )}
      </CardForm>

      <ConditionalRender conditional={!isViewDetail}>
        <ProjectStepAction
          configSteps={CONFIG_PROJECT_STEPS}
          activeStep={activeStep}
          isShowNext={!isViewDetail}
          onNext={handleNext}
        />
      </ConditionalRender>
      <ModalDeleteRecords
        titleMessage={i18Project('TXT_DELETE_PROJECT_COST')}
        subMessage={StringFormat(
          i18Project('MSG_DELETE_PROJECT_COST'),
          showModalDeleteProject.code
        )}
        open={showModalDeleteProject.status}
        onClose={handleCloseModalDeleteCost}
        onSubmit={handleSubmitModalDeleteCost}
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
    justifyContent: 'end',
    '& [data-title ="btn-add"]': {
      height: theme.spacing(5),
    },
    '& [data-title ="input-date"]': {
      width: theme.spacing(30),
    },
  },
}))
export default Cost
