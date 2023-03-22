import { WEEKDAYS } from '@/const/app.const'
import { formatDate } from '@/utils'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { DAY_IN_WEEK } from '../const'
import { IReport } from '../types'

export interface IDay {
  value: number
  event: IReport | null
  isCurrentDay: boolean
  date: string
  isDisabled: boolean
  isWeekendDay: boolean
}
export const useDate = (events: any, nav: number) => {
  const [dateDisplay, setDateDisplay] = useState('')
  const [days, setDays] = useState<IDay[]>([])
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const dt = new Date()

    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav)
    }

    const day = dt.getDate()
    const month = dt.getMonth()
    const year = dt.getFullYear()

    const firstDayOfMonth = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })

    const yearStepAction = {
      last: month === 0 ? year - 1 : year,
      next: month === 11 ? year + 1 : year,
    }

    const monthStepAction = {
      last: month === 0 ? 12 : month,
      next: month === 11 ? 1 : month,
    }

    const daysInLastMonth = new Date(
      yearStepAction.last,
      monthStepAction.last,
      0
    ).getDate()

    setDateDisplay(
      `${dt.toLocaleDateString('en-us', { month: 'short' })} - ${year}`
    )
    const paddingDays = WEEKDAYS.indexOf(dateString.split(', ')[0])
    const daysArr: IDay[] = []
    const maxDayDisplay =
      Math.ceil((paddingDays + daysInMonth) / DAY_IN_WEEK) * DAY_IN_WEEK
    const weekendInMonths = [1, 7, 8, 14, 15, 21, 22, 28, 29, 35, 36, 42, 43]

    for (let i = 1; i <= maxDayDisplay; i++) {
      const dateString = `${year}-${month + 1}-${i - paddingDays}`

      if (i > paddingDays && i <= daysInMonth + paddingDays) {
        const _report = events.find((event: any) =>
          moment(event.reportDate).isSame(dateString, 'day')
        )
        if (nav >= 0) {
          daysArr.push({
            value: i - paddingDays,
            event: _report,
            isCurrentDay: i - paddingDays === day && nav === 0,
            date: dateString,
            isDisabled: false,
            isWeekendDay: weekendInMonths.includes(i),
          })
        } else {
          daysArr.push({
            value: i - paddingDays,
            event: _report,
            isCurrentDay: false,
            date: dateString,
            isDisabled: false,
            isWeekendDay: weekendInMonths.includes(i),
          })
        }
      } else {
        daysArr.push({
          value:
            i <= paddingDays
              ? daysInLastMonth - (paddingDays - i)
              : i - paddingDays - daysInMonth,
          event: null,
          isCurrentDay: false,
          date: '',
          isDisabled: true,
          isWeekendDay: weekendInMonths.includes(i),
        })
      }
    }

    setDays(daysArr)
    setMonth(month + 1)
    setYear(year)
  }, [events, nav])

  return {
    days,
    dateDisplay,
    month,
    year,
  }
}
