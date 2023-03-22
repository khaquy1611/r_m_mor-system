import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import { LangConstant } from '@/const'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { staffSelector } from '../../reducer/staff'
import { getDashboardStaff } from '../../reducer/thunk'
import {
  StaffFilterDashboard,
  StaffQueriesDashboard,
  StaffState,
} from '../../types'
import StaffActionBar from './StaffActionBar'
import StaffComparison from './StaffComparison'
import StaffIdealStats from './StaffIdealStats'
import StaffOnBoardStatistic from './StaffOnBoardStatistic'
import StaffStatistic from './StaffStatistic'
import StaffTurnoverRate from './StaffTurnoverRate'

const StaffDashboard = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18Staff } = useTranslation(LangConstant.NS_STAFF)
  const { filterDashBoard }: StaffState = useSelector(staffSelector)
  const formatQueries = (
    queries: StaffFilterDashboard
  ): StaffQueriesDashboard => {
    return {
      branchId: queries.branchId,
      startDate: queries.startDate?.valueOf(),
      endDate: queries.endDate?.valueOf(),
      divisionId: queries.divisionId,
    }
  }
  useEffect(() => {
    dispatch(updateLoading(true))
    dispatch(getDashboardStaff(formatQueries(filterDashBoard)))
      .unwrap()
      .finally(() => {
        dispatch(updateLoading(false))
      })
  }, [filterDashBoard])

  return (
    <CommonScreenLayout title={i18Staff('TXT_STAFF_DASHBOARD')}>
      <Box className={classes.rootStaffDashboard}>
        <Box className="staff-search-bar">
          <StaffActionBar />
        </Box>
        <Box className="staff-dashboard-item">
          <StaffStatistic />
        </Box>
        <Box className="staff-dashboard-item">
          <StaffComparison />
        </Box>
      </Box>
      <Box className={classes.rootStaffDashboard}>
        <Box className="staff-dashboard-item height-300">
          <StaffOnBoardStatistic />
        </Box>
        <Box className="staff-dashboard-item height-300">
          <StaffTurnoverRate />
        </Box>
        <Box className="staff-dashboard-ideal-stats">
          <StaffIdealStats />
        </Box>
      </Box>
    </CommonScreenLayout>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootStaffDashboard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
    '& .staff-search-bar': {
      width: '100%',
    },
    '& .staff-dashboard-item': {
      minHeight: '367px',
      width: 'calc(50% - 10px)',
      minWidth: '520px',
      flex: 1,
    },
    '& .height-300': {
      height: '300px',
      minHeight: '300px',
    },
    '& .staff-dashboard-ideal-stats': {
      minHeight: '367px',
      width: '100%',
    },
  },
}))
export default StaffDashboard
