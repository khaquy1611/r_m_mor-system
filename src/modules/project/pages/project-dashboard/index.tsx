import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import { LangConstant } from '@/const'
import { PROJECT_DASHBOARD } from '@/const/path.const'
import { commonSelector, CommonState } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { queryStringParam } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardChart from '../../components/dashboard/ProjectDashboardChart'
import DashboardFilter from '../../components/dashboard/ProjectDashboardFilter'
import DashboardTable from '../../components/dashboard/ProjectDashboardTable'
import ProjectTableStaff from '../../components/dashboard/TableStaff'
import { DASHBOARD_TAB_STAFF_AVAILABLE } from '../../const'
import { projectSelector } from '../../reducer/project'
import { getProjectStatistics } from '../../reducer/thunk'
import { ProjectState } from '../../types'

export interface IDataFilter {
  branchId: string
  divisionId: string
  date: Date | null
}

const dataFilterInit: IDataFilter = {
  branchId: '',
  divisionId: '',
  date: new Date(),
}

function ProjectDashboard() {
  const classes = useStyles()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const dispatch = useDispatch<AppDispatch>()
  const [queryParams] = useSearchParams()
  const navigate = useNavigate()
  const { listBranches }: CommonState = useSelector(commonSelector)
  const { assignedStaffs, availableStaffs }: ProjectState =
    useSelector(projectSelector)

  const [dataFilter, setDataFilter] = useState<IDataFilter>(dataFilterInit)

  const tabQuery = useMemo(() => {
    return queryParams.get('staff')
  }, [queryParams])

  const DashboardTableLabelTab = useMemo(() => {
    return !!tabQuery
      ? DASHBOARD_TAB_STAFF_AVAILABLE.includes(tabQuery)
        ? i18nProject('TXT_STAFF_AVAILABLE')
        : i18nProject('TXT_STAFF_ASSIGNED')
      : ''
  }, [tabQuery])

  const staffs = useMemo(() => {
    return !!tabQuery && DASHBOARD_TAB_STAFF_AVAILABLE.includes(tabQuery)
      ? availableStaffs
      : assignedStaffs
  }, [availableStaffs, assignedStaffs, tabQuery])

  useEffect(() => {
    const year = dataFilter.date?.getFullYear()
    const month =
      typeof dataFilter.date?.getMonth() === 'number'
        ? dataFilter.date?.getMonth() + 1
        : dataFilter.date?.getMonth()

    const payload = {
      branchId: dataFilter.branchId,
      divisionId: dataFilter.divisionId,
      year,
      month,
    }
    const queryParams = '?' + queryStringParam(payload)

    if (dataFilter.branchId) {
      dispatch(updateLoading(true))
      dispatch(getProjectStatistics(queryParams))
        .unwrap()
        .finally(() => dispatch(updateLoading(false)))
    }
  }, [dataFilter])

  useEffect(() => {
    if (!listBranches?.length) return
    const firstBranch = listBranches?.[0]?.value
    if (firstBranch) {
      setDataFilter((prev: IDataFilter) => ({
        ...prev,
        branchId: firstBranch.toString(),
      }))
    }
  }, [listBranches])

  return (
    <CommonScreenLayout
      title={i18nProject('TXT_PROJECT_DASHBOARD')}
      useBackPage={!!tabQuery}
      onBack={() => navigate(PROJECT_DASHBOARD)}
    >
      <Box className={classes.rootDashboardProject}>
        <DashboardFilter
          dataFilter={dataFilter}
          setDataFilter={setDataFilter}
        />
        <ConditionalRender
          conditional={!tabQuery}
          fallback={
            <ProjectTableStaff
              tableLabel={DashboardTableLabelTab}
              staffs={staffs}
            />
          }
        >
          <DashboardChart useStaffChart={!!dataFilter.date} />
          {!!dataFilter.date && <DashboardTable />}
        </ConditionalRender>
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootDashboardProject: {},
}))

export default ProjectDashboard
