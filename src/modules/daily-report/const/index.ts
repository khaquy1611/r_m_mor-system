import { TableHeaderOption } from '@/types'
import { ReportStatus } from '../types'

export const WORKING_HOURS_IN_DAY = 8
export const MAX_LENGTH_REPORT_DETAIL = 3
export const DAY_IN_WEEK = 7

export const REPORT_STATUS: { [key: string]: ReportStatus } = {
  REPORT: 0,
  DAY_OFF: 1,
  NO_REPORT: 2,
  HOLIDAY_BREAK: 3,
  LATE_REPORT: 4,
}
export const STATUS_CONFIRM = {
  PENDING: 1,
  APPROVED: 2,
  CANCEL: 3,
}

export const headCellsReportList: TableHeaderOption[] = [
  {
    id: 'id',
    align: 'left',
    disablePadding: true,
    label: 'Report ID',
    checked: false,
  },
  {
    id: 'reportDate',
    align: 'left',
    disablePadding: true,
    label: 'Report Date',
    checked: false,
  },
  {
    id: 'from',
    align: 'left',
    disablePadding: true,
    label: 'From',
    checked: false,
  },
  {
    id: 'to',
    align: 'left',
    disablePadding: true,
    label: 'To',
    checked: false,
  },
  {
    id: 'updateReportDate',
    align: 'left',
    disablePadding: true,
    label: 'Update Report Date',
    checked: false,
  },
  {
    id: 'reasonForLateSubmission',
    align: 'left',
    disablePadding: true,
    label: 'Reason For Late Submission',
    checked: false,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: true,
    label: 'Status',
    checked: false,
  },
]
