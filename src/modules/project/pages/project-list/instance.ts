import { TableHeaderOption } from '@/types'

export const projectListHeadCells: TableHeaderOption[] = [
  {
    id: 'id',
    align: 'left',
    disablePadding: true,
    label: 'Project ID',
    checked: false,
  },
  {
    id: 'projectName',
    align: 'left',
    disablePadding: true,
    label: 'Project Name',
    checked: false,
  },
  {
    id: 'projectType',
    align: 'left',
    disablePadding: true,
    label: 'Project Type',
    checked: false,
  },
  {
    id: 'responsibleBranch',
    align: 'left',
    disablePadding: true,
    label: 'Responsible Branch',
    checked: false,
  },
  {
    id: 'participateDivision',
    align: 'left',
    disablePadding: true,
    label: 'Participate Division',
    checked: false,
  },
  {
    id: 'technology',
    align: 'center',
    disablePadding: true,
    label: 'Technology',
    checked: false,
  },
  {
    id: 'projectStartDate',
    align: 'center',
    disablePadding: true,
    label: 'Project Start Date',
    checked: false,
  },
  {
    id: 'projectEndDate',
    align: 'center',
    disablePadding: true,
    label: 'Project End Date',
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

export const headerAssignStaffData: TableHeaderOption[] = [
  {
    id: 'id',
    align: 'left',
    disablePadding: true,
    label: 'Staff ID',
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Staff Name',
  },
  {
    id: 'branch',
    align: 'left',
    disablePadding: true,
    label: 'Branch',
  },
  {
    id: 'divisions',
    align: 'left',
    disablePadding: true,
    label: 'Division',
  },
  {
    id: 'headcountUsed',
    align: 'left',
    disablePadding: true,
    label: 'Headcount Used',
  },
  {
    id: 'assignStartDate',
    align: 'left',
    disablePadding: true,
    label: 'Assign Start Date',
  },
  {
    id: 'assignEndDate',
    align: 'left',
    disablePadding: true,
    label: 'Assign End Date',
  },
  {
    id: 'projectHeadcount',
    align: 'left',
    disablePadding: true,
    label: 'Project Headcount',
  },
  {
    id: 'action',
    align: 'center',
    disablePadding: true,
    label: 'Action',
  },
]

export const headCellProjectRevenueByProject: TableHeaderOption[] = [
  {
    id: 'no',
    align: 'center',
    disablePadding: true,
    label: 'Code',
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'expectedRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Expected Revenue',
  },
  {
    id: 'actualRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Actual Revenue',
  },
  {
    id: 'currency',
    align: 'left',
    disablePadding: true,
    label: 'Currency',
  },
  {
    id: 'rate',
    align: 'left',
    disablePadding: true,
    label: 'Rate',
  },
  {
    id: 'statusRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Revenue Status',
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

export const headCellProjectRevenueByDivision: TableHeaderOption[] = [
  {
    id: 'no',
    align: 'center',
    disablePadding: true,
    label: 'Code',
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'division',
    align: 'left',
    disablePadding: true,
    label: 'Division',
  },
  {
    id: 'expectedRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Expected Revenue',
  },
  {
    id: 'actualRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Actual Revenue',
  },
  {
    id: 'currency',
    align: 'left',
    disablePadding: true,
    label: 'Currency',
  },
  {
    id: 'rate',
    align: 'left',
    disablePadding: true,
    label: 'Rate',
  },
  {
    id: 'statusRevenue',
    align: 'left',
    disablePadding: true,
    label: 'Revenue Status',
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

export const headCellProjectCost: TableHeaderOption[] = [
  {
    id: 'no',
    align: 'center',
    disablePadding: true,
    label: 'Code',
  },
  {
    id: 'date',
    align: 'left',
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'costOrigin',
    align: 'left',
    disablePadding: true,
    label: 'Cost Origin',
  },
  {
    id: 'source',
    align: 'left',
    disablePadding: true,
    label: 'Source',
  },
  {
    id: 'cost',
    align: 'left',
    disablePadding: true,
    label: 'Cost',
  },
  {
    id: 'currency',
    align: 'left',
    disablePadding: true,
    label: 'Currency',
  },
  {
    id: 'rate',
    align: 'left',
    disablePadding: true,
    label: 'Rate',
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

export const listCostOrigin = [
  {
    id: '1',
    label: 'Division',
    value: '1',
    disabled: false,
  },
  {
    id: '2',
    label: 'Partner',
    value: '2',
    disabled: false,
  },
]
export const listSource = [
  {
    id: 'partner1',
    label: 'partner1',
    value: 'partner1',
    disabled: false,
  },
  {
    id: 'division2',
    label: 'division2',
    value: 'division2',
    disabled: false,
  },
]
export const listCurrency = [
  {
    id: '1',
    label: 'VND',
    value: 'vnd',
    disabled: false,
  },
  {
    id: '2',
    label: 'YEN',
    value: 'YEN',
    disabled: false,
  },
  {
    id: '3',
    label: 'USD',
    value: 'USD',
    disabled: false,
  },
]
