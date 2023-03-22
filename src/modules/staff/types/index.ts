import { OptionItem } from '@/types'
import { CancelTokenSource } from 'axios'
import { SkillSetListItem } from '../components/ModalExportSkillSets/ModalExportSkillSets'
import { IFileUpload } from '../components/UploadFile'
import { ListStaffParams } from './staff-list'

export interface StaffProject {
  assignEndDate: number
  assignStartDate: number
  code: string
  endDate: number
  startDate: number
  headcount: number
  headcountUsed: number | null
  id: number
  name: string
  description: string | null
  role: string | null
  teamSize: number | null
  technologies: {
    name: string
    note: null | string
    skillSetGroupId: number | string
    skillSetId: number | string
  }[]
}

export interface StaffState {
  staffList: any[]
  generalInfoStaff: IGeneralInformationStaffState
  activeStep: number
  oldActiveStep: number
  isRollbackGeneralStep: boolean
  skillSetStaffs: ISkillSetStaffState[]
  total: number
  totalElementsStaff: number
  contracts: IFileUpload[]
  totalElementsContract: number
  totalElementsCertificate: number
  certificates: any[]
  staffProject: {
    total?: number
    data?: StaffProject[]
  }
  staffHeadcounts: {
    monthly: string[] | number[]
    actual: string[] | number[]
  }
  skillSetList: SkillSetListItem[]
  filterDashBoard: StaffFilterDashboard
  staffDashboardStatisticPosition: any
  staffDashboardStatisticStatus: any
  staffDashboardComparison: any
  staffDashboardIdealStatsSE: any
  staffDashboardIdealStatsQC: any
  staffDashboardOnboardStatistic: any
  staffDashboardTurnoverRate: number
  isListFetching: boolean
  cancelGetStaffList: CancelTokenSource | null
  staffQueryParameters: ListStaffParams
  fileName?: string
  fileContent?: string
}

export interface StaffFilterDashboard {
  branchId: string
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  divisionId: string
}
export interface StaffQueriesDashboard {
  branchId: string
  startDate: number | null | undefined
  endDate: number | null | undefined
  divisionId: string
}
export type StepConfig = {
  step: number
  label: string
}

export type IGeneralInformationStaffState = {
  code?: string
  staffName: string
  gender: string
  birthday: Date | null
  email: string
  directManager: OptionItem
  branchId: string
  divisionId: string
  position: string
  onboardDate: Date | null
  grade: OptionItem
  gradeTitle: OptionItem
  leaderGrade: OptionItem
  leaderGradeTitle: OptionItem
  status: string
  jobType: string
  positionName?: string
  division?: OptionItem
  branch?: OptionItem
  statusName?: string
  jobTypeName?: string
  genderName?: string
  lastWorkingDate?: number | Date
  phoneNumber?: string
}

export type ISkillSetStaffState = {
  id?: string | number
  no?: number
  skillGroup: OptionItem
  skillName: OptionItem
  yearsOfExperience: string
  level: OptionItem
  note: string
  action?: [{ type: 'delete' }]
}

export type IParamsGrade = {
  positionId?: string
  gradeId?: string
}

export type IGeneralInformationStaffResponse = {
  code?: string
  name: string
  gender: string
  dateOfBirth: number
  email: string
  companyBranch: any
  division: any
  position: any
  grade: any
  leaderGrade: any
  directManager: any
  director: any
  onboardDate: number
  status: any
  jobType: any
  lastWorkingDate?: number
  phoneNumber: string
}

export type UpdateSkillSetStaffDetail = {
  skillGroupId: string | number
  skillSetLevels: {
    level: string
    note: string
    skillId: string | number
    yearsOfExperience: string
  }[]
}
