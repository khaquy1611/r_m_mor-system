import FilterList from '@/components/common/FilterList'
import InputAutocompleteSingle from '@/components/inputs/InputAutocompleteSingle'
import InputRangeDatePicker from '@/components/inputs/InputRangeDatePicker'
import InputDropdown from '@/components/inputs/InputDropdown'
import { selectAuth } from '@/reducer/auth'
import { getProjectManagerStaffs } from '@/reducer/common'
import { AppDispatch } from '@/store'
import { sortAtoZChartArray } from '@/utils'
import { Box, Theme } from '@mui/material'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import FormItem from '@/components/Form/FormItem/FormItem'
import { makeStyles } from '@mui/styles'
import { DateRange } from '@/types'
import { IQueriesReportList } from '.'
import moment from 'moment'

const STATUS = [
  {
    id: 1,
    value: '1',
    label: 'Waiting To Confirm',
  },
  {
    id: 2,
    value: 2,
    label: 'Confirmed',
  },
  {
    id: 3,
    value: 3,
    label: 'Declined',
  },
]

interface IProps {
  setQueries: Dispatch<SetStateAction<IQueriesReportList>>
  queries: IQueriesReportList
}

const FilterReport = ({ queries, setQueries }: any) => {
  const [loadingStaff, setLoadingStaff] = useState(false)
  const [listStaffs, setListStaffs] = useState<any[]>([])
  const { staff } = useSelector(selectAuth)
  const { t: i18 } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const classes = useStyles()

  const [queriesTemp, setQueriesTemp] = useState<IQueriesReportList>({})

  useEffect(() => {
    setLoadingStaff(true)
    dispatch(getProjectManagerStaffs(staff?.id ?? ''))
      .unwrap()
      .then((response: any) => {
        let _listStaffs = response?.data?.map((staff: any) => ({
          ...staff,
          value: staff.id,
          label: staff.name,
          description: staff?.email,
        }))
        setListStaffs(sortAtoZChartArray(_listStaffs))
      })
      .finally(() => {
        setLoadingStaff(false)
      })
  }, [staff])

  const handleChangeReportDate = (value: DateRange) => {
    setQueriesTemp({
      ...queriesTemp,
      reportDateFrom: moment(value.startDate).valueOf(),
      reportDateTo: moment(value.endDate).valueOf(),
    })
  }
  const handleChangeUpdateTime = (value: DateRange) => {
    setQueriesTemp({
      ...queriesTemp,
      updateTimeFrom: moment(value.startDate).valueOf(),
      updateTimeTo: moment(value.endDate).valueOf(),
    })
  }
  const handleChangeStaffFrom = (value: any) => {
    setQueriesTemp({
      ...queriesTemp,
      from: value,
    })
  }
  const handleChangeStaffTo = (value: any) => {
    setQueriesTemp({
      ...queriesTemp,
      to: value,
    })
  }
  const handleChangeStatus = (value: any) => {
    setQueriesTemp({
      ...queriesTemp,
      status: value,
    })
  }

  const handleFilter = () => {
    setQueries({ ...queries, ...queriesTemp })
  }

  const handleClearFilter = () => {
    setQueriesTemp({})
    setQueries({
      pageNum: queries.pageNum,
      pageSize: queries.pageSize,
      sortBy: queries.sortBy,
      orderBy: queries.orderBy,
      type: queries.type,
    })
  }
  return (
    <FilterList
      title="Filter Option"
      submitDisabled={false}
      clearDisabled={false}
      onSubmit={handleFilter}
      onClear={handleClearFilter}
      onToggleFilter={() => {}}
    >
      <Box>
        <FormItem className={classes.bottom16}>
          <InputRangeDatePicker
            values={{
              startDate: queriesTemp.reportDateFrom
                ? new Date(queriesTemp.reportDateFrom)
                : null,
              endDate: queriesTemp.reportDateTo
                ? new Date(queriesTemp.reportDateTo)
                : null,
            }}
            title={'Report Date'}
            onChange={handleChangeReportDate}
          />
        </FormItem>
        <FormItem className={classes.bottom16}>
          <InputRangeDatePicker
            values={{
              startDate: queriesTemp.updateTimeFrom
                ? new Date(queriesTemp.updateTimeFrom)
                : null,
              endDate: queriesTemp.updateTimeTo
                ? new Date(queriesTemp.updateTimeTo)
                : null,
            }}
            title={'Update Time'}
            onChange={handleChangeUpdateTime}
          />
        </FormItem>
        <FormItem label={'From'} className={classes.bottom16}>
          <InputAutocompleteSingle
            loading={loadingStaff}
            label={''}
            placeholder={'Select Staff Member'}
            listOptions={listStaffs}
            onChange={handleChangeStaffFrom}
            value={queriesTemp.from?.toString() ?? ''}
            width={260}
          />
        </FormItem>
        <FormItem label={'To'} className={classes.bottom16}>
          <InputAutocompleteSingle
            loading={loadingStaff}
            label={''}
            placeholder={'Select Staff Member'}
            listOptions={listStaffs}
            onChange={handleChangeStaffTo}
            value={queriesTemp.to?.toString() ?? ''}
            width={260}
          />
        </FormItem>
        <FormItem className={classes.bottom16}>
          <InputDropdown
            width={'260px'}
            keyName="status"
            label={'Status'}
            placeholder={'Select Status'}
            listOptions={STATUS}
            value={queriesTemp.status?.toString() ?? ''}
            onChange={handleChangeStatus}
          />
        </FormItem>
      </Box>
    </FilterList>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  bottom16: {
    marginBottom: '16px',
  },
}))
export default FilterReport
