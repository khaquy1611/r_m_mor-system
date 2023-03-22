import { OptionItem } from '@/types'

export interface ListStaffParams {
  branchId: string
  divisionIds: OptionItem[]
  startDate: null | Date
  endDate: null | Date
  jobType: string
  keyword: string
  orderBy: 'desc' | 'asc' | 'latest'
  sortBy: string
  status: string | number
  pageNum: number
  pageSize: number
  skillsId: any
  positionIds: any
}

export interface DeleteStaffPayload {
  code: string
  id: string
}
