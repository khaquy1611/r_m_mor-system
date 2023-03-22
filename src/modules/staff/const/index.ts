import { TableConstant } from '@/const'
import { TableHeaderOption } from '@/types'
import { IStatusConstant } from '@/types'
import { formatNumberDecimal } from '@/utils'
import { StepConfig } from '../types'
import { ListStaffParams } from '../types/staff-list'

export const STAFF_STEP: { [key: string]: number } = {
  GENERAL_INFORMATION: 0,
  SKILL_SET: 1,
  CONTRACT: 2,
  PROJECT: 3,
}
export const STAFF_STEP_DETAIL: { [key: string]: number } = {
  GENERAL_INFORMATION: 0,
  SKILL_SET: 1,
  PROJECT: 2,
}

export const CONFIG_STAFF_STEP: StepConfig[] = [
  {
    step: STAFF_STEP.GENERAL_INFORMATION,
    label: 'General Information',
  },
  {
    step: STAFF_STEP.SKILL_SET,
    label: 'Skillset',
  },
  {
    step: STAFF_STEP.CONTRACT,
    label: 'Contract',
  },
]

export const CONFIG_STAFF_STEP_DETAIL: StepConfig[] = [
  {
    step: STAFF_STEP_DETAIL.GENERAL_INFORMATION,
    label: 'General Information',
  },
  {
    step: STAFF_STEP_DETAIL.SKILL_SET,
    label: 'Skillset',
  },
  {
    step: STAFF_STEP_DETAIL.PROJECT,
    label: 'Project',
  },
]

export const genders = [
  {
    id: '1',
    label: 'Male',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Female',
    value: '2',
    disabled: false,
  },
  {
    id: '3',
    label: 'Other',
    value: '3',
    disabled: false,
  },
]

export const status = [
  {
    id: '1',
    label: 'Active',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Inactive',
    value: '2',
    disabled: false,
  },
  {
    id: '3',
    label: 'Onsite',
    value: '3',
    disabled: false,
  },
]

export const jobType = [
  {
    id: '1',
    label: 'Part Time',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Full Time',
    value: '2',
    disabled: false,
  },
]

export const levels = [
  {
    id: 'S',
    label: 'S',
    value: 'S',
    disabled: false,
  },
  {
    id: 'A',
    label: 'A',
    value: 'A',
    disabled: false,
  },
  {
    id: 'B',
    label: 'B',
    value: 'B',
    disabled: false,
  },
  {
    id: 'C',
    label: 'C',
    value: 'C',
    disabled: false,
  },
  {
    id: 'D',
    label: 'D',
    value: 'D',
    disabled: false,
  },
]

export const headCellSkillSet: TableHeaderOption[] = [
  {
    id: 'no',
    align: 'left',
    disablePadding: true,
    label: 'Code',
  },
  {
    id: 'skillGroup',
    align: 'left',
    disablePadding: true,
    label: 'Skill Group',
  },
  {
    id: 'skillName',
    align: 'left',
    disablePadding: true,
    label: 'Skill Name',
  },
  {
    id: 'yearsOfExperience',
    align: 'left',
    disablePadding: true,
    label: 'Years of Experience',
  },
  {
    id: 'level',
    align: 'left',
    disablePadding: true,
    label: 'Level',
  },
  {
    id: 'note',
    align: 'left',
    disablePadding: true,
    label: 'Note',
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: true,
    label: 'Action',
  },
]

export const STAFF_STATUS_TYPE = {
  ACTIVE: 1,
  INACTIVE: 2,
  ON_SITE: 3,
}

export const STAFF_STATUS: { [key: number]: IStatusConstant } = {
  [STAFF_STATUS_TYPE.ACTIVE]: {
    type: 1,
    label: 'Active',
    status: 'success',
  },
  [STAFF_STATUS_TYPE.INACTIVE]: {
    type: 2,
    label: 'InActive',
    status: 'error',
  },
  [STAFF_STATUS_TYPE.ON_SITE]: {
    type: 3,
    label: 'On-site',
    status: 'inProgress',
  },
}

