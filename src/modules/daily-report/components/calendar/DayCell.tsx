import ConditionalRender from '@/components/ConditionalRender'
import { LangConstant } from '@/const'
import {
  CheckCircleOutlined,
  MoreTime,
  WarningAmber,
} from '@mui/icons-material'
import { Box, Theme } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MAX_LENGTH_REPORT_DETAIL,
  REPORT_STATUS,
  WORKING_HOURS_IN_DAY,
} from '../../const'
import { IDay } from '../../hooks/useDate'
import { IReportDetail } from '../../types'

interface IProps {
  dayDetail: IDay
  onClick: (report: IDay) => void
  disable: boolean
}

const DayCell = ({ dayDetail, onClick, disable = false }: IProps) => {
  const classes = useStyles()
  const { t: i18nDailyReport } = useTranslation(LangConstant.NS_DAILY_REPORT)

  const className = `day ${dayDetail.isDisabled ? 'padding' : ''} ${
    dayDetail.isCurrentDay ? 'currentDay' : ''
  } ${dayDetail.isWeekendDay ? 'weekend' : ''}`

  const events = useMemo(() => {
    if (!dayDetail.event?.dailyReportDetails) return []
    return dayDetail.event?.dailyReportDetails.map((report: any) => ({
      ...report,
      label: `${report.project.name}: ${report.workingHours} h`,
    }))
  }, [dayDetail])

  const listEventRender = useMemo(() => {
    let result: any[] = []
    const max =
      events.length > MAX_LENGTH_REPORT_DETAIL
        ? MAX_LENGTH_REPORT_DETAIL
        : !!events.length
        ? events.length
        : 0

    if (max <= 0) return result
    for (let i = 0; i <= max; i++) {
      result.push({
        ...events[i],
        ...(i === MAX_LENGTH_REPORT_DETAIL &&
        events.length > MAX_LENGTH_REPORT_DETAIL
          ? {
              label: i18nDailyReport('TXT_MORE_PROJECT_REPORTS', {
                count: events.length - MAX_LENGTH_REPORT_DETAIL,
              }),
            }
          : {}),
        className: i === MAX_LENGTH_REPORT_DETAIL ? 'event-more' : 'event-item',
      })
    }

    return result
  }, [events])

  const totalWorkingHours = useMemo(() => {
    const reportDetails = dayDetail.event?.dailyReportDetails
    if (!reportDetails) return null
    const _totalWorkingHours = reportDetails.reduce(
      (accumulator: number, currentValue: IReportDetail) =>
        accumulator + currentValue.workingHours,
      0
    )
    return _totalWorkingHours
  }, [dayDetail])

  const overtimeHours = useMemo(
    () =>
      !!totalWorkingHours
        ? dayDetail.isWeekendDay ||
          dayDetail.event?.status?.id === REPORT_STATUS.HOLIDAY_BREAK
          ? totalWorkingHours
          : totalWorkingHours - WORKING_HOURS_IN_DAY
        : 0,
    [totalWorkingHours]
  )

  const isShowWarningIcon = useMemo(() => {
    return (
      !dayDetail.isDisabled &&
      !!totalWorkingHours &&
      (dayDetail.isWeekendDay
        ? false
        : dayDetail.event?.status?.id === REPORT_STATUS.REPORT ||
          dayDetail.event?.status?.id === REPORT_STATUS.LATE_REPORT
        ? totalWorkingHours < WORKING_HOURS_IN_DAY
        : false)
    )
  }, [totalWorkingHours])

  const isShowOverTimeIcon = useMemo(() => {
    return (
      !dayDetail.isDisabled &&
      !!totalWorkingHours &&
      (dayDetail.isWeekendDay ||
      dayDetail.event?.status?.id === REPORT_STATUS.HOLIDAY_BREAK
        ? true
        : totalWorkingHours > WORKING_HOURS_IN_DAY)
    )
  }, [totalWorkingHours])

  const handleClick = () => {
    if (dayDetail.isDisabled || disable) return
    onClick(dayDetail)
  }

  return (
    <Box
      onClick={handleClick}
      className={clsx(
        className,
        classes.rootDayCell,
        disable && classes.readonly
      )}
    >
      <Box className="space-between-root header">
        <Box className="text-day">{dayDetail.value}</Box>

        <Box>
          {isShowWarningIcon && (
            <TooltipCustom title={i18nDailyReport('MSG_DID_NOT_FULL_WORK')}>
              <WarningAmber width={24} className="warning-icon" />
            </TooltipCustom>
          )}
          {isShowOverTimeIcon && (
            <TooltipCustom
              title={i18nDailyReport('MSG_OVER_TIME_HOURS', {
                hour: overtimeHours,
              })}
            >
              <MoreTime className="ot-icon" />
            </TooltipCustom>
          )}
        </Box>
      </Box>

      <Box className="body">
        {!dayDetail.isDisabled &&
          !!listEventRender.length &&
          listEventRender.map((event, index: number) => (
            <ConditionalRender conditional={!!event.label} key={index}>
              <Box
                className={clsx(
                  event.className,
                  isShowWarningIcon && 'warning-day',
                  isShowOverTimeIcon && 'overtime-day'
                )}
              >
                {event.label}
              </Box>
            </ConditionalRender>
          ))}
        {!dayDetail.isDisabled &&
          Boolean(dayDetail?.event?.status?.id === REPORT_STATUS.DAY_OFF) && (
            <Box className="day-off">Day Off</Box>
          )}
        {!dayDetail.isDisabled &&
          Boolean(
            dayDetail?.event?.status?.id === REPORT_STATUS.NO_REPORT &&
              !dayDetail?.event?.dailyReportDetails?.length
          ) && <Box className="no-report">No Report</Box>}
        {!dayDetail.isDisabled &&
          Boolean(
            dayDetail?.event?.status?.id === REPORT_STATUS.HOLIDAY_BREAK
          ) && <Box className="holiday-break">Holiday Break</Box>}
      </Box>

      <Box className="footer center-root">
        <ConditionalRender
          conditional={!dayDetail.isDisabled && !!dayDetail.event?.improvement}
        >
          <CheckCircleOutlined />
          <span>{i18nDailyReport('TXT_15_MINUTES_SELF_IMPROVEMENT')}</span>
        </ConditionalRender>
      </Box>
    </Box>
  )
}

