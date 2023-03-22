import ApiClientWithToken from '@/api/api'
import { cleanObject, queryStringParam } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import { ActualEffortQuery } from '../components/HeadCount/ProjectAssignStaff'
import { IListProjectsParams, IProjectGeneralRequest } from '../types'

export default {
  getListProjects(params: IListProjectsParams, config: AxiosRequestConfig) {
    const queryString = queryStringParam(cleanObject(params))
    const url = `/projects${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },

  deleteProject(id: string) {
    return ApiClientWithToken.delete(`/projects/${id}`)
  },

  getProjectDetail(id: string) {
    return ApiClientWithToken.get(`/projects/${id}`)
  },

  createNewProject(payload: any) {
    return ApiClientWithToken.post(`/projects`, payload.data)
  },

  getProjectCosts({ projectId, params }: any) {
    const queryString = queryStringParam(params)
    const url = `/projects/${projectId}/cost${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },

  createProjectCost({ projectId, data }: { projectId: string; data: any }) {
    return ApiClientWithToken.post(`/projects/${projectId}/cost`, data)
  },

  getProjectCostDetail({
    projectId,
    costId,
  }: {
    projectId: string
    costId: string
  }) {
    return ApiClientWithToken.get(`/projects/${projectId}/cost/${costId}`)
  },

  updateProjectCost({ projectId, id, data }: ProjectPayload) {
    return ApiClientWithToken.put(`/projects/${projectId}/cost/${id}`, data)
  },

  deleteProjectCost({ projectId, ids }: any) {
    return ApiClientWithToken.delete(`/projects/${projectId}/cost/${ids}`)
  },

  getProjectGeneral(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/general`)
  },

  updateProjectGeneral({ projectId, data }: PayloadProjectGeneral) {
    return ApiClientWithToken.put(`/projects/${projectId}/general`, data)
  },

  updateProjectHeadcount({ projectId, data }: PayloadProjectHeadcount) {
    return ApiClientWithToken.put(`/projects/${projectId}/headcount`, data)
  },

  deleteProjectHeadcount({ projectId, id, data }: ProjectPayload) {
    return ApiClientWithToken.delete(
      `/projects/${projectId}/headcount/${id}`,
      data
    )
  },

  getListProjectRevenue({ projectId, params }: any) {
    const queryString = queryStringParam(params)
    const url = `/projects/${projectId}/revenue${
      queryString ? `?${queryString}` : ''
    }`
    return ApiClientWithToken.get(url)
  },

  createProjectRevenue({ projectId, data }: { projectId: string; data: any }) {
    return ApiClientWithToken.post(`/projects/${projectId}/revenue`, data)
  },

  getProjectRevenueById({
    projectId,
    revenueId,
  }: {
    projectId: string
    revenueId: string
  }) {
    return ApiClientWithToken.get(`/projects/${projectId}/revenue/${revenueId}`)
  },

  updateProjectRevenue({ projectId, id, data }: ProjectPayload) {
    return ApiClientWithToken.put(`/projects/${projectId}/revenue/${id}`, data)
  },

  deleteProjectRevenue({ projectId, ids }: any) {
    return ApiClientWithToken.delete(`/projects/${projectId}/revenue/${ids}`)
  },

  getProjectHeadcount(projectId: string) {
    return ApiClientWithToken.get(`/projects/${projectId}/headcount`)
  },

  getProjectStaffHeadcount({ projectId, params = {} }: PayloadListProject) {
    const queryString = queryStringParam(params)
    return ApiClientWithToken.get(`/projects/${projectId}/staff?` + queryString)
  },

  createProjectStaffHeadcount({
    projectId,
    data,
  }: PayloadProjectStaffHeadcount) {
    return ApiClientWithToken.post(`/projects/${projectId}/staff`, data)
  },

  getProjectStaffHeadcountById({ projectId, id }: ProjectPayload) {
    return ApiClientWithToken.get(`/projects/${projectId}/staff/${id}`)
  },

  updateProjectStaffHeadcount({
    projectId,
    id,
    data,
  }: PayloadProjectStaffHeadcount) {
    return ApiClientWithToken.put(`/projects/${projectId}/staff/${id}`, data)
  },

  deleteProjectStaffHeadcount({ projectId, id }: ProjectPayload) {
    return ApiClientWithToken.delete(`/projects/${projectId}/staff/${id}`)
  },

  getProjectStatistics(queryString: string) {
    return ApiClientWithToken.get(`/dashboards/project` + queryString)
  },

  getProjectListActualEffort(projectId: string, params: ActualEffortQuery) {
    return ApiClientWithToken.get(
      `/projects/${projectId}/headcount/actual-effort`,
      {
        params: cleanObject(params),
      }
    )
  },
}

export type ProjectPayload = {
  projectId: string
  id: string
  data?: any
}

export type PayloadProjectGeneral = {
  projectId: string
  data: IProjectGeneralRequest
}

export type PayloadProjectHeadcount = {
  projectId: string
  data: Array<{
    headcount: string[] | number[]
    year: string
  }>
}

export type PayloadProjectStaffHeadcount = {
  projectId: string
  id?: string
  data: {
    staffId?: string
    startDate: number
    endDate: number
    headcount: number
  }
}

export type PayloadListProject = {
  params?: IListProjectsParams
  projectId: string
}
