import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import CommonTabs from '@/components/tabs'
import { AppDispatch } from '@/store'
import { formatDate } from '@/utils'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  dailyReportSelector,
  getApplication,
  setOpenConfirmDaily,
} from '../../reducer/dailyReport'
import FilterReport from './FilterReport'
import ReportList from './ReportList'
import { PAGE_CURRENT_DEFAULT, LIMIT_DEFAULT } from '@/const/table.const'
import PopupReportCompare from '../../components/popup/PopupReportCompare'

export interface IQueriesReportList {
  pageNum?: number
  pageSize?: number
  sortBy?: string
  orderBy?: string
  from?: number
  reportDateFrom?: Date | number
  reportDateTo?: Date | number
  status?: string | number
  to?: number
  type?: string | number
  updateTimeFrom?: Date | number
  updateTimeTo?: Date | number
}
export const TAB_REPORTS = {
  CONFIRMATION_REQUEST: 2,
  SENT_REQUEST: 1,
}
export const tabs = [
  {
    step: TAB_REPORTS.CONFIRMATION_REQUEST,
    label: 'Confirmation Requests',
  },
  {
    step: TAB_REPORTS.SENT_REQUEST,
    label: 'Sent Requests',
  },
]

const DailyReportList = () => {
  const classes = useStyles()
  const [activeTab, setActiveTab] = useState(2)
  const [reportLists, setReportLists] = useState<any[]>([])
  const [totalPage, setTotalPage] = useState(0)
  const dispatch = useDispatch<AppDispatch>()
  const { isOpenConfirmReport } = useSelector(dailyReportSelector)
  const [queries, setQueries] = useState<IQueriesReportList>({
    pageNum: PAGE_CURRENT_DEFAULT,
    pageSize: LIMIT_DEFAULT,
    sortBy: '',
    orderBy: 'desc',
    type: TAB_REPORTS.CONFIRMATION_REQUEST,
  })

  const convertStatus = (status: any) => {
    switch (status.id) {
      case 1:
        return {
          label: status.name,
          status: 'inProgress',
        }
      case 2:
        return {
          label: status.name,
          status: 'success',
        }
      case 3:
        return {
          label: status.name,
          status: 'error',
        }
    }
  }

  const formatData = (value: any) => {
    return {
      id: value.reportId,
      reportDate: formatDate(value.reportDate),
      from: value.from.name,
      to: value.to.name,
      updateReportDate: formatDate(value.updateTime),
      reasonForLateSubmission: value.noteReport,
      status: convertStatus(value.status),
    }
  }

  useEffect(() => {
    dispatch(getApplication(queries))
      .unwrap()
      .then(res => {
        if (res) {
          const _reportList = res.data.content ?? []
          setReportLists(_reportList.map((item: any) => formatData(item)))
          setTotalPage(res.data.totalElements)
        }
      })
  }, [queries])

  const handleActiveTab = (value: number) => {
    setActiveTab(value)
    setQueries({ ...queries, type: value })
  }

  const handleCloseCompareReport = () => {
    dispatch(setOpenConfirmDaily(false))
  }
  const handleConfirm = () => {
    dispatch(getApplication(queries))
      .unwrap()
      .then(res => {
        if (res) {
          const _reportList = res.data.content ?? []
          setReportLists(_reportList.map((item: any) => formatData(item)))
          setTotalPage(res.data.totalElements)
        }
      })
    dispatch(setOpenConfirmDaily(false))
  }

  return (
    <CommonScreenLayout title="Report List">
      <Box className={classes.rootReportList}>
        <Box className={classes.flex}>
          <CommonTabs
            configTabs={tabs}
            activeTab={activeTab}
            onClickTab={handleActiveTab}
          />
          <FilterReport queries={queries} setQueries={setQueries} />
        </Box>

        <ReportList
          reportList={reportLists}
          totalPage={totalPage}
          queries={queries}
          setQueries={setQueries}
        />
      </Box>
      <PopupReportCompare
        open={isOpenConfirmReport}
        onClose={handleCloseCompareReport}
        onConfirm={handleConfirm}
      />
    </CommonScreenLayout>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  rootReportList: {},
  flex: {
    display: 'flex',
  },
}))
export default DailyReportList
