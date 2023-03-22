import {
  IContractDetailPayload,
  ICreateContractPayload,
  ListPartnersParams,
} from '../types'
import QueryString from 'query-string'
import ApiClientWithToken from '@/api/api'
import { PayloadUpdate } from '@/types'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'

export default {
  getListPartners(params: ListPartnersParams, config: AxiosRequestConfig) {
    const queryString = QueryString.stringify(cleanObject(params))
    const url = `/partners${queryString ? `?${queryString}` : ''}`
    return ApiClientWithToken.get(url, config)
  },
  createPartner(requestBody: any) {
    return ApiClientWithToken.post('/partners', requestBody)
  },
  deletePartner(id: string) {
    return ApiClientWithToken.delete(`/partners/${id}`)
  },
  getPartner(id: string) {
    return ApiClientWithToken.get(`/partners/${id}`)
  },
  updatePartner({ id, requestBody }: PayloadUpdate) {
    return ApiClientWithToken.put(`/partners/${id}`, requestBody)
  },

  getContractsByPartnerId(id: string) {
    return ApiClientWithToken.get(`/partners/${id}/contracts`)
  },

  createPartnerContract({ id, data }: ICreateContractPayload) {
    return ApiClientWithToken.post(`/partners/${id}/contracts`, data)
  },

  updatePartnerContract({ id, contractId, data }: IContractDetailPayload) {
    return ApiClientWithToken.put(
      `/partners/${id}/contracts/${contractId}`,
      data
    )
  },

  deletePartnerContract({ id, contractId }: IContractDetailPayload) {
    return ApiClientWithToken.delete(`/partners/${id}/contracts/${contractId}`)
  },
}