export const GENERAL_INFO_STAFF_INIT = {
  staffName: '',
  gender: '',
  birthday: null,
  email: '',
  directManager: {},
  director: {},
  branchId: '',
  divisionId: '',
  position: '',
  onboardDate: null,
  grade: {},
  gradeTitle: {},
  leaderGrade: {},
  leaderGradeTitle: {},
  status: '',
  jobType: '',
  lastWorkingDate: 0,
  phoneNumber: '',
}

export const keyItemGeneralInformationStaff: any[] = [
  {
    key: 'Branch',
    value: 'branchName',
  },
  {
    key: 'Gender',
    value: 'gender',
  },
  {
    key: 'Direct Manager',
    value: 'directManager',
  },
  {
    key: 'Division',
    value: 'divisionName',
  },
  {
    key: 'Onboard Date',
    value: 'onboardDate',
  },
  {
    key: 'Grade Title',
    value: 'gradeTitle',
  },
  {
    key: 'Leader Grade Title',
    value: 'leaderGradeTitle',
  },
  {
    key: 'Job Type',
    value: 'jobType',
  },
  {
    key: 'Status',
    value: 'status',
  },
  {
    key: 'Last Working Date',
    value: 'lastWorkingDate',
  },
]

export const DEFAULT_CONFIG_CHART: any = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  colors: [
    '#F86868',
    '#0B68A2',
    '#2CB0ED',
    '#FADB61',
    '#BCCCDC',
    '#52D1DA',
    '#CF2D71',
    '#FE7E04',
    '#C1DB3C',
    '#FEC3C6',
    '#F6D001',
    '#C8E0E0',
    '#AB8266',
  ],
  title: {
    text: ``,
    style: {
      fontSize: '32px',
      fontWeight: '500',
    },
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
    series: {
      dataLabels: {
        enabled: true,
        connectorWidth: 0,
        connectorPadding: -5,
        padding: 0,
        format: '{point.name}: ({point.y}%)',
        style: {
          fontSize: '12px',
          fontWeight: '400',
        },
      },
    },
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        connectorWidth: 0,
        distance: 10,
        format: '{point.y}',
        filter: {
          property: 'percentage',
          operator: '>',
          value: 0,
        },
      },
      showInLegend: true,
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.percent}%</b> of total<br/>',
  },
  series: [
    {
      name: '',
      colorByPoint: true,
      data: [] as any,
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
      },
    ],
  },
  legend: {
    align: 'left',
    verticalAlign: 'top',
    y: 100,
    layout: 'vertical',
    itemMarginBottom: 24,
    itemStyle: {
      fontSize: '1.1em',
    },
  },
}

export const DEFAULT_CONFIG_CHART_BAR = {
  chart: {
    type: 'column',
    zoomType: 'y',
  },
  title: {
    text: '',
  },
  subtitle: {
    text: '',
  },
  xAxis: {
    categories: ['Previous Date', 'Current Date'],
    title: {
      text: null,
    },
    accessibility: {
      description: 'Countries',
    },
  },
  yAxis: {
    min: 0,
    tickInterval: 2,
    title: {
      text: '',
    },
    labels: {
      overflow: 'justify',
      format: '{value}',
    },
  },
  plotOptions: {
    column: {
      dataLabels: {
        enabled: true,
        format: '{y}',
      },
    },
    series: {
      pointWidth: 115,
    },
  },
  colors: ['#F37421', '00BFFE'],
  tooltip: {
    valueSuffix: '',
    stickOnContact: true,
  },
  legend: {
    enabled: false,
  },
  series: [
    {
      name: '' as string,
      data: [] as any[],
    },
  ],
  accessibility: {
    enabled: false,
    announceNewData: {
      enabled: true,
    },
  },
  credits: {
    enabled: false,
  },
}

export const initialFiltersDashboard = {
  branchId: '',
  startDate: new Date(new Date().getFullYear(), 0, 1),
  endDate: new Date(new Date().getFullYear(), 11, 31),
  divisionId: '',
}

export const staffQueryParameters: ListStaffParams = {
  branchId: '',
  divisionIds: [],
  startDate: null,
  endDate: null,
  jobType: '',
  keyword: '',
  orderBy: 'desc',
  sortBy: 'modifiedAt',
  status: '',
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  skillsId: [],
  positionIds: [],
}
