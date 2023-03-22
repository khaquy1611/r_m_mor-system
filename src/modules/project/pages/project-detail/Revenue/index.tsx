import CommonButton from '@/components/buttons/CommonButton'
import ConditionalRender from '@/components/ConditionalRender'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import CardForm from '@/components/Form/CardForm'
import FormItem from '@/components/Form/FormItem/FormItem'
import ModalDeleteRecords from '@/components/modal/ModalDeleteRecords'
import SelectDivision from '@/components/select/SelectDivision'
import CommonTabs from '@/components/tabs'
import { LangConstant, TableConstant } from '@/const'
import ModalAddRevenue, {
  IProjectRevenue,
} from '@/modules/project/components/ModalAddRevenue'
import ProjectStepAction from '@/modules/project/components/ProjectStep/ProjectStepAction'
import {
  CONFIG_PROJECT_STEPS,
  CONFIG_TAB_PROJECT_REVENUE,
  TAB_PROJECT_REVENUE_PROJECT,
} from '@/modules/project/const'
import {
  projectSelector,
  setActiveStep,
  setProjectRevenueByDivision,
  setProjectRevenueByProject,
} from '@/modules/project/reducer/project'
import {
  createProjectRevenue,
  deleteProjectRevenue,
  getListProjectRevenueByDivision,
  getListProjectRevenueByProject,
  updateProjectRevenue,
} from '@/modules/project/reducer/thunk'
import { IListProjectsParams, ProjectState } from '@/modules/project/types'
import {
  convertDataRevenue,
  convertPayloadRevenue,
  getDateFromDayOfYear,
} from '@/modules/project/utils'
import { AuthState, selectAuth } from '@/reducer/auth'
import { commonSelector, CommonState, getCurrencies } from '@/reducer/common'
import { alertSuccess, updateAlert, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { StepConfig } from '@/types'
import { getArrayMinMax } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import StringFormat from 'string-format'
import ListRevenues from './ListRevenues'

interface IShowModalDeleteProject {
  status: boolean
  projectId: string
  ids: string
}

const Revenue = () => {
  //const
  const classes = useStyles()
  const { t: i18 } = useTranslation()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const { projectId } = useParams()

  const {
    activeStep,
    projectRevenuesByDivision,
    projectRevenuesByProject,
  }: ProjectState = useSelector(projectSelector)
  const { listCurrency }: CommonState = useSelector(commonSelector)
  const { permissions }: AuthState = useSelector(selectAuth)

  //State
  const [params, setParams] = useState<IListProjectsParams>({
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
  })
  const [showModalDeleteProject, setShowModalDeleteProject] =
    useState<IShowModalDeleteProject>({
      status: false,
      projectId: '',
      ids: '',
    })
  const [idDetail, setIdDetail] = useState('')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [idDelete, setIdDelete] = useState('')
  const [code, setCode] = useState('')
  const [activeTab, setActiveTab] = useState(0)

  //Memo
  const isViewDetail = useMemo(() => {
    return !!projectId
  }, [projectId])
  const isTabProject = useMemo(
    () => activeTab === TAB_PROJECT_REVENUE_PROJECT,
    [activeTab]
  )
  const formatParams = useMemo(
    () => ({
      ...params,
      divisionIds: params.divisionIds?.map((item: any) => item?.id)?.toString(),
    }),
    [params, isTabProject]
  )
  const listTabs = useMemo(
    (): StepConfig[] =>
      permissions.useProjectViewDivisionRevenueInfo
        ? CONFIG_TAB_PROJECT_REVENUE
        : CONFIG_TAB_PROJECT_REVENUE.slice(0, -1),
    [permissions.useProjectViewDivisionRevenueInfo]
  )

  //Alert
  const alertActionUpdateSuccess = updateAlert({
    isShowAlert: true,
    alertInfo: {
      type: 'success',
      message: StringFormat(i18Project('MSG_UPDATE_REVENUE'), idDetail),
    },
  })
  const alertActionDeleteSuccess = updateAlert({
    isShowAlert: true,
    alertInfo: {
      type: 'success',
      message: StringFormat(
        i18Project('MSG_DELETE_PROJECT_REVENUE_SUCCESS'),
        code
      ),
    },
  })

  //Function
  const getListProjectRevenue = () => {
    if (isViewDetail && isTabProject) {
      dispatch(getListProjectRevenueByProject({ projectId, params }))
    } else if (isViewDetail && !isTabProject) {
      dispatch(
        getListProjectRevenueByDivision({ projectId, params: formatParams })
      )
    }
  }
  const setValueProjectRevenue = (data: IProjectRevenue[]) => {
    if (isTabProject) {
      dispatch(setProjectRevenueByProject(data))
    } else {
      dispatch(setProjectRevenueByDivision(data))
    }
  }

  //Effect
  useEffect(() => {
    getListProjectRevenue()
  }, [isViewDetail, params, projectId, isTabProject])

  //Function
  const handleClickDetail = (id: string, row: any) => {
    setIsUpdate(true)
    setIdDetail(id)
    setIsOpenModal(!isOpenModal)
    setCode(row.no)
  }
  const handleAddRevenue = () => {
    setIsUpdate(false)
    setIsOpenModal(!isOpenModal)
  }
  const handleCreateRevenue = (data: IProjectRevenue) => {
    dispatch(updateLoading(true))
    dispatch(
      createProjectRevenue({
        projectId,
        data: convertPayloadRevenue(data),
      })
    )
      .unwrap()
      .then(() => {
        getListProjectRevenue()
        setIsOpenModal(!isOpenModal)
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }
  const handleAddNewRevenue = (value: IProjectRevenue) => {
    const newData = convertDataRevenue(value)
    if (isViewDetail) {
      handleCreateRevenue(newData)
    } else {
      setValueProjectRevenue(
        isTabProject
          ? [...projectRevenuesByProject, newData]
          : [...projectRevenuesByDivision, newData]
      )
      dispatch(
        alertSuccess({
          message: i18Project('MSG_CREATE_PROJECT_REVENUE_SUCCESS', {
            projectId: '',
          }),
        })
      )
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
    })
    setIdDelete(id)
    setCode(row.no)
  }
  const deleteRevenueModeCreate = () => {
    let newRevenues: IProjectRevenue[] = []
    isTabProject
      ? (newRevenues = cloneDeep(projectRevenuesByProject))
      : (newRevenues = cloneDeep(projectRevenuesByDivision))
    const indexRevenue = newRevenues.findIndex(
      (item: IProjectRevenue) => item.id === idDelete
    )
    if (indexRevenue > -1) {
      newRevenues.splice(indexRevenue, 1)
      setValueProjectRevenue(newRevenues)
    }
  }
  const handleNext = () => {
    dispatch(setActiveStep(activeStep + 1))
  }
  const handleUpdateRevenue = (value: any, id: string | undefined) => {
    const newData = convertDataRevenue(value)
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(
        updateProjectRevenue({
          projectId,
          id,
          data: convertPayloadRevenue(newData),
        })
      )
        .unwrap()
        .then(() => {
          dispatch(alertActionUpdateSuccess)
          getListProjectRevenue()
          setIsOpenModal(!isOpenModal)
        })
      dispatch(updateLoading(false))
    } else {
      let newRevenue: IProjectRevenue[] = []
      isTabProject
        ? (newRevenue = cloneDeep(projectRevenuesByProject))
        : (newRevenue = cloneDeep(projectRevenuesByDivision))
      const indexRevenue = newRevenue.findIndex(
        (item: IProjectRevenue) => item.id === id
      )
      if (indexRevenue > -1) {
        newRevenue[indexRevenue] = newData
        setValueProjectRevenue(newRevenue)
        dispatch(
          alertSuccess({
            message: StringFormat(i18Project('MSG_UPDATE_REVENUE'), code),
          })
        )
      }
      setIsOpenModal(!isOpenModal)
    }
  }
  const handleCloseModalDeleteRevenue = () => {
    setShowModalDeleteProject({
      status: false,
      projectId: '',
      ids: '',
    })
  }
  const handleSubmitModalDeleteRevenue = () => {
    if (isViewDetail) {
      dispatch(updateLoading(true))
      dispatch(
        deleteProjectRevenue({
          projectId: showModalDeleteProject.projectId,
          ids: showModalDeleteProject.ids,
        })
      )
        .unwrap()
        .then(() => {
          getListProjectRevenue()
          setShowModalDeleteProject({
            status: false,
            projectId: '',
            ids: '',
          })
        })
      dispatch(updateLoading(false))
    } else {
      deleteRevenueModeCreate()
    }
    dispatch(alertActionDeleteSuccess)
  }
  const handleChangeTabs = (value: any) => {
    setParams({
      ...params,
      year: undefined,
      divisionIds: undefined,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    })
    setActiveTab(value)
  }
  const handleDivisionsChange = (value: any) => {
    setParams({ ...params, divisionIds: value })
  }

  useEffect(() => {
    if (!listCurrency.length) {
      dispatch(getCurrencies())
    }
  }, [])

  return (
    <Box>
      <CardForm title={'Project Revenue'}>
        <CommonTabs
          configTabs={listTabs}
          activeTab={activeTab}
          nonLinear={true}
          onClickTab={handleChangeTabs}
        />
        <Box className={classes.headerFilter}>
          <ConditionalRender conditional={isViewDetail} fallback={<Box />}>
            <Box className="header-filter">
              <FormItem label={i18('LB_YEAR')}>
                <InputDatepicker
                  allowedYears={getArrayMinMax(2016, 2099)}
                  inputFormat={'YYYY'}
                  views={['year']}
                  openTo="year"
                  placeholder={'Select Year'}
                  value={getDateFromDayOfYear(Number(params?.year), 1)}
                  onChange={(value: Date) => {
                    setParams({ ...params, year: value?.getFullYear() })
                  }}
                />
              </FormItem>
              <ConditionalRender conditional={!isTabProject} fallback={<Box />}>
                <SelectDivision
                  label={i18('LB_DIVISION') as string}
                  width={200}
                  isProject={true}
                  placeholder={i18Project('PLH_SELECT_DIVISION') || ''}
                  value={params?.divisionIds ?? ''}
                  onChange={handleDivisionsChange}
                />
              </ConditionalRender>
            </Box>
          </ConditionalRender>
          {(activeTab === TAB_PROJECT_REVENUE_PROJECT
            ? permissions.useProjectUpdateProjectRevenueInfo
            : permissions.useProjectUpdateDivisionRevenueInfo) && (
            <CommonButton className="btn-add" onClick={handleAddRevenue}>
              {i18Project('LB_ADD_NEW_REVENUE')}
            </CommonButton>
          )}
        </Box>
        <ListRevenues
          disabled={
            activeTab === TAB_PROJECT_REVENUE_PROJECT
              ? !permissions.useProjectUpdateProjectRevenueInfo
              : !permissions.useProjectUpdateDivisionRevenueInfo
          }
          projectId={projectId ?? ''}
          listCurrency={listCurrency}
          setParams={setParams}
          handleDeleteItem={handleDeleteItem}
          handleClickDetail={handleClickDetail}
          activeTab={activeTab}
        />
        {isOpenModal && (
          <ModalAddRevenue
            open
            disabled={
              isViewDetail
                ? activeTab === TAB_PROJECT_REVENUE_PROJECT
                  ? !permissions.useProjectUpdateProjectRevenueInfo
                  : !permissions.useProjectUpdateDivisionRevenueInfo
                : false
            }
            onCreate={handleAddNewRevenue}
            onUpdate={handleUpdateRevenue}
            onCloseModal={handleCloseModal}
            id={idDetail}
            projectId={projectId}
            isViewMode={isUpdate}
            activeTab={activeTab}
          />
        )}
      </CardForm>
      <ConditionalRender conditional={!isViewDetail}>
        <ProjectStepAction
          configSteps={CONFIG_PROJECT_STEPS}
          activeStep={activeStep}
          onNext={handleNext}
        />
      </ConditionalRender>
      <ModalDeleteRecords
        titleMessage={i18Project('TXT_DELETE_PROJECT_REVENUE')}
        subMessage={`Do you wish to delete Project Revenue ${code}?`}
        open={showModalDeleteProject.status}
        onClose={handleCloseModalDeleteRevenue}
        onSubmit={handleSubmitModalDeleteRevenue}
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
    marginBottom: theme.spacing(3),
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    '& .btn-add': {
      height: theme.spacing(5),
    },
    '& .header-filter': {
      width: theme.spacing(30),
      display: 'flex',
      gap: theme.spacing(2),
    },
  },
}))
export default Revenue
