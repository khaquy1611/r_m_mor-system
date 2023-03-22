import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import SelectBranch from '@/components/select/SelectBranch'
import SelectDivisionSingle from '@/components/select/SelectDivisionSingle'
import { LangConstant } from '@/const'
import { AppDispatch } from '@/store'
import { DateRange, OptionItem } from '@/types'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterDashBoard, staffSelector } from '../../reducer/staff'
import { StaffState } from '../../types'

const StaffActionBar = () => {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nStaff } = useTranslation(LangConstant.NS_STAFF)
  const { t: i18nCustomer } = useTranslation(LangConstant.NS_CUSTOMER)

  const { filterDashBoard }: StaffState = useSelector(staffSelector)

  const [flagReset, setFlagReset] = useState(false)

  const handleFilterChange = (value: any, key: string) => {
    let dataFilter = {
      ...filterDashBoard,
      [key]: value,
    }
    if (key === 'branchId') {
      dataFilter.divisionId = ''
    }
    dispatch(setFilterDashBoard(dataFilter))
  }
  const handleDateRangeChange = (dateRange: DateRange) => {
    setFlagReset(false)
    const { startDate, endDate } = dateRange
    const _dateRange = {
      startDate:
        typeof startDate === 'number' ? startDate : startDate?.getTime(),
      endDate: typeof endDate === 'number' ? endDate : endDate?.getTime(),
    }
    const dataFilter = {
      ...filterDashBoard,
      ..._dateRange,
    }
    dispatch(setFilterDashBoard(dataFilter))
  }

  return (
    <Box className={classes.rootStaffActionBar}>
      <Box className="filter-item">
        <SelectBranch
          isDashboard
          label={i18nStaff('LB_BRANCH') ?? ''}
          placeholder={i18nCustomer('PLH_SELECT_BRANCH') ?? ''}
          value={filterDashBoard.branchId}
          width={260}
          onChange={(value: string) => handleFilterChange(value, 'branchId')}
        />
      </Box>
      <Box className="filter-item">
        <SelectDivisionSingle
          isDashboard
          width={260}
          label={i18nStaff('LB_DIVISION') ?? ''}
          value={filterDashBoard.divisionId}
          isDisable={!filterDashBoard.branchId}
          branchId={filterDashBoard.branchId}
          placeholder={i18nStaff('PLH_SELECT_DIVISION') ?? ''}
          onChange={(division: OptionItem) => {
            handleFilterChange(division?.id, 'divisionId')
          }}
        />
      </Box>
      <Box className="filter-item">
        <InputRangeDatePicker
          isCustomLabel
          flagReset={flagReset}
          values={{
            startDate: filterDashBoard.startDate,
            endDate: filterDashBoard.endDate,
          }}
          onChange={handleDateRangeChange}
        />
      </Box>
    </Box>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootStaffActionBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    '& .filter-item': {},
  },
}))
export default StaffActionBar
