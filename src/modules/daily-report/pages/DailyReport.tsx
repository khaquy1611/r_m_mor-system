import CommonScreenLayout from '@/components/common/CommonScreenLayout'
import ConditionalRender from '@/components/ConditionalRender'
import { LangConstant } from '@/const'
import ListStaffSideBar from '@/modules/daily-report/components/ListStaffSideBar'
import { selectAuth } from '@/reducer/auth'
import {
  commonSelector,
  getProjectManagerStaffs,
  getProjectStaffs,
} from '@/reducer/common'
import { alertError, alertSuccess, updateLoading } from '@/reducer/screen'
import { AppDispatch } from '@/store'
import { OptionItem } from '@/types'
import { formatDate, sortAtoZChartArray } from '@/utils'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Calendar from '../components/calendar/Calendar'
import ToolbarCalendar from '../components/calendar/ToolbarCalendar'
import PopupReport, { IReportState } from '../components/popup/PopupReport'
import PopupReportCompare from '../components/popup/PopupReportCompare'
import PopupReportDetail from '../components/popup/PopupReportDetail'
import { IDay, useDate } from '../hooks/useDate'
import {
  createDailyReport,
  createDailyReportApplication,
  dailyReportSelector,
  deleteDailyReport,
  getDailyReports,
  setOpenConfirmDaily,
  updateDailyReport,
} from '../reducer/dailyReport'
import { IReport, IReportAppRequest, IReportRequest } from '../types'
const MAX_HOURS_OF_DAY = 24

