import ApiClientWithToken, { ApiClientFormFile } from '@/api/api'
import { cleanObject, queryStringParam } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import QueryString from 'query-string'
import { UpdateSkillSetStaffDetail, StaffQueriesDashboard } from '../types'

export default {
  getListStaff(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/staffs${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getSkillSets(payload: any) {
    const queryString = queryStringParam(payload.params)
    const url = `/staffs/${payload.staffId}/skillset${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getContracts(payload: any) {
    const queryString = queryStringParam(payload.queries)
    const url = `/staffs/${payload.staffId}/contract${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getCertificates(payload: any) {
    const queryString = queryStringParam(payload.queries)
    const url = `/staffs/${payload.staffId}/certificate${
      queryString ? `?${queryString}` : ''
    }`

    return ApiClientWithToken.get(url)
  },

  getSkillSet(payload: any) {
    const url = `/staffs/${payload.staffId}/skillset/${payload.skillId}`
    return ApiClientWithToken.get(url)
  },
  createNewStaff(payload: any) {
    return ApiClientFormFile.post(`/staffs`, payload)
  },
  createSkillSet(payload: any) {
    return ApiClientWithToken.post(
      `/staffs/${payload.staffId}/skillset`,
      payload.data
    )
  },
  createContract(payload: any) {
    return ApiClientFormFile.post(
      `/staffs/${payload.staffId}/contract`,
      payload.data
    )
  },
  createCertificate(payload: any) {
    return ApiClientFormFile.post(
      `/staffs/${payload.staffId}/certificate`,
      payload.data
    )
  },
  updateSkillSet(payload: any) {
    return ApiClientWithToken.put(
      `/staffs/${payload.staffId}/skillset/${payload.skillId}`,
      payload.data
    )
  },
  deleteSkillSet(payload: any) {
    return ApiClientWithToken.delete(
      `/staffs/${payload.staffId}/skillset/${payload.skillId}`
    )
  },

  updateStaffGeneralInfo(payload: any) {
    return ApiClientFormFile.put(`/staffs/${payload.id}`, payload.formData)
  },

  getDetailStaff(id: string) {
    return ApiClientWithToken.get(`/staffs/${id}`)
  },
  deleteStaff(id: string) {
    return ApiClientWithToken.delete(`/staffs/${id}`)
  },
  getStaffProject(payload: {
    staffId: string
    pageNum: number
    pageSize: number
  }) {
    const queryString = QueryString.stringify(cleanObject(payload))
    const url = `/staffs/${payload.staffId}/project${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },
  getStaffHeadcountUsed({ staffId, year }: StaffHeadcountUsedType) {
    return ApiClientWithToken.get(`/staffs/${staffId}/headcount-used/${year}`)
  },
  getDashboardStaff(queries: StaffQueriesDashboard) {
    const queryString = queryStringParam(queries)
    const url = `/dashboards/staff${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  exportStaffSkillSet({
    staffId,
    requestBody,
  }: {
    staffId: string
    requestBody: any
  }) {
    return ApiClientWithToken.post(`/staffs/${staffId}/export`, requestBody)
  },
  updateSkillSetStaffDetail({
    staffId,
    requestBody,
  }: {
    staffId: string
    requestBody: UpdateSkillSetStaffDetail[]
  }) {
    return ApiClientWithToken.put(`/staffs/${staffId}/skillset`, requestBody)
  },

  downloadImage(payload: any) {
    const queryString = queryStringParam(payload)
    const url = `/support/download/${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
}

export type StaffHeadcountUsedType = {
  staffId: string
  year: string
}
