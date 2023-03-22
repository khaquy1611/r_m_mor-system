import { OptionItem } from '@/types'
import moment from 'moment'
import { IFileUpload } from '../components/UploadFile'
import {
  IGeneralInformationStaffResponse,
  IGeneralInformationStaffState,
  ISkillSetStaffState,
} from '../types'

export const formatPayloadGeneralInfoStaff = (
  value: IGeneralInformationStaffState
) => ({
  name: value.staffName,
  gender: value.gender,
  dateOfBirth: moment(value.birthday).valueOf(),
  email: value.email?.trim(),
  companyBranchId: value.branchId,
  divisionId: value.divisionId,
  positionId: value.position,
  gradeId: value.gradeTitle.id?.toString(),
  leaderGradeId: value.leaderGradeTitle.id?.toString(),
  directManagerId: value.directManager.id,
  onboardDate: moment(value.onboardDate).valueOf(),
  status: value.status,
  jobType: value.jobType,
  lastWorkingDate: moment(value.lastWorkingDate).valueOf(),
  phoneNumber: value.phoneNumber,
})

export const convertToOptionItem = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.name,
    value: value?.id,
    disabled: false,
    name: value?.name,
  }
}

export const convertGradeToOptionItem = (value: any): OptionItem => {
  return {
    id: value?.grade,
    label: value?.grade,
    value: value?.grade,
    disabled: false,
    name: value?.grade,
  }
}

export const convertSkillSetLevel = (value: any): OptionItem => {
  return {
    id: value,
    label: value,
    value: value,
    disabled: false,
    name: value,
  }
}

export const convertSkillSetGroup = (value: any): OptionItem => {
  return {
    id: value.id,
    label: value.name,
    value: value.id,
    disabled: false,
    name: value,
  }
}

export const convertGradeTitleToOptionItem = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.title,
    value: value?.id,
    disabled: false,
    name: value?.title,
  }
}

export const convertDivision = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.name,
    value: value?.divisionId,
    disabled: false,
    name: value?.name,
  }
}

export const convertBranch = (value: any): OptionItem => {
  return {
    id: value?.id,
    label: value?.name,
    value: value?.id,
    disabled: false,
    name: value?.name,
    note: value?.note,
  }
}

export const formatResponseGeneralInfoStaff = (
  value: IGeneralInformationStaffResponse
): IGeneralInformationStaffState => ({
  code: value?.code ?? '',
  staffName: value.name ?? '',
  gender: value.gender ?? '',
  birthday: value.dateOfBirth ? new Date(value.dateOfBirth) : null,
  email: value.email ?? '',
  branchId: value.companyBranch?.id ?? '',
  divisionId: value.division.divisionId ?? '',
  position: value.position?.id ?? '',
  grade: convertGradeToOptionItem(value.grade),
  gradeTitle: convertGradeTitleToOptionItem(value.grade),
  leaderGrade: convertGradeToOptionItem(value.leaderGrade),
  leaderGradeTitle: convertGradeTitleToOptionItem(value.leaderGrade),
  directManager: value.directManager?.id
    ? convertToOptionItem(value.directManager)
    : {},
  onboardDate: value.onboardDate ? new Date(value?.onboardDate) : null,
  status: value.status?.id ?? '',
  jobType: value.jobType?.id ?? '',
  positionName: value.position?.name ?? '',
  division: convertDivision(value.division),
  branch: convertBranch(value.companyBranch),
  statusName: value.status?.name ?? '',
  jobTypeName: value.jobType?.name ?? '',
  lastWorkingDate: value.lastWorkingDate ? new Date(value.lastWorkingDate) : 0,
  phoneNumber: value.phoneNumber ?? '',
})

export const formatResponseContracts = (value: IFileUpload): IFileUpload => ({
  file: null,
  status: 'success',
  loading: 100,
  filename: value?.filename ?? '',
  lastUpdate: value?.uploadDate ?? 0,
  id: value?.id ?? '',
  size: value?.size ?? 0,
  type: value?.type ?? '',
  url: value?.url ?? '',
})

export const formatResponseSkillSet = (value: any): ISkillSetStaffState => ({
  id: value.id,
  skillGroup: convertSkillSetGroup(value.skillGroup),
  skillName: convertSkillSetGroup(value.skillName),
  yearsOfExperience: value.yearsOfExperience,
  level: convertSkillSetLevel(value.level),
  note: value.note ?? '',
})

export const formatPayloadSkillSet = (value: ISkillSetStaffState) => ({
  skillGroupId: value.skillGroup.id,
  skillId: value.skillName.id,
  yearsOfExperience: value.yearsOfExperience,
  level: value.level.id,
  note: value.note,
})

export const payloadCreateStaff = (payload: any) => {
  let formData = new FormData()
  payload.contract.forEach((item: any) => {
    formData.append('contract', item)
  })
  payload.certificate.forEach((item: any) => {
    formData.append('certificate', item)
  })
  formData.append('requestBody', JSON.stringify(payload.requestBody))
  return formData
}

export const payloadUpdateStaff = (payload: any) => {
  let formData = new FormData()
  payload.certificate.forEach((item: any) => {
    formData.append('certificate', item)
  })
  formData.append('requestBody', JSON.stringify(payload.requestBody))
  if (payload.id) {
    formData.append('id', payload.id)
  }
  return formData
}
