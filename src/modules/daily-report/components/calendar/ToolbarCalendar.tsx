import ButtonAddWithIcon from '@/components/buttons/ButtonAddWithIcon'
import InputDatepicker from '@/components/Datepicker/InputDatepicker'
import { LangConstant } from '@/const'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { Box, Button, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import moment from 'moment'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { dailyReportSelector } from '../../reducer/dailyReport'

interface IProps {
  label: string
  isViewOnlyAndConfirm: boolean
  onNewReport: () => void
  setNav: Dispatch<SetStateAction<number>>
}

const ToolbarCalendar = ({
  label,
  isViewOnlyAndConfirm,
  onNewReport,
  setNav,
}: IProps) => {
  const classes = useStyles()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)
  const { responseReport } = useSelector(dailyReportSelector)
  const [openCalendar, setOpenCalendar] = useState(false)

  const [dateNav, setDateNav] = useState<Date | null>(new Date())

  const reportStatistics = useMemo(() => {
    return [
      {
        label: `${i18nDailyReport('TXT_TOTAL_WORKING_HOURS')}`,
        count: `${responseReport?.totalWorkingHours || 0} ${i18nDailyReport(
          Number(responseReport?.totalWorkingHours || 0) > 1
            ? 'TXT_HOURS'
            : 'TXT_HOUR'
        )}`,
        className: 'success',
      },
      {
        label: `${i18nDailyReport('TXT_DAY_OFF')}`,
        count: `${responseReport?.dayOff || 0} ${i18nDailyReport(
          Number(responseReport?.dayOff || 0) > 1 ? 'TXT_DAYS' : 'TXT_DAY'
        )}`,
        className: 'day-off',
      },
      {
        label: `${i18nDailyReport('TXT_NO_REPORT')}`,
        count: `${responseReport?.noReport || 0} ${i18nDailyReport(
          Number(responseReport?.noReport || 0) > 1 ? 'TXT_DAYS' : 'TXT_DAY'
        )}`,
        className: 'error',
      },
      {
        label: `${i18nDailyReport('TXT_TOTAL_OT_HOURS')}`,
        count: `${responseReport?.totalOtHours || 0} ${i18nDailyReport(
          Number(responseReport?.totalOtHours || 0) > 1
            ? 'TXT_HOURS'
            : 'TXT_HOUR'
        )}`,
        className: 'ot-hours',
      },
    ]
  }, [responseReport])

  const handleNextNav = () => {
    const _dateNav = moment(dateNav).add(1, 'months').toDate()
    setNav((prev: number) => prev + 1)
    setDateNav(_dateNav)
  }

  const handlePrevNav = () => {
    const _dateNav = moment(dateNav).subtract(1, 'months').toDate()
    setNav((prev: number) => prev - 1)
    setDateNav(_dateNav)
  }

  const handleChangeDateNav = (date: Date | null) => {
    const _nav = moment(date).diff(new Date(), 'month', true)
    setNav(Math.ceil(_nav))
    setDateNav(date)
  }

  const handleOpenCalendar = () => {
    setOpenCalendar((prev: boolean) => !prev)
  }

  return (
    <Box className={classes.rootCalendarToolbar}>
      <Box className="row row-wrapper">
        <Box className="head-title">{i18nDailyReport('TXT_DAILY_REPORT')}</Box>
        <Box className="row row-title">
          <Button className="btn" disabled={false} onClick={handlePrevNav}>
            <ArrowBackIosNew />
          </Button>
          <Box className="title step-calendar">
            <span onClick={handleOpenCalendar}>{label}</span>
            <InputDatepicker
              className={classes.rootInputDatepicker}
              defaultOpen={openCalendar}
              useLabel={true}
              label={''}
              isShowClearIcon={false}
              value={dateNav}
              onChange={handleChangeDateNav}
              views={['year', 'month']}
              openTo="month"
              inputFormat={'YYYY-MM'}
              minDate={new Date('1-1-2016')}
              onClose={() => setOpenCalendar(false)}
            />
          </Box>
          <Button className="btn" onClick={handleNextNav}>
            <ArrowForwardIos />
          </Button>
        </Box>
        {!isViewOnlyAndConfirm && (
          <ButtonAddWithIcon onClick={onNewReport} className="btn-report">
            {i18nDailyReport('TXT_NEW_REPORT')}{' '}
          </ButtonAddWithIcon>
        )}
      </Box>
      <Box className="row row-report">
        {reportStatistics.map(report => (
          <Box
            className={clsx('report-content', report.className)}
            key={report.label}
          >
            <Box className="text">{report.label}</Box>
            <Box className="report-count">{report.count}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCalendarToolbar: {
    marginBottom: theme.spacing(3),
    '& .step-calendar': {
      cursor: 'pointer',
      height: theme.spacing(3),
    },

    '& .row': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      justifyContent: 'flex-end',
      flex: 1,
      '&.row-title': {
        justifyContent: 'center',
      },

      '&.row-wrapper': {
        position: 'relative',
      },
    },

    '& .head-title': {
      fontSize: 20,
      fontWeight: 700,
    },

    '& .title': {
      fontSize: 18,
      fontWeight: 700,
      color: theme.color.black.primary,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
    },

    '& .btn': {
      color: theme.color.black.primary,
      borderRadius: '50%',
      width: theme.spacing(5.75),
      minWidth: theme.spacing(5.75),
      height: theme.spacing(5.75),

      '&.disabled': {
        color: theme.color.grey.secondary,
      },

      '& > svg': {
        fontSize: 18,
      },
    },

    '& .row-report': {
      justifyContent: 'center',
      gap: theme.spacing(4),
      paddingTop: theme.spacing(4),
      fontSize: 18,
      lineHeight: 1,
    },

    '& .report-content': {
      fontWeight: 400,
      display: 'flex',
      padding: '20px',
      flexDirection: 'column',
      gap: '10px',
      fontSize: '16px',
      minWidth: theme.spacing(30),
      boxShadow: '0 1px 4px rgb(0 0 0 / 20%)',
      '& .text': {
        color: '#333',
      },
      '& .report-count': {
        fontSize: '24px',
      },
      '&.success': {
        color: '#053a17',
        background: ' #78e9b494',
      },

      '&.day-off': {
        color: '#964109',
        background: '#ebb887a3',
      },

      '&.error': {
        color: '#a80000',
        background: '#fd3c5166',
      },

      '&.ot-hours': {
        color: '#65186a',
        background: '#d330d538',
      },
    },

    '& .report-count': {
      fontWeight: 700,
    },
  },
  rootInputDatepicker: {
    visibility: 'hidden',
    width: 0,
  },
}))

export default ToolbarCalendar
