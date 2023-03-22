import ApiClientWithToken from '@/api/api'
import { IParamsGrade } from '@/modules/staff/types'
import { IQueries } from '@/types'
import { cleanObject, queryStringParam } from '@/utils'
import { AxiosRequestConfig } from 'axios'

export default {
  getBranchList({ useAllBranches }: { useAllBranches: boolean }) {
    return ApiClientWithToken.get(
      useAllBranches ? '/master/all-branches' : '/master/branches'
    )
  },
  getBranchDashboardList() {
    return ApiClientWithToken.get('/master/dashboard/branches')
  },
  getContractGroups() {
    return ApiClientWithToken.get('/master/contract-group')
  },
  getContractTypes() {
    return ApiClientWithToken.get('/master/contract-type')
  },
  getDivisions() {
    return ApiClientWithToken.get(`/master/divisions`)
  },
  getDivisionsDashboard() {
    return ApiClientWithToken.get(`/master/dashboard/divisions`)
  },
  getDivisionsByProject() {
    return ApiClientWithToken.get(`master/all-divisions-by-project`)
  },
  getPriorities() {
    return ApiClientWithToken.get('/master/priorities')
  },
  getSkillSets() {
    return ApiClientWithToken.get('/master/skill-sets')
  },
  getStatus() {
    return ApiClientWithToken.get('/master/status')
  },
  getPositions() {
    return ApiClientWithToken.get('/master/positions')
  },
  getMarkets() {
    return ApiClientWithToken.get('/master/markets')
  },
  getCurrencies() {
    return ApiClientWithToken.get('/master/currency')
  },
  getProvinces() {
    return ApiClientWithToken.get('/master/provinces')
  },
  getGrades(params: IParamsGrade) {
    const queryString = queryStringParam(params)
    const url = `/master/grades${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getLeaderGrades(params: IParamsGrade) {
    const queryString = queryStringParam(params)
    const url = `/master/leader_grades${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getStaffContactPerson() {
    return ApiClientWithToken.get('/master/contact-person')
  },
  sendFeedback(payload: any) {
    return ApiClientWithToken.post('/support/feedback', payload)
  },
  getCommonStaffs(params: any, config: AxiosRequestConfig) {
    const queryString = queryStringParam(params)
    const url = `/master/staffs${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  getCommonPartners(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/partners${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getCommonCustomers(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/customers${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getProjectManagers(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/project-manager${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getDirectManager(params: any) {
    const queryString = queryStringParam(params)
    const url = `/master/direct-manager${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url)
  },
  getProjectTypes() {
    return ApiClientWithToken.get('/master/project-type')
  },
  getProjectStaffs(staffId: number) {
    return ApiClientWithToken.get(`/master/project-staff?staffId=${staffId}`)
  },
  getProjectManagerStaffs(staffId: string | number) {
    return ApiClientWithToken.get(
      `/master/project-manager/staffs?staffId=${staffId}`
    )
  },
  getContractCodes({
    customerId,
    projectId,
  }: {
    customerId: string | number
    projectId: string | number
  }) {
    return ApiClientWithToken.get(`/master/customer/${customerId}/contracts`, {
      params: cleanObject({
        projectId,
      }),
    })
  },
  getContractByContractGroup(contractGroup: number | string) {
    const url = `/master/contract/${contractGroup}`
    return ApiClientWithToken.get(url)
  },
  deleteFile(id: string) {
    return ApiClientWithToken.delete(`/support/delete-file/${id}`)
  },
  getNotificationsForUser(queries: IQueries) {
    return ApiClientWithToken.get(`/notifications`, {
      params: cleanObject(queries),
    })
  },
  getNumberOfNotification() {
    return ApiClientWithToken.get(`/notifications/number`)
  },
  readNotify(id:string|number) {
    return ApiClientWithToken.put(`/notifications/${id}`)
  },
}
