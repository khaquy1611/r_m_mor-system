import { TableConstant } from '@/const'
import { CURRENCY_CODE } from '@/const/app.const'
import { StepConfig } from '@/types'
import {
  IGeneralProjectState,
  IListProjectsParams,
  IProjectDashboard,
} from '../types'

export const PROJECT_STEP: { [key: string]: number } = {
  GENERAL_INFORMATION: 0,
  HEAD_COUNT: 1,
  REVENUE: 2,
  COST: 3,
}

export const CONFIG_PROJECT_STEPS: StepConfig[] = [
  {
    step: PROJECT_STEP.GENERAL_INFORMATION,
    label: 'General Information',
  },
  {
    step: PROJECT_STEP.HEAD_COUNT,
    label: 'Headcount',
  },
  {
    step: PROJECT_STEP.REVENUE,
    label: 'Revenue',
  },
  {
    step: PROJECT_STEP.COST,
    label: 'Cost',
  },
]

export const generalInitialState: IGeneralProjectState = {
  name: '',
  branchId: '',
  divisions: [],
  technologies: [],
  customer: {},
  partner: [],
  type: '',
  status: '',
  startDate: null,
  endDate: null,
  manager: [],
  totalContract: '',
  note: '',
  totalRevenue: '',
  revenueCurrency: CURRENCY_CODE.VND.toString(),
  revenueRate: '1',
  code: '',
  noteType: '',
  initMonthHeadcount: '',
  description: '',
  workChannelLink: '',
  contractIds: [],
}

export const MONTH: { [key: string]: number } = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
}

export const MONTH_INSTANCE = {
  [MONTH.JAN]: {
    value: 0,
    label: 'Jan',
  },
  [MONTH.FEB]: {
    value: 1,
    label: 'Feb',
  },
  [MONTH.MAR]: {
    value: 2,
    label: 'Mar',
  },
  [MONTH.APR]: {
    value: 3,
    label: 'Apr',
  },
  [MONTH.MAY]: {
    value: 4,
    label: 'May',
  },
  [MONTH.JUN]: {
    value: 5,
    label: 'Jun',
  },
  [MONTH.JUL]: {
    value: 6,
    label: 'Jul',
  },
  [MONTH.AUG]: {
    value: 7,
    label: 'Aug',
  },
  [MONTH.SEP]: {
    value: 8,
    label: 'Sep',
  },
  [MONTH.OCT]: {
    value: 9,
    label: 'Oct',
  },
  [MONTH.NOV]: {
    value: 10,
    label: 'Nov',
  },
  [MONTH.DEC]: {
    value: 11,
    label: 'Dec',
  },
}

export const COST = {
  DIVISION: '1',
  PARTNER: '2',
}

export const CONTRACT_HEADCOUNT_TYPE = 1

export const PROJECT_CHART_CONFIG: any = {
  chart: {
    plotBorderWidth: 0,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  colors: ['#2CB0ED', '#FADB61', '#0B68A2', '#F86868', '#BCCCDC', '#52D1DA '],
  title: {
    text: ``,
    align: 'center',
    verticalAlign: 'middle',
    style: {
      fontSize: '22px',
      fontWeight: '500',
    },
    x: 75,
    useHTML: true,
  },
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        distance: 15,
        connectorWidth: 0,
        connectorPadding: -5,
        padding: 0,
        format: '{point.y}%',
        style: {
          fontSize: '12px',
          fontWeight: '400',
        },
      },
      startAngle: 0,
      endAngle: 0,
      center: ['50%', '50%'],
      size: '75%',
      innerSize: '0%',
      showInLegend: true,
      point: {
        events: {
          click: (e: any) => {},
        },
      },
    },
  },
  legend: {
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'middle',
    itemMarginBottom: 24,
  },
  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.count:.0f}</b> of total<br/>',
  },
  series: [
    {
      type: 'pie',
      name: '',
      colorByPoint: true,
      data: [],
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          // maxWidth: 500,
        },
      },
    ],
  },
}

export const DASHBOARD_TAB_STAFF_ASSIGNED = '?staff=assigned'
export const DASHBOARD_TAB_STAFF_AVAILABLE = '?staff=available'

export const initialStateDashboard: IProjectDashboard = {
  totalProject: {
    percentStatus: [],
    totalProject: 0,
  },
  totalStaff: {
    percentStaff: [],
    totalStaff: 0,
  },
  health: {
    year: 0,
    contractEffort: [],
    percentage: [],
    staffAvailable: [],
    totalStaff: [],
  },
}

export const PROJECT_TYPES = [
  {
    id: '1',
    label: 'Labo',
    value: '1',
  },
  {
    id: '2',
    label: 'PJ',
    value: '2',
  },
  {
    id: '3',
    label: 'Maintain',
    value: '3',
  },
  {
    id: '4',
    label: 'Other',
    value: '4',
  },
]

export const TAB_PROJECT_REVENUE_PROJECT = 0
export const TAB_PROJECT_REVENUE_DIVISION = 1
export const CONFIG_TAB_PROJECT_REVENUE: StepConfig[] = [
  {
    step: TAB_PROJECT_REVENUE_PROJECT,
    label: 'Project',
  },
  {
    step: TAB_PROJECT_REVENUE_DIVISION,
    label: 'Division',
  },
]

export const LIST_REVENUE_STATUS = [
  {
    id: 1,
    label: 'Invoice Not Published',
    value: 1,
    disabled: false,
  },
  {
    id: 2,
    label: 'Invoice Published',
    value: 2,
    disabled: false,
  },
  {
    id: 3,
    label: 'Payment Received',
    value: 3,
    disabled: false,
  },
]

export const INIT_DATA_REVENUE = {
  actualRevenue: '',
  expectedRevenue: '',
  currency: { id: '', value: '', label: '' },
  division: { id: '', label: '' },
  status: { id: '', label: '' },
  rate: '',
  date: '',
  note: '',
}

export const projectQueryParameters: IListProjectsParams = {
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  orderBy: 'desc',
  sortBy: 'modifiedAt',
  branchId: '',
  divisionIds: [],
  type: '',
  technologyIds: [],
  startDateFrom: null,
  endDateFrom: null,
  startDateTo: null,
  endDateTo: null,
  customerId: null,
}
