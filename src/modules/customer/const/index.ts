import { TableConstant } from '@/const'
import { IListProjectsParams } from '@/modules/project/types'
import {
  IContract,
  ICustomer,
  IDataDashboard,
  IListCustomersParams,
  ListPartnersParams,
} from '../types'

export const CUSTOMER_REQUEST_KEY: { [key: string]: keyof ICustomer } = {
  SIGN_NDA: 'signNda',
  NAME: 'name',
  BRANCH_ID: 'branchId',
  PRIORITY: 'priority',
  SERVICE_ID: 'serviceIds',
  COLLABORATION_START_DATE: 'collaborationStartDate',
  STATUS: 'status',
  SCALE: 'scale',
  WEBSITE: 'website',
  CONTACT_NAME: 'contactName',
  CONTACT_PHONE_NUMBER: 'contactPhoneNumber',
  EMAIL_ADDRESS: 'emailAddress',
  CONTACT_NOTE: 'contactNote',
  CONTACT_PERSON_ID: 'contactPersonId',
}

export const CONTRACT_REQUEST_KEY: { [key: string]: keyof IContract } = {
  ID: 'id',
  CODE: 'code',
  TYPE: 'type',
  GROUP: 'group',
  VALUE: 'value',
  EXPECTED_REVENUE: 'expectedRevenue',
  STATUS: 'status',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  NOTE: 'note',
}

export const PRIORITY_STATUS = {
  low: 1,
  medium: 2,
  high: 3,
}

export const initialDataDashboard: IDataDashboard = {
  customerBasedOnStatus: {
    total: 0,
    ratio: [],
  },
  partnerBasedOnStatus: {
    total: 0,
    ratio: [],
  },
  totalCustomerCost: {
    total: 0,
    customers: [],
  },
  totalPartnerCost: {
    total: 0,
    partners: [],
  },
}

export const customerQueryParameters: IListCustomersParams = {
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  keyword: '',
  branchId: '',
  collaborationStartDate: null,
  priority: null,
  skillSetIds: [],
  startDate: null,
  endDate: null,
  orderBy: 'desc',
  sortBy: 'modifiedAt',
  languageIds: [],
  divisionIds: [],
}

export const partnerQueryParameters: ListPartnersParams = {
  branchId: '',
  keyword: '',
  pageNum: TableConstant.PAGE_CURRENT_DEFAULT,
  pageSize: TableConstant.LIMIT_DEFAULT,
  skillSetIds: [],
  priority: '',
  collaborationStartDate: null,
  startDate: null,
  endDate: null,
  orderBy: 'desc',
  sortBy: 'modifiedAt',
  locationId: '',
  languageIds: [],
  divisionIds: [],
}

export const MAX_CONTRACT_NOTE = 100
export const CONTRACT_NOTE_MAX_ELLIPSIS = 50

export const DEFAULT_CONFIG_CHART = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  credits: {
    enabled: false,
  },
  colors: ['#2CB0ED', '#FADB61', '#0B68A2', '#F86868', '#BCCCDC', '#52D1DA '],
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
        format: '{point.name}: {point.count} {point.label} ({point.y}%)',
        style: {
          fontSize: '12px',
          fontWeight: '400',
        },
      },
    },
  },
  tooltip: {
    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: <b>{point.count:.0f}</b> of total<br/>',
  },
  series: [
    {
      name: '',
      colorByPoint: true,
      data: [],
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
}

export const listMonth = [
  {
    id: 1,
    label: 'Jan',
    value: 1,
    name: 'Jan',
  },
  {
    id: 2,
    label: 'Feb',
    value: 2,
    name: 'Feb',
  },
  {
    id: 3,
    label: 'Mar',
    value: 3,
    name: 'Mar',
  },
  {
    id: 4,
    label: 'Apr',
    value: 4,
    name: 'Apr',
  },
  {
    id: 5,
    label: 'May',
    value: 5,
    name: 'May',
  },
  {
    id: 6,
    label: 'Jun',
    value: 6,
    name: 'Jun',
  },
  {
    id: 7,
    label: 'Jul',
    value: 7,
    name: 'Jul',
  },
  {
    id: 8,
    label: 'Aug',
    value: 8,
    name: 'Aug',
  },
  {
    id: 9,
    label: 'Sep',
    value: 9,
    name: 'Sep',
  },
  {
    id: 10,
    label: 'Oct',
    value: 10,
    name: 'Oct',
  },
  {
    id: 11,
    label: 'Nov',
    value: 11,
    name: 'Nov',
  },
  {
    id: 12,
    label: 'Dec',
    value: 12,
    name: 'Dec',
  },
]
