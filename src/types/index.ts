import { ChangeEvent } from 'react'

export type TypographyStyles = {
  color?: string
  fontSize?: number
  fontWeight?: number
}

export type EventInput = ChangeEvent<HTMLInputElement>

export type LoginFormControls = {
  email: string
  password: string
}

export type LoginFormErrors = {
  emailError: boolean
  passwordError: boolean
}

export type LoginFormMessageErrors = {
  emailErrorMessage: string
  passwordErrorMessage: string
}

export type AlertInfo = {
  title: string
  message: string
  type: string
}

export type TokenApi = {
  accessToken: string
  refreshToken: string
}

export enum StatusBinary {
  TRUE = 1,
  FALSE = 0,
}

export type LoginApiResponse = {
  data: TokenApi
  hasError: boolean
  message: string | null
  status: number
}

export type NavItem = {
  id: number
  label: string
  pathNavigate: string
  pathRoot: string
}

export type OptionItem = {
  id?: number | string
  label?: string
  value?: number | string
  disabled?: boolean
  name?: string
  code?: string
  checked?: boolean
  note?: string
  description?: string
  effortUsedInMonth?: string
}

export type Branch = {
  id: string
  name: string
  note: string
}

export type Permission = {
  id: number
  module: string
  usableFunction: string
}

export type UserPermission = {
  useHomePage?: boolean
  useCustomerCreate?: boolean
  useCustomerDelete?: boolean
  useCustomerDetail?: boolean
  useCustomerList?: boolean
  useCustomerUpdate?: boolean
  usePartnerCreate?: boolean
  usePartnerDelete?: boolean
  usePartnerDetail?: boolean
  usePartnerList?: boolean
  usePartnerUpdate?: boolean
  useProject?: boolean
  useStaff?: boolean
  useProjectList?: boolean
  useProjectDetail?: boolean
  useProjectCreate?: boolean
  useProjectUpdate?: boolean
  useProjectDelete?: boolean
  useStaffList?: boolean
  useStaffDetail?: boolean
  useStaffCreate?: boolean
  useStaffUpdate?: boolean
  useStaffDelete?: boolean
  useCustomerAndPartnerDashboard?: boolean
  useProjectDashboard?: boolean
  useStaffDashboard?: boolean
  useFinanceDashboard?: boolean
  useDailyReportGeneral?: boolean
  useContractCreate?: boolean
  useContractDashboard?: boolean
  useContractDelete?: boolean
  useContractList?: boolean
  useContractUpdate?: boolean
}

export type MasterCommonType = {
  id: number
  name: string
}

export interface IDivision {
  id?: number | string
  branchId: string
  divisionId: string
  name: string
  note: string | null
}

export type DivisionType = {
  branches: Branch
  divisions: IDivision[]
}

export type IDivisionByProjectType = {
  branchId: string
  divisionId: string
  name: string
  note: string
}

export interface ISkillSet {
  name: string
  note: string
  skillSetGroupId: number | string
  skillSetId: number | string
}

export type SkillSet = {
  id: number
  name: string
  note: string
  skillSets: ISkillSet[]
}

export type ErrorResponse = {
  field: string
  message: string
}

export type PayloadUpdate = {
  id: string
  requestBody: any
}

export type CurrencyOptions = {
  style?: string
  currency?: string
}

export type IQueries = {
  pageNum?: number
  pageSize?: number
  sortBy?: string
  orderBy?: 'desc' | 'asc'
}

export type OrderBy = 'desc' | 'asc'
export type CustomerAndPartnerSortBy =
  | 'branchId'
  | 'collaborationStartDate'
  | 'contactName'
  | 'id'
  | 'market'
  | 'name'
  | 'noteStatus'
  | 'priority'
  | 'scale'
  | 'serviceIds '
  | 'latest'

export interface TableShareType {
  headCells: TableHeaderOption[]
  rows: Array<any>
  limitPage?: number
  isShowCheckbox?: boolean
  keyName: keyof TableHeaderOption
  pageCurrent?: number
  selected?: string[]
  childComp: any
  childCompEnd?: any
  childCompNoData?: any
  isShowTotal?: boolean
  doubleFirstCol?: string
  onSelectAllClick?: (
    event: ChangeEvent<HTMLInputElement>,
    newSelected: Array<any>
  ) => void
  onSortChange?: (index: number, orderBy: string | undefined) => void
}

export interface TableHeaderOption {
  id: string
  align: 'center' | 'inherit' | 'justify' | 'left' | 'right'
  disablePadding: boolean
  label: string
  useSort?: boolean
  orderBy?: OrderBy
  sortBy?: string
  render?: Function
  checked?: boolean
}

export interface EnhancedTableProps {
  numSelected?: number
  onSelectAllClick?: (event: ChangeEvent<HTMLInputElement>) => void
  rowCount: number
  headCells: TableHeaderOption[]
  isShowCheckbox?: boolean
  doubleFirstCol?: string
  onSortChange?: (index: number, orderBy: string | undefined) => void
}

export interface IStatus {
  status: string
  label: string
  type?: number
}

export interface IAction {
  type?: 'delete' | 'edit'
}

export interface ItemRowTableProps {
  row: any
  uuId: string
  isItemSelected?: boolean
  onClickItem?: (id: string, row?: any) => void
  onClickDetail?: (id: string, row?: any) => void
  onClickDelete?: (id: string, row: any) => void
  listCell?: any[]
  isShowCheckbox?: boolean
  keyName?: keyof TableHeaderOption
  selected?: string[]
  headCells?: TableHeaderOption[]
  rowClassName?: string
  useClickDetail?: boolean
  useRightClickOpenNewTab?: boolean
  link?: string
}

export type StepConfig = {
  step: number
  label: string
}

export type MarketType = {
  id?: number
  name?: string
  acronym?: string
  note?: string | null
}

export type IPosition = {
  id: string
  name: string
  note: string | null
}

export type PositionType = {
  division: IDivision
  positions: Array<IPosition>
}

export interface DateRange {
  startDate: Date | null | undefined
  endDate: Date | null | undefined
}

export interface Division {
  branchId: string
  divisionId: string
  name: string
  note?: string | null
}

export type CurrencyType = {
  id: number
  name: string
  ratio: number
  code: string
}

export type Province = {
  id: number
  code: string
  name: string
  note: any
  marketId: number
}

export type IStatusConstant = {
  type: number
  label: string
  status: string
}

export interface IProjectManager {
  code: string
  id: number | string
  name: string
  email: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface IProjectStaff extends IProjectManager {}

export interface IStaffInfo {
  code: string
  id: number
  name: string
  branchName: string
  dateOfBirth: string
  directManager: string
  divisionName: string
  email: string
  positionName: string
  positionId: string | number
}

export interface Pagination {
  pageNum: number
  pageSize: number
}

export interface IFileUpload {
  file?: any
  status: 'success' | 'error' | 'loading' | string
  loading: number
  filename: string
  id: string | number
  lastUpdate: number
  uploadDate?: number
  size?: number
  type?: string
  url?: string
  maxFile?: number
  maxSize?: number
}
