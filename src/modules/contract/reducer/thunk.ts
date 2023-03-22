import { alertSuccess, commonErrorAlert } from '@/reducer/screen'
import { Pagination } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import i18next, { t as i18 } from 'i18next'
import { IListContractsParams, PayloadContractGeneral } from '../models'
import { ContractService } from '../services'
import { setCancelGetContractList } from './contract'

export const getListContracts = createAsyncThunk(
  'contract/getListContracts',
  async (params: IListContractsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetContractList(source))
      const res = await ContractService.getListContracts(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const createContract = createAsyncThunk(
  'contract/createContract',
  async (formData: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await ContractService.createContract(formData)
      dispatch(
        alertSuccess({
          message: i18('contract:MSG_ADD_NEW_CONTRACT_SUCCESS'),
        })
      )
      return res
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const getContractGeneralInformation = createAsyncThunk(
  'contract/getContractGeneralInformation',
  async (contractId: string, { rejectWithValue }) => {
    try {
      const res = await ContractService.getContractGeneralInformation(
        contractId
      )
      return res
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const getContractStaffInformation = createAsyncThunk(
  'contract/getContractStaffInformation',
  async (contractId: string, { rejectWithValue }) => {
    try {
      const res = await ContractService.getContractStaffInformation(contractId)
      return res
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const getContractUploadDocuments = createAsyncThunk(
  'contract/getContractUploadDocuments',
  async (
    payload: {
      contractId: string
      queries: Pagination
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await ContractService.getContractUploadDocuments(
        payload.contractId,
        payload.queries
      )
      return res
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

export const updateContractGeneral = createAsyncThunk(
  'partner/updatePartner',
  async (payload: PayloadContractGeneral, { rejectWithValue, dispatch }) => {
    try {
      const res = await ContractService.updateContractGeneralInformation(
        payload
      )
      dispatch(
        alertSuccess({
          message: i18next.t(
            'contract:MSG_UPDATE_CONTRACT_INFORMATION_SUCCESS',
            {
              contractCodeNumber: payload.data.contractNumber,
            }
          ),
        })
      )
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    }
  }
)
