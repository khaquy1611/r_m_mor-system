import ApiClientWithToken from '@/api/api'
import { cleanObject } from '@/utils'
import { IQueriesReportList } from '../pages/DailyReportList'
import {
  IGetDailyReportParams,
  IReportAppRequest,
  IReportDetailParams,
  IReportRequest,
} from '../types'

export default {
  getApplication(params: IQueriesReportList) {
    const url = '/applications'
    return ApiClientWithToken.get(url, {
      params: cleanObject(params),
    })
  },

  getApplicationDetail(id: string | number) {
    return ApiClientWithToken.get(`/applications/${id}`)
  },

  getDailyReports(params: IGetDailyReportParams) {
    return ApiClientWithToken.get('/daily', {
      params: cleanObject(params),
    })
  },

  getDailyReportDetail({ staffId, date }: IReportDetailParams) {
    return ApiClientWithToken.get(`/daily/${staffId}/${date}`)
  },

  createDailyReport(payload: IReportRequest) {
    return ApiClientWithToken.post(`/daily`, payload)
  },

  approveReport(id: string | number, status: 1 | 2 | 3) {
    return ApiClientWithToken.post(
      `/applications/approved/${id}?status=${status}`
    )
  },

  createDailyReportApplication(payload: IReportAppRequest) {
    return ApiClientWithToken.post(`/applications`, payload)
  },

  updateDailyReport(payload: { reportId: string; data: IReportRequest }) {
    return ApiClientWithToken.put(`/daily/${payload.reportId}`, payload.data)
  },

  deleteDailyReport(reportId: string) {
    return ApiClientWithToken.delete(`/daily/${reportId}`)
  },
}