const TooltipCustom = ({ title, children }: any) => {
  return (
    <Tooltip title={<Box style={{ fontSize: 16 }}>{title}</Box>}>
      {children}
    </Tooltip>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootDayCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    width: '100%',
    height: '100%',
    padding: theme.spacing(0.5, 1),
    color: theme.color.black.primary,
    cursor: 'pointer',

    '&.padding': {
      color: '#B9B9C3',
      backgroundColor: theme.color.grey.grayE,
      cursor: 'default',
    },

    '&.weekend': {
      color: theme.color.error.secondary,
    },

    '& .text-day': {
      width: theme.spacing(3.5),
      height: theme.spacing(3.5),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    '&.currentDay': {
      backgroundColor: '#8ec3f336',
      '& .text-day': {
        borderRadius: '50%',
        backgroundColor: '#258FF0',
        color: theme.color.white,
      },
    },

    '& .header': {
      flexShrink: 1,

      '& .warning-icon': {
        color: '#ed4a5cde',
      },

      '& .ot-icon': {
        color: '#a70eb1',
      },

      '& .error-icon': {
        color: 'rgb(246, 191, 38)',
      },
    },

    '& .body': {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: theme.spacing(0.75),

      '& .event-item': {
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1.6,
        borderRadius: '0.5em',
        padding: theme.spacing(0.5, 1.5),
        color: '#053a17',
        backgroundColor: ' #abffd899',
        '&.warning-day': {
          backgroundColor: '#fd3c5147',
          color: ' #d91111',
        },

        '&.overtime-day': {
          color: '#65186a',
          background: '#da93db38',
        },
      },

      '& .event-more': {
        fontSize: 10,
        fontWeight: 700,
        lineHeight: '21px',
        color: theme.color.black.primary,
      },

      '& .day-off': {
        color: '#9e450a',
        textAlign: 'center',
      },
      '& .no-report': {
        color: theme.color.error.secondary,
        textAlign: 'center',
      },
      '& .holiday-break': {
        color: '#58B984',
        textAlign: 'center',
      },
    },

    '& .footer': {
      fontSize: 10,
      lineHeight: 1,
      flexShrink: 1,
      gap: theme.spacing(0.75),
      justifyContent: 'flex-start',
      minHeight: theme.spacing(3),
      color: theme.color.black.primary,

      '& > svg': {
        color: theme.color.green.primary,
      },
    },
  },
  readonly: {
    cursor: 'default',
  },
}))

export default DayCell
