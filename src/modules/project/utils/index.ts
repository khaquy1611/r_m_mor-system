import { base64ToArrayBuffer, formatToOptionItem, uuid } from '@/utils'
import moment from 'moment'
import { IProjectRevenue } from '../components/ModalAddRevenue'
import { CONTRACT_HEADCOUNT_TYPE } from '../const'
import { IGeneralProjectState } from '../types'
import { OptionItem } from './../../../types/index'

export const convertPayloadCost = (value: any) => {
  return {
    date: moment(value.date, 'MM/YYYY').valueOf(),
    note: value.note,
    sourceId: value?.source.id,
    currencyId: value?.currency.id,
    cost: value?.cost,
    costOrigin: value?.costOrigin.id,
    rate: value.rate,
  }
}
export const convertCurrency = (value: any) => ({
  id: value?.id,
  label: value?.code,
  value: value?.id,
  disabled: false,
})
export const convertStatusRevenue = (value: any) => ({
  id: value?.id,
  label: value?.name,
  value: value?.id,
  disabled: false,
})
export const formatPayloadRevenue = (value: any) => {
  return {
    id: value.id,
    actualRevenue: value?.actualRevenue,
    expectedRevenue: value?.expectedRevenue,
    date: new Date(value.date),
    division: {
      branchId: value.division?.branchId,
      divisionId: value.division?.divisionId,
      label: value.division?.name,
      id: value.division?.divisionId,
    },
    status: convertStatusRevenue(value?.status),
    rate: value.rate,
    note: value.note,
    currency: convertCurrency(value.currency),
    action: [{ type: 'delete' }],
  }
}
export const formatPayloadCost = (value: any) => {
  return {
    id: value.id,
    costOrigin: {
      id: value.costOrigin.id,
      label: value.costOrigin.name,
      value: value.costOrigin.id,
      disabled: false,
    },
    date: new Date(value.date),
    rate: value?.rate,
    source: {
      id: value?.source?.id ?? '',
      label: value?.source?.name ?? '',
      value: value?.source?.id ?? '',
      disabled: false,
    },
    currency: convertCurrency(value.currency),
    cost: value?.cost,
    note: value?.note,
    action: [{ type: 'delete' }],
  }
}

export const convertPayloadRevenue = (value: any) => {
  return {
    currencyId: value.currency.id,
    divisionId: value.division.id,
    status: value.status?.id ?? '',
    date: moment(value.date).valueOf(),
    note: value?.note,
    actualRevenue: value?.actualRevenue,
    expectedRevenue: value?.expectedRevenue,
    rate: value?.rate,
  }
}
export const convertOptionItem = (option: any) => {
  return {
    id: option?.id,
    label: option?.label,
    value: option.value,
    disabled: false,
  }
}
export const convertProjectGeneralDataFromApi = (
  data: any
): IGeneralProjectState => {
  return {
    id: data.id,
    code: data.code,
    branchId: data.branch.id,
    customer: data.customer
      ? {
          ...data.customer,
          label: data.customer?.name,
          value: data.customer?.id,
        }
      : {},
    divisions: formatToOptionItem(data.divisions, {
      keyValue: 'divisionId',
    }),
    manager:
      data.projectManagers === null
        ? []
        : formatToOptionItem(data.projectManagers),
    name: data.name,
    note: data.note ?? '',
    partner: formatToOptionItem(data.partner),
    status: data.status.id,
    technologies: formatToOptionItem(data.technologies, {
      keyValue: 'skillSetId',
    }),
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    type: data.type.id,
    totalContract: data.initMonthHeadcount
      ? String(data.initMonthHeadcount)
      : '',
    totalRevenue: data.totalProjectRevenue
      ? String(data.totalProjectRevenue)
      : '',
    revenueCurrency: data.currency ? data.currency.id : '',
    revenueRate: data.revenueRate ? String(data.revenueRate) : '',
    noteType: data.noteType ?? '',
    initMonthHeadcount: data.initMonthHeadcount
      ? String(data.initMonthHeadcount)
      : '',
    description: data.description ?? '',
    workChannelLink: data.workChannelLink || '',
    contractIds: data.contractIds ?? [],
  }
}

export const convertPayloadGeneral = (data: any) => ({
  id: data.id ?? null,
  name: data.name,
  branchId: data.branchId,
  divisionIds: data.divisions.map((item: any) => item.value),
  technologyIds: data.technologies.map((item: any) => item.value),
  partnerIds: data.partner.map((item: any) => item.value),
  startDate: data.startDate ? data.startDate.getTime() : null,
  endDate: data.endDate ? data.endDate.getTime() : null,
  customerId: data.customer.id,
  type: data.type,
  status: data.status,
  projectManagers: data.manager.map((item: any) => item.value),
  totalContractHeadcount: data.totalContract,
  note: data.note,
  totalProjectRevenue: data.totalRevenue,
  currencyId: !!data.revenueCurrency ? data.revenueCurrency : null,
  revenueRate: data.revenueRate,
  code: data.code,
  noteType: data.noteType,
  initMonthHeadcount: data.totalContract,
  description: data.description,
  workChannelLink: data.workChannelLink || '',
  contractIds: data.contractIds.map((item: OptionItem) => item.value),
})

export const convertHeadcountRequest = (headcount: any) => ({
  ...headcount,
  type: headcount?.type?.id || CONTRACT_HEADCOUNT_TYPE,
})

export const convertPayloadAssignStaff = (value: any) => {
  return {
    endDate: moment(value.assignEndDate).valueOf(),
    startDate: moment(value.assignStartDate).valueOf(),
    headcount: value.projectHeadcount,
    staffId: value.staffId,
    role: value.role,
  }
}

export const getPercentColor = (percent: number) => {
  if (typeof percent !== 'number') return '#000'
  if (percent < 90) {
    return '#FF2719'
  } else if (percent <= 110) {
    return '#66BB6A'
  } else {
    return '#FADB61'
  }
}

export const getDateFromDayOfYear = (year: number, day: number) => {
  if (isNaN(year) || isNaN(day)) {
    return null
  } else {
    return new Date(Date.UTC(year, 0, day))
  }
}

export const convertDataRevenue = (
  value: IProjectRevenue
): IProjectRevenue => ({
  id: uuid(),
  no: 0,
  actualRevenue: value?.actualRevenue,
  expectedRevenue: value?.expectedRevenue,
  date: value.date,
  division: value.division,
  status: value.status,
  rate: value.rate,
  note: value.note,
  currency: value.currency,
  action: [{ type: 'delete' }],
})

export const downloadFileFromByteArr = ({
  fileName,
  fileContent,
}: {
  fileName?: string
  fileContent?: string
}) => {
  const byte = base64ToArrayBuffer(fileContent ?? '')
  const blob = new Blob([byte], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = fileName ?? ''
  link.click()
}
