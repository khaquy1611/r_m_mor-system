import { IContractResponse } from '@/modules/customer/types'
import { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'
import { CancelTokenSource } from 'axios'
import { contractQueryParameters, CONTRACT_STEP } from '../const'
import {
  getContractGeneralInformation,
  getContractStaffInformation,
  getContractUploadDocuments,
  getListContracts,
} from './thunk'
import {
  ContractStaffInformationRequest,
  IListContractsParams,
  ProjectContractInformation,
  RelatedContract,
} from '../models'
import { IFileUpload, OptionItem } from '@/types'
import { fillContractGeneralInformation } from '../utils'
import { isEmpty } from 'lodash'

export interface IContractState {
  activeStep: number
  listContracts: any[]
  total: number
  stateContracts: IContractResponse[]
  isListFetching: boolean
  cancelGetContractList: CancelTokenSource | null
  contractQueryParameters: IListContractsParams
  documents: any[]
  staffList: ContractStaffInformationRequest[]
  totalDocs: 0
  generalInfo: any
  relatedContracts: RelatedContract[]
  projectInfo: ProjectContractInformation
}

const initialState: IContractState = {
  activeStep: CONTRACT_STEP.GENERAL_INFORMATION,
  listContracts: [],
  total: 0,
  stateContracts: [],
  isListFetching: false,
  cancelGetContractList: null,
  contractQueryParameters: structuredClone(contractQueryParameters),
  documents: [],
  staffList: [],
  totalDocs: 0,
  generalInfo: {},
  relatedContracts: [],
  projectInfo: {}
}

export const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setActiveStep(state, { payload }) {
      state.activeStep = payload
    },
    setDocuments(state, action) {
      state.documents = action.payload
    },
    setStateContracts(state, { payload }) {
      state.stateContracts = payload
    },
    setCancelGetContractList(state, { payload }) {
      state.cancelGetContractList = payload
    },
    setContractQueryParameters(state, { payload }) {
      state.contractQueryParameters = payload
    },
    setStaffList(state, { payload }) {
      state.staffList = payload
    },
    setGeneralInfo(state, { payload }) {
      state.generalInfo = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getListContracts.pending, state => {
      state.isListFetching = true
      if (state.cancelGetContractList) {
        state.cancelGetContractList.cancel()
      }
    })
    builder.addCase(getListContracts.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      state.listContracts = payload.data.content
      state.total = payload.data.totalElements
    })
    builder.addCase(getListContracts.rejected, state => {
      state.isListFetching = false
    })
    builder.addCase(
      getContractGeneralInformation.fulfilled,
      (state, { payload }) => {
        state.isListFetching = false
        const { data } = payload
        if (!isEmpty(data?.general)) {
          state.generalInfo = fillContractGeneralInformation(data?.general)
          state.relatedContracts = data?.relatedContracts ?? []
          state.projectInfo = data?.project ?? {}
        }
      }
    )
    builder.addCase(getContractGeneralInformation.rejected, state => {
      state.isListFetching = false
    })
    builder.addCase(
      getContractStaffInformation.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        if (data) {
          state.staffList = data.map((staff: any) => ({
            id: staff.id.toString(),
            levelName: staff.level,
            positionName: staff.positionName,
            rate: staff.rate || '',
            note: staff.note || '',
            staffId: staff.staffId,
            unitOfTime: staff.unitOfTime.id,
            staffName: staff.staffName,
            sourceStaff: staff.sourceStaff.id,
            skillIds: staff.skillSets.map((skill: OptionItem) => ({
              id: skill.id,
              label: skill.name,
              value: skill.id,
            })),
          }))
        }
      }
    )
    builder.addCase(
      getContractUploadDocuments.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        if (data) {
          state.documents = data.content.map(
            (value: IFileUpload): IFileUpload => ({
              file: null,
              status: 'success',
              loading: 100,
              filename: value.filename,
              lastUpdate: value.uploadDate || 0,
              id: value.id,
              size: value.size,
              type: value.type,
              url: value.url,
            })
          )
          state.totalDocs = data.totalElements
        }
      }
    )
  },
})

export const {
  setActiveStep,
  setCancelGetContractList,
  setStateContracts,
  setContractQueryParameters,
  setDocuments,
  setStaffList,
  setGeneralInfo,
} = contractSlice.actions
export const contractSelector = (state: RootState) => state['contract']

export default contractSlice.reducer
