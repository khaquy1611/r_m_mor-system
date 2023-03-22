import NoData from '@/components/common/NoData'
import ConditionalRender from '@/components/ConditionalRender'
import CardForm from '@/components/Form/CardForm'
import { LangConstant } from '@/const'
import { ScreenState, selectScreen } from '@/reducer/screen'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Highcharts, { chart } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { cloneDeep } from 'lodash'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DEFAULT_CONFIG_CHART_BAR } from '../../const'
import { staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'

const StaffComparison = () => {
  //const
  const classes = useStyles()
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)

  const { staffDashboardComparison, filterDashBoard }: StaffState =
    useSelector(staffSelector)
  const { isShowSideBar }: ScreenState = useSelector(selectScreen)

  const chartRef = useRef<HighchartsReact.RefObject>(null)

  //memo
  const dataDashboard = useMemo(
    () => [
      {
        color: '#F37421',
        y: staffDashboardComparison.totalPreviousTime ?? 0,
      },
      {
        color: '#00BFFE',
        y: staffDashboardComparison.totalSelectedTime ?? 0,
      },
    ],
    [staffDashboardComparison]
  )
  const StaffComparisonOptions = useMemo(() => {
    let chartConfig = cloneDeep(DEFAULT_CONFIG_CHART_BAR)
    chartConfig.series = [
      {
        name: i18nStaff('TXT_COMPARISON') ?? '',
        data: dataDashboard,
      },
    ]
    if (filterDashBoard.startDate && filterDashBoard.endDate) {
      chartConfig.xAxis.categories = [
        formatDate(filterDashBoard.startDate),
        formatDate(filterDashBoard.endDate),
      ]
    }
    return chartConfig
  }, [dataDashboard, filterDashBoard.startDate, filterDashBoard.endDate])

  useEffect(() => {
    const chart = chartRef.current?.chart

    setTimeout(() => {
      const chartContainer = document.getElementById('staff__chart-comparison')
      chart?.setSize(chartContainer?.offsetWidth, chart?.chartHeight)
    }, 250)
  }, [isShowSideBar])

  return (
    <CardForm
      title={i18nStaff('TXT_COMPARISON') ?? ''}
      className={classes.rootStaffComparison}
    >
      <ConditionalRender
        conditional={
          staffDashboardComparison.totalPreviousTime ||
          staffDashboardComparison.totalSelectedTime
        }
        fallback={<NoData />}
      >
        <Box id="staff__chart-comparison">
          <HighchartsReact
            highcharts={Highcharts}
            options={StaffComparisonOptions}
            ref={chartRef}
          />
        </Box>
      </ConditionalRender>
    </CardForm>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  titleComparison: {
    fontSize: '20px',
    padding: '20px',
  },
  rootStaffComparison: {
    height: '100%',
    width: '100%',
  },
}))
export default StaffComparison
