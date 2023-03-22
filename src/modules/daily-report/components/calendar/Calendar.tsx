import ConditionalRender from '@/components/ConditionalRender'
import LoadingFallback from '@/components/LoadingFallback/LoadingFallback'
import { weekdayLabels } from '@/const/app.const'
import { Box, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { REPORT_STATUS } from '../../const'
import { IDay } from '../../hooks/useDate'
import DayCell from './DayCell'

export interface IProps {
  days: IDay[]
  onClickDay: (report: IDay) => void
  loading: boolean
  isViewOnlyAndConfirm: boolean
}

function Calendar({ days, onClickDay, loading, isViewOnlyAndConfirm }: IProps) {
  const classes = useStyles()

  return (
    <Box className={classes.rootCalendar}>
      <div id="calendar" className="calendar-wrapper">
        <Box className="wrapper-calendar-cell">
          {weekdayLabels.map((day: string) => (
            <Box key={day} className="head-cell">
              {day}
            </Box>
          ))}
        </Box>

        <Box className="wrapper-calendar-body">
          <ConditionalRender
            conditional={!loading}
            fallback={<LoadingFallback />}
          >
            <Box className="wrapper-calendar-cell">
              {days.map((day: IDay, index: number) => (
                <Box key={index} className="calendar-cell">
                  <DayCell
                    dayDetail={day}
                    onClick={onClickDay}
                    disable={
                      isViewOnlyAndConfirm &&
                      (day?.event?.status === null ||
                        day?.event?.status?.id === REPORT_STATUS.NO_REPORT ||
                        day?.event?.status?.id === REPORT_STATUS.DAY_OFF)
                    }
                  />
                </Box>
              ))}
            </Box>
          </ConditionalRender>
        </Box>
      </div>
    </Box>
  )
}

const useStyles = makeStyles((theme: Theme) => ({
  rootCalendar: {
    '& .calendar-wrapper': {
      fontSize: 14,
      fontWeight: 700,
      color: theme.color.black.primary,
    },

    '& .wrapper-calendar-cell': {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat( 7, 1fr)',
      border: `1px solid ${theme.color.grey.secondary}`,

      '&:nth-child(2)': {
        borderTop: 'unset',
      },
    },

    '& .wrapper-calendar-body': {
      width: '100%',
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
    },

    '& .head-cell': {
      padding: theme.spacing(1.5),
      textAlign: 'center',
      color: theme.color.black.secondary,
    },

    '& .calendar-cell': {
      minHeight: theme.spacing(20),
      borderLeft: `1px solid ${theme.color.grey.secondary}`,
      borderBottom: `1px solid ${theme.color.grey.secondary}`,

      '&:nth-child(7n + 1)': {
        borderLeft: 'unset',
      },
    },
  },
}))

export default Calendar
