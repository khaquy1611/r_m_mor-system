import CardForm from '@/components/Form/CardForm'
import CommonTabs from '@/components/tabs'
import { LangConstant, TableConstant } from '@/const'
import { IAssignStaffState } from '@/modules/project/types'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { IAction, Pagination } from '@/types'
import { HttpStatusCode } from '@/api/types'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { UNIT_OF_TIME } from '@/const/app.const'
import { projectSelector } from '../../reducer/project'
import { ProjectService } from '../../services'
import TableActualEffort from './TableActualEffort'
import TableAssignStaff from './TableAssignStaff'

export interface IStaff extends IAssignStaffState {
  action?: IAction[]
}

export interface ActualEffortQuery {
  year: number | null
  divisionId?: string
  unitOfTime: string
  pageNum: number
  pageSize: number
}

interface ProjectAssignStaffProps {
  isDetailPage: boolean
}

const ProjectAssignStaff = ({ isDetailPage }: ProjectAssignStaffProps) => {
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Project } = useTranslation(LangConstant.NS_PROJECT)
  const { t: i18 } = useTranslation()

  const { assignStaffs } = useSelector(projectSelector)

  const [staffSelected, setStaffSelected] = useState<any>({})
  const [openModalAddAssignStaff, setOpenModalAddAssignStaff] = useState(false)
  const [flagTriggerGetListStaff, setFlagTriggerGetListStaff] = useState(false)
  const [actualEffortQuery, setActualEffortQuery] = useState<ActualEffortQuery>(
    {
      year: new Date().getTime(),
      divisionId: '',
      unitOfTime: UNIT_OF_TIME[0].value,
      pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
      pageSize: TableConstant.LIMIT_DEFAULT,
    }
  )
  const [activeTab, setActiveTab] = useState(0)
  const [actualEffort, setActualEffort] = useState({
    data: [],
    total: 0,
  })
  const [queryStaffAssignment, setQueryStaffAssignment] = useState<Pagination>({
    pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
    pageSize: TableConstant.LIMIT_DEFAULT,
  })

  const listTabs = useMemo(() => {
    const data = isDetailPage
      ? [
          {
            step: 0,
            label: i18Project('LB_STAFF_ASSIGNMENT'),
          },
          {
            step: 1,
            label: i18Project('LB_ACTUAL_EFFORT'),
          },
        ]
      : [
          {
            step: 0,
            label: i18Project('LB_STAFF_ASSIGNMENT'),
          },
        ]
    return {
      staffAssignment: 0,
      actualEffort: 1,
      data,
    }
  }, [])

  const handleTabChange = (tab: number) => {
    setActiveTab(tab)
  }

  const getProjectListActualEffort = async (
    actualEffortQuery: ActualEffortQuery
  ) => {
    dispatch(updateLoading(true))
    try {
      const query: ActualEffortQuery = {
        ...actualEffortQuery,
        year: new Date(actualEffortQuery.year as number).getFullYear(),
      }

      const res = await ProjectService.getProjectListActualEffort(
        params.projectId as string,
        query
      )
      if (res.status === HttpStatusCode.OK) {
        setActualEffort({
          data: res.data.content,
          total: res.data.totalElements,
        })
      }
    } catch (err) {
      //
    } finally {
      dispatch(updateLoading(false))
    }
  }

  useEffect(() => {
    if (assignStaffs.length) {
      setTimeout(() => {
        getProjectListActualEffort(actualEffortQuery)
      })
    }
  }, [actualEffortQuery, assignStaffs])

  return (
    <CardForm title={i18('TXT_STAFF_INFORMATION')}>
      <CommonTabs
        nonLinear
        configTabs={listTabs.data}
        activeTab={activeTab}
        onClickTab={handleTabChange}
      />
      {activeTab === listTabs.staffAssignment && (
        <TableAssignStaff
          query={queryStaffAssignment}
          setQuery={setQueryStaffAssignment}
          staffSelected={staffSelected}
          setStaffSelected={setStaffSelected}
          openModalAddAssignStaff={openModalAddAssignStaff}
          setOpenModalAddAssignStaff={setOpenModalAddAssignStaff}
          flagTriggerGetListStaff={flagTriggerGetListStaff}
          setFlagTriggerGetListStaff={setFlagTriggerGetListStaff}
        />
      )}
      {activeTab === listTabs.actualEffort && isDetailPage && (
        <TableActualEffort
          actualEffort={actualEffort}
          actualEffortQuery={actualEffortQuery}
          setActualEffortQuery={setActualEffortQuery}
        />
      )}
    </CardForm>
  )
}

export default ProjectAssignStaff
