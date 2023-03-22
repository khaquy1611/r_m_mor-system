import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import { LangConstant, PathConstant } from '@/const'
import { PROJECT_STATUS } from '@/const/app.const'
import { ScreenState, selectScreen } from '@/reducer/screen'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import clsx from 'clsx'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  DASHBOARD_TAB_STAFF_ASSIGNED,
  DASHBOARD_TAB_STAFF_AVAILABLE,
  PROJECT_CHART_CONFIG,
} from '../../const'
import { projectSelector } from '../../reducer/project'
import { ProjectState } from '../../types'

interface IProps {
  useStaffChart: boolean
}

export default function DashboardChart({ useStaffChart }: IProps) {
  const classes = useStyle()
  const { t: i18nProject } = useTranslation(LangConstant.NS_PROJECT)
  const navigate = useNavigate()

  const { isShowSideBar }: ScreenState = useSelector(selectScreen)
  const { dashboardState }: ProjectState = useSelector(projectSelector)
  const { totalProject, totalStaff } = dashboardState

  const projectChartRef = useRef<HighchartsReact.RefObject>(null)
  const staffChartRef = useRef<HighchartsReact.RefObject>(null)

  const formatDataChart = (listData: any) => {
    const result: any = []
    listData?.forEach((item: any) => {
      if (item.percent > 0) {
        result.push({
          name: item.name ? item.name : PROJECT_STATUS?.[item.status.id]?.label,
          y: +item.percent,
          count: item.count ? +item.count || 0 : +item.totalStaff || 0,
        })
      }
    })
    return result
  }

  const projectOptions = useMemo(() => {
    const chartConfig = cloneDeep(PROJECT_CHART_CONFIG)

    chartConfig.series = [
      {
        ...chartConfig.series[0],
        name: i18nProject('TXT_PROJECT'),
        colorByPoint: true,
        data: formatDataChart(totalProject.percentStatus),
      },
    ]

    return chartConfig
  }, [totalProject])

  const staffOptions = useMemo(() => {
    const chartConfig = cloneDeep(PROJECT_CHART_CONFIG)

    const seriesData: any = []

    totalStaff.percentStaff.forEach((staff: any) => {
      if (+staff.percent > 0) {
        seriesData.push({
          name: staff.name,
          y: staff.percent,
          count: staff.totalStaff,
          path:
            staff.name === 'Assigned'
              ? `${PathConstant.PROJECT_DASHBOARD}${DASHBOARD_TAB_STAFF_ASSIGNED}`
              : `${PathConstant.PROJECT_DASHBOARD}${DASHBOARD_TAB_STAFF_AVAILABLE}`,
          staffs: staff.staffs,
        })
      }
    })

    chartConfig.series = [
      {
        ...chartConfig.series[0],
        name: i18nProject('TXT_STAFF'),
        colorByPoint: true,
        data: seriesData,
      },
    ]

    chartConfig.plotOptions.pie.point.events.click = handleClickStaffChart

    return chartConfig
  }, [totalStaff])

  function handleClickStaffChart(e: any) {
    const { path } = e?.point
    if (path) {
      navigate(path)
    }
  }

  useEffect(() => {
    const chartProject = projectChartRef.current?.chart
    const chartStaff = staffChartRef.current?.chart

    setTimeout(() => {
      const chartProjectContainer = document.getElementById('project-chart')
      const chartStaffContainer = document.getElementById('staff-chart')

      chartProject?.setSize(
        chartProjectContainer?.offsetWidth,
        chartProject?.chartHeight
      )
      chartStaff?.setSize(
        chartStaffContainer?.offsetWidth,
        chartStaff?.chartHeight
      )
    }, 250)
  }, [isShowSideBar, useStaffChart])

  return (
    <Box className={clsx('space-between-root', classes.blockChart)}>
      <CardForm
        className="chart"
        title={`${i18nProject('TXT_TOTAL_PROJECT')}: ${
          totalProject?.totalProject ?? 0
        }`}
      >
        <ConditionalRender
          conditional={!!totalProject?.totalProject}
          fallback={<NoData />}
        >
          <Box id="project-chart">
            <HighchartsReact
              highcharts={Highcharts}
              options={projectOptions}
              ref={projectChartRef}
            />
          </Box>
        </ConditionalRender>
      </CardForm>
      {useStaffChart && (
        <CardForm
          className="chart"
          title={`${i18nProject('TXT_TOTAL_STAFF')}: ${
            totalStaff?.totalStaff ?? 0
          }`}
        >
          <ConditionalRender
            conditional={!!totalStaff?.totalStaff}
            fallback={<NoData />}
          >
            <Box id="staff-chart">
              <HighchartsReact
                highcharts={Highcharts}
                options={staffOptions}
                ref={staffChartRef}
              />
            </Box>
          </ConditionalRender>
        </CardForm>
      )}
    </Box>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  blockChart: {
    gap: theme.spacing(3),
    alignItems: 'stretch',
    paddingTop: theme.spacing(3),
    flexWrap: 'wrap',

    '& .chart': {
      flex: 1,
      width: 'calc(50% - 12px)',
      minWidth: theme.spacing(60),
      padding: theme.spacing(3),
      borderRadius: theme.spacing(0.5),
      marginTop: `0px !important`,
      minHeight: theme.spacing(64),
      border: `1px solid ${theme.color.grey.secondary}`,

      [theme.breakpoints.down('lg')]: {
        minWidth: '100%',
      },

      '& > div:first-child': {
        marginBottom: 0,
      },
    },
  },
}))
