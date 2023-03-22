import {
  Branch,
  Division,
  IDivision,
  IPosition,
  ISkillSet,
  MasterCommonType,
  OptionItem,
} from '@/types'
import { CancelTokenSource } from 'axios'
import { IProjectCost } from '../components/ModalAddCost'
import { IProjectRevenue } from '../components/ModalAddRevenue'

export type IListProjectsParams = {
  branchId?: string
  divisionIds?: any
  divisions?: any
  keyword?: string
  pageNum?: number
  pageSize?: number
  startDateFrom?: null | Date
  startDateTo?: null | Date
  endDateFrom?: null | Date
  endDateTo?: null | Date
  technologyIds?: any
  type?: string
  year?: number | Date
  divisionId?: string
  customerId?: any
  sortBy?: string
  orderBy?: 'desc' | 'asc'
}

export interface ProjectState {
  projectList: any[]
  projectsTotalElements: number
  activeStep: number
  generalInfo: IGeneralProjectState
  generalInfoFormik: IGeneralProjectState
  contractHeadcount: IContractHeadCountResponse[]
  assignHeadcounts: IAssignHeadCountResponse[]
  assignStaffs: IAssignStaffState[]
  contractHeadcountInitial: IContractHeadCountRequest[]
  projectCosts: IProjectCost[]
  projectRevenuesByDivision: IProjectRevenue[]
  projectRevenuesByProject: IProjectRevenue[]
  totalProjectCost: number
  pageProjectCost: number
  totalProjectRevenue: number
  pageProjectRevenue: number
  totalMoneyCost: number
  totalActualRevenue: number | string
  totalExpectedRevenue: number | string
  projectRevenueDetail: any
  projectCostDetail: any
  isHeadCountChange: boolean
  isRollbackGeneralChangeDate: boolean
  startDate: IDateState
  endDate: IDateState
  oldActiveStep: number
  isRollbackGeneralStep: boolean
  isTotalContractHeadcountChange: boolean
  listStepHadFillData: number[]
  dashboardState: IProjectDashboard
  assignedStaffs: IStaffDashboard[]
  availableStaffs: IStaffDashboard[]
  isTotalAssignEffortError: boolean
  isListFetching: boolean
  cancelGetProjectList: CancelTokenSource | null
  projectQueryParameters: IListProjectsParams
  assignEfforts: IAssignHeadCountResponse[]
  actualEfforts: IAssignHeadCountResponse[]
  totalStaffAssignment: number
}

export interface IStatus {
  status: string
  label: string
  type?: number
}

export interface IGeneralProjectResponse {
  branch: Branch
  customer: MasterCommonType
  divisions: IDivision[]
  endDate: Date | null
  id: string
  manager: string
  name: string
  note: string
  partner: MasterCommonType[]
  startDate: Date | null
  status: MasterCommonType
  technologies: ISkillSet[]
  type: string
}

export interface IGeneralProjectState {
  code?: string
  branchId: string
  customer: OptionItem
  divisions: OptionItem[]
  endDate: Date | null
  manager: OptionItem[]
  id?: string
  name: string
  note: string
  partner: OptionItem[]
  startDate: Date | null
  status: string
  technologies: OptionItem[]
  type: string
  totalContract: string
  totalRevenue: string
  revenueCurrency: string
  revenueRate: string
  noteType?: string
  initMonthHeadcount: string
  description: string
  workChannelLink?: string
  contractIds: OptionItem[]
}

export interface IContractHeadCountRequest {
  headcount: string[] | number[]
  id: string
  type?: string
  year: string
}

export interface IContractHeadCountResponse {
  headcount: string[] | number[] | never[]
  id?: string
  type?: {
    id: string
    name: string
  }
  year: string
}

export interface IAssignHeadCountResponse {
  headcount: string[] | number[] | never[]
  id?: string
  type?: {
    id: string
    name: string
  }
  year: string
}

export interface IProjectGeneralRequest {
  id: string
  code: string
  branchId: string
  currencyId: string
  customerId: string
  divisionIds: string[]
  endDate: number
  projectManagers: string
  name: string
  note: string
  noteType?: string
  partnerIds: string[]
  revenueRate: string | number
  startDate: number
  status: string
  technologyIds: string[]
  totalContractHeadcount: string | number
  totalProjectRevenue: string | number
  type: string | number
}

export interface IDateState {
  change: boolean
  oldValue: Date | null
}

export interface IAssignStaffState {
  id?: string
  staffId: string
  staffName: string
  branch: Branch
  division: IDivision
  position: IPosition
  assignStartDate: Date | null
  assignEndDate: Date | null
  projectHeadcount: number | string
  role: string
  staffCode?: string
  status?: string
}

export interface IStaffDashboard {
  branchName: string
  divisionName: string
  headcount: number
  staffCode: string
  staffId: string
  staffName: string
}

export interface ITotalProject {
  count: number
  percent: number
  status: {
    id: string
    name: String
  }
}

export interface ITotalStaff {
  name: string
  percent: number
  totalStaff: number
  staffs: IStaffDashboard[]
}

export interface IProjectDashboard {
  totalProject: {
    percentStatus: ITotalProject[]
    totalProject: number
  }
  totalStaff: {
    percentStaff: ITotalStaff[]
    totalStaff: number
  }
  health: {
    year: number
    contractEffort: string[]
    percentage: string[]
    staffAvailable: string[]
    totalStaff: string[]
  }
}

export interface IProjectAssignStaffResponse {
  id: number
  staffId: number
  staffCode: string
  staffName: string
  branch: Branch
  division: Division
  assignStartDate: Date | number | null
  assignEndDate: Date | number | null
  projectHeadcount: number
  role: string
  actualEffort: number[]
  position?: any
}
