import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import InputDropdown from '@/components/inputs/InputDropdown'
import SelectBranch from '@/components/select/SelectBranch'
import { LangConstant } from '@/const'
import { commonSelector, CommonState } from '@/reducer/common'
import { updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { getArrayMinMax, queryStringParam } from '@/utils'
import { Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { listMonth } from '../../const'
import { getStatisticCustomerAndPartner } from '../../reducer/customer'
import DashboardChart from './DashboardChart'
import DashboardTable from './DashboardTable'

export default function CustomerDashboard() {
  const classes = useStyle()
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nCustomer } = useTranslation(LangConstant.NS_CUSTOMER)
  const { t: i18n } = useTranslation()
  const { listBranches }: CommonState = useSelector(commonSelector)

  //state
  const [branchId, setBranchId] = useState('')
  const [date, setDate] = useState<Date | null>(new Date())
  const [month, setMonth] = useState('')
  const handleSelectBranch = useCallback((value: string) => {
    setBranchId(value)
  }, [])

  const handleDateChange = useCallback((value: Date | null) => {
    setDate(value)
  }, [])

  const handleMonthChange = useCallback((value: string) => {
    setMonth(value)
  }, [])

  useEffect(() => {
    if (branchId) {
      const year = date?.getFullYear()
      const queryParams = '?' + queryStringParam({ branchId, year, month })

      dispatch(updateLoading(true))
      dispatch(getStatisticCustomerAndPartner(queryParams))
        .unwrap()
        .finally(() => dispatch(updateLoading(false)))
    }
  }, [branchId, date, month])

  useEffect(() => {
    if (!listBranches?.length) return
    if (listBranches?.[0]?.value) {
      setBranchId(listBranches?.[0]?.value.toString())
    }
  }, [listBranches])

  return (
    <CommonScreenLayout title={i18nCustomer('TXT_DASHBOARD')}>
      <Box className={classes.filterBlock}>
        <SelectBranch
          isDashboard
          width={180}
          label={i18nCustomer('LB_BRANCH')}
          value={branchId}
          onChange={handleSelectBranch}
          isShowClearIcon={false}
        />
        <InputDatepicker
          allowedYears={getArrayMinMax(2016, 2099)}
          width={180}
          value={date}
          label={i18n('LB_YEAR')}
          onChange={handleDateChange}
          views={['year']}
          openTo="year"
          inputFormat={'YYYY'}
        />
        <InputDropdown
          value={month}
          width={180}
          label={i18n('LB_MONTH')}
          placeholder={i18nCustomer('PLH_SELECT_MONTH')}
          listOptions={listMonth}
          onChange={handleMonthChange}
        />
      </Box>

      <DashboardChart />
      <DashboardTable />
    </CommonScreenLayout>
  )
}

const useStyle = makeStyles((theme: Theme) => ({
  rootDashboardLayout: {
    padding: theme.spacing(3, 5),
    backgroundColor: '#f1f2f7',
    // minHeight: '100vh',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 1,
    textTransform: 'uppercase',
  },
  filterBlock: {
    display: 'flex',
    gap: theme.spacing(3),

    '& > div': {
      backgroundColor: theme.color.white,
    },
  },
  blockChart: {
    justifyContent: 'space-around',
    gap: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  chart: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
    flexBasis: '50%',
    backgroundColor: theme.color.white,
  },
  blockTable: {},
}))
