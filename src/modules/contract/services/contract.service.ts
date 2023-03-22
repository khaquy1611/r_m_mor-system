import ApiClientWithToken, { ApiClientFormFile } from '@/api/api'
import { cleanObject } from '@/utils'
import { AxiosRequestConfig } from 'axios'
import {
  ContractStaffInformationRequest,
  IListContractsParams,
  PayloadContractGeneral,
} from '../models'
import { Pagination } from '@/types'

export default {
  getListContracts(params: IListContractsParams, config: AxiosRequestConfig) {
    const url = `/contracts`
    return ApiClientWithToken.get(url, {
      ...config,
      params: cleanObject(params),
    })
  },

  createContract(formData: any) {
    const url = '/contracts'
    return ApiClientFormFile.post(url, formData)
  },

  getContractGeneralInformation(contractId: string) {
    const url = `/contracts/${contractId}`
    return ApiClientWithToken.get(url)
  },

  getContractStaffInformation(contractId: string) {
    const url = `/contracts/${contractId}/staff`
    return ApiClientWithToken.get(url)
  },

  getContractUploadDocuments(contractId: string, params: Pagination) {
    const url = `/contracts/${contractId}/upload-documents`
    return ApiClientWithToken.get(url, {
      params,
    })
  },

  deleteContractStaff(contractId: string, staffId: string) {
    const url = `/contracts/${contractId}/staff/${staffId}`
    return ApiClientWithToken.delete(url)
  },

  updateContractStaff(payload: {
    contractId: string
    staffId: string
    requestBody: ContractStaffInformationRequest
  }) {
    const url = `/contracts/${payload.contractId}/staff/${payload.staffId}`
    return ApiClientWithToken.put(url, payload.requestBody)
  },

  createContractStaff(payload: {
    contractId: string
    requestBody: ContractStaffInformationRequest
  }) {
    const url = `/contracts/${payload.contractId}/staff`
    return ApiClientWithToken.post(url, payload.requestBody)
  },

  createContractDocuments(payload: { contractId: string; formData: any }) {
    const url = `/contracts/${payload.contractId}/upload-documents`
    return ApiClientFormFile.post(url, payload.formData)
  },

  updateContractGeneralInformation({ id, data }: PayloadContractGeneral) {
    const url = `/contracts/${id}`
    return ApiClientWithToken.put(url, data)
  },
}