const DailyReport = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const classes = useStyles()

  const { projectStaffs } = useSelector(commonSelector)
  const { reports, isOpenConfirmReport } = useSelector(dailyReportSelector)
  const { staff } = useSelector(selectAuth)

  const [staffSelected, setStaff] = useState<OptionItem | undefined | null>(
    null
  )
  const [nav, setNav] = useState(0)
  const [openPopupReport, setOpenPopupReport] = useState(false)
  const [reportSelected, setReportSelected] = useState<IReport | null>(null)
  const [reportDate, setReportDate] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [isZoomInRightSideBar, setIsZoomInRightSideBar] = useState(true)
  const { days, dateDisplay, month, year } = useDate(reports, nav)
  const [listStaffs, setListStaffs] = useState<OptionItem[]>([])
  const [loadingStaffList, setLoadingStaffList] = useState(false)
  const { permissions } = useSelector(selectAuth)

  const isViewOnly = useMemo(
    () => Boolean(staffSelected?.id) && staffSelected?.id != staff?.id,
    [staffSelected, staff]
  )

  const isUserManager = useMemo(
    () => permissions.useDailyReportProjectManagerGeneral,
    [permissions]
  )

  const handleClickDay = (dayDetail: IDay) => {
    const dailyReportDate = dayDetail.event?.reportDate
    if (dailyReportDate) {
      const _report = reports.find((report: IReport) =>
        moment(report.reportDate).isSame(dailyReportDate, 'day')
      )
      if (!_report) return
      setReportSelected(cloneDeep(_report))
    }
    setReportDate(new Date(dayDetail.date).getTime())
    setOpenPopupReport(true)
  }

  const handleClickNewReport = () => {
    setReportDate(new Date().getTime())
    setOpenPopupReport(true)
  }

  const handleClosePopupReport = () => {
    setReportDate(0)
    setReportSelected(null)
    setOpenPopupReport(false)
  }

  const convertDataPayload = (data: IReportState) => ({
    improvement: data.improvement ?? '',
    reportDate: Number(data.reportDate),
    staffId: staff?.id ?? 0,
    note: data.note,
    statusReport: data.status?.id || 0,
    projectManager: data.projectManager,
    dailyReportDetails: data.projects.map(_reportDetail => ({
      workingHours: +_reportDetail.workingHours,
      workingDescription: _reportDetail.workingDescription,
      improvement: _reportDetail.impediment ?? '',
      suggestionForImprovement: _reportDetail.suggestionForImprovement ?? '',
      projectId: Number(_reportDetail.projectId),
    })),
  })
  const convertDataAppPayload = (data: IReportState) => ({
    reportImprovement: data.improvement ?? '',
    reportDate: Number(data.reportDate),
    approvedBy: data.projectManager?.id ?? '',
    noteReport: data.note,
    statusReport: data.status?.id || 0,
    dailyReportApplicationDetail: data.projects.map(_reportDetail => ({
      workingHours: +_reportDetail.workingHours,
      workingDescription: _reportDetail.workingDescription,
      improvement: _reportDetail.impediment ?? '',
      suggestionForImprovement: _reportDetail.suggestionForImprovement ?? '',
      projectId: Number(_reportDetail.projectId),
    })),
  })

  const getReportFromApi = () => {
    dispatch(updateLoading(true))
    dispatch(
      getDailyReports({
        month,
        year,
        staffId: staffSelected?.id
          ? staffSelected?.id ?? null
          : staff?.id ?? null,
      })
    )
      .unwrap()
      .finally(() => dispatch(updateLoading(false)))
  }

  const handleSubmitReport = (
    values: IReportState,
    isNoClose: boolean | undefined
  ) => {
    const payload: IReportRequest = convertDataPayload(values)
    const payloadApp: IReportAppRequest = convertDataAppPayload(values)
    let isOvertimeOfDay = 0
    payload.dailyReportDetails.forEach(item => {
      isOvertimeOfDay = isOvertimeOfDay + item.workingHours
    })
    if (
      isOvertimeOfDay <= MAX_HOURS_OF_DAY &&
      !values?.dailyReportId &&
      !values.projectManager?.id
    ) {
      dispatch(createDailyReport(payload))
        .unwrap()
        .then(() => {
          dispatch(
            alertSuccess({
              message: i18nDailyReport(
                'dailyReport:MSG_CREATE_DAILY_REPORT_SUCCESS',
                { date: formatDate(payload.reportDate) }
              ),
            })
          )
          getReportFromApi()
          !isNoClose && handleClosePopupReport()
        })
    } else if (
      isOvertimeOfDay <= MAX_HOURS_OF_DAY &&
      values?.dailyReportId &&
      !values.projectManager?.id
    ) {
      dispatch(
        updateDailyReport({
          reportId: values.dailyReportId,
          data: payload,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(
            alertSuccess({
              message: i18nDailyReport(
                'dailyReport:MSG_UPDATE_DAILY_REPORT_SUCCESS',
                { date: formatDate(payload.reportDate) }
              ),
            })
          )
          getReportFromApi()
          !isNoClose && handleClosePopupReport()
        })
    } else if (
      isOvertimeOfDay <= MAX_HOURS_OF_DAY &&
      values.projectManager?.id
    ) {
      dispatch(createDailyReportApplication(payloadApp)).then((res: any) => {
        if (res && !res?.error) {
          dispatch(
            alertSuccess({
              message: i18nDailyReport(
                'dailyReport:MSG_UPDATE_DAILY_REPORT_SUCCESS',
                { date: formatDate(payload.reportDate) }
              ),
            })
          )
          getReportFromApi()
          !isNoClose && handleClosePopupReport()
        }
      })
    } else {
      dispatch(
        alertError({
          message: i18nDailyReport('dailyReport:MSG_OVERTIME_OF_DAY'),
        })
      )
    }
  }

  const handleDeleteReport = (values: IReportState) => {
    if (!values?.dailyReportId) return
    dispatch(deleteDailyReport(values?.dailyReportId))
      .unwrap()
      .then(() => {
        dispatch(
          alertSuccess({
            message: i18nDailyReport(
              'dailyReport:MSG_DELETE_DAILY_REPORT_SUCCESS',
              { date: formatDate(values?.reportDate ?? 0) }
            ),
          })
        )
        getReportFromApi()
        handleClosePopupReport()
      })
  }

  const handleCloseCompareReport = () => {
    dispatch(setOpenConfirmDaily(false))
  }

  useEffect(() => {
    setLoading(true)
    dispatch(
      getDailyReports({
        month,
        year,
        staffId: staffSelected?.id
          ? staffSelected?.id ?? null
          : staff?.id ?? null,
      })
    )
      .unwrap()
      .finally(() => setLoading(false))
  }, [month, year, staffSelected, staff])

  useEffect(() => {
    if (!!projectStaffs.length) return
    staff?.id && dispatch(getProjectStaffs(staff?.id))
  }, [])

  useEffect(() => {
    setLoadingStaffList(true)
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
        setLoadingStaffList(false)
      })
      .finally(() => {
        setLoadingStaffList(false)
      })
  }, [staff])

  return (
    <Box className={classes.rootDailyReport}>
      <Box
        className={clsx(classes.wrapDailyReport, !staff && classes.fullHeight)}
      >
        <Box className={classes.dailyReport}>
          <ToolbarCalendar
            label={dateDisplay}
            setNav={setNav}
            isViewOnlyAndConfirm={isViewOnly}
            onNewReport={handleClickNewReport}
          />
          <Calendar
            days={days}
            onClickDay={handleClickDay}
            loading={loading}
            isViewOnlyAndConfirm={isViewOnly}
          />
          <ConditionalRender conditional={openPopupReport}>
            {isViewOnly ? (
              <PopupReportDetail
                open={openPopupReport}
                onClose={handleClosePopupReport}
                report={reportSelected}
                staffSelected={staffSelected}
              />
            ) : (
              <PopupReport
                currentReportDate={new Date(year, month - 1, 1)}
                reportDate={reportDate}
                open={openPopupReport}
                onClose={handleClosePopupReport}
                report={reportSelected}
                isShowAndUpdate={!isViewOnly}
                onSubmit={handleSubmitReport}
                onDelete={handleDeleteReport}
              />
            )}
          </ConditionalRender>
        </Box>
      </Box>
      {isUserManager && (
        <ListStaffSideBar
          onSelectStaff={staff => {
            setStaff(staff)
          }}
          onOpen={() => {
            setIsZoomInRightSideBar(!isZoomInRightSideBar)
          }}
          loading={loadingStaffList}
          listStaffs={listStaffs}
          staffSelected={staffSelected}
          isZoomInRightSideBar={isZoomInRightSideBar}
        />
      )}
      {isOpenConfirmReport && (
        <PopupReportCompare
          open={isOpenConfirmReport}
          setStaff={setStaff}
          onConfirm={() => {
            dispatch(setOpenConfirmDaily(false))
          }}
          onClose={handleCloseCompareReport}
        />
      )}
    </Box>
  )
}
const useStyles = makeStyles(() => ({
  rootDailyReport: {
    display: 'flex',
    overflow: 'auto',
    height: '100%',
    position: 'relative',
  },
  wrapDailyReport: {
    padding: '24px 10px 24px 52px',
    flex: 1,
  },
  fullHeight: {
    height: '100% !important',
  },
  dailyReport: {
    paddingBottom: '24px',
  },
}))
export default DailyReport
