import { OptionItem } from './../../../types/index'
import { HttpStatusCode } from '@/api/types'
import { projectQueryParameters } from '@/modules/project/const'
import { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import {
  generalInitialState,
  initialStateDashboard,
  PROJECT_STEP,
} from '../const'
import {
  IProjectAssignStaffResponse,
  IProjectDashboard,
  ITotalStaff,
  ProjectState,
} from '../types'
import {
  convertProjectGeneralDataFromApi,
  formatPayloadCost,
  formatPayloadRevenue,
} from '../utils'
import {
  getListProjectRevenueByDivision,
  getListProjectRevenueByProject,
  getListProjects,
  getProjectCostDetail,
  getProjectCosts,
  getProjectDetail,
  getProjectGeneral,
  getProjectHeadcount,
  getProjectRevenueById,
  getProjectStaffHeadcount,
  getProjectStatistics,
} from './thunk'

const initialState: ProjectState = {
  isListFetching: false,
  projectList: [],
  projectsTotalElements: 0,
  activeStep: PROJECT_STEP.GENERAL_INFORMATION,
  oldActiveStep: PROJECT_STEP.GENERAL_INFORMATION,
  generalInfo: generalInitialState,
  generalInfoFormik: generalInitialState,
  contractHeadcount: [],
  assignHeadcounts: [],
  assignStaffs: [],
  contractHeadcountInitial: [],
  projectCosts: [],
  totalProjectCost: 0,
  pageProjectCost: 0,
  totalMoneyCost: 0,
  totalActualRevenue: 0,
  totalExpectedRevenue: 0,
  totalProjectRevenue: 0,
  pageProjectRevenue: 0,
  projectRevenuesByDivision: [],
  projectRevenuesByProject: [],
  projectRevenueDetail: {},
  projectCostDetail: {},
  isHeadCountChange: false,
  isRollbackGeneralChangeDate: false,
  startDate: {
    change: false,
    oldValue: null,
  },
  endDate: {
    change: false,
    oldValue: null,
  },
  isRollbackGeneralStep: false,
  isTotalContractHeadcountChange: false,
  listStepHadFillData: [PROJECT_STEP.GENERAL_INFORMATION],
  dashboardState: initialStateDashboard,
  assignedStaffs: [],
  availableStaffs: [],
  isTotalAssignEffortError: false,
  cancelGetProjectList: null,
  projectQueryParameters: structuredClone(projectQueryParameters),
  assignEfforts: [],
  actualEfforts: [],
  totalStaffAssignment: 0,
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setActiveStep(state, { payload }) {
      //handle Save oldStep
      if (
        payload === PROJECT_STEP.GENERAL_INFORMATION &&
        state.activeStep === PROJECT_STEP.HEAD_COUNT
      ) {
        state.isRollbackGeneralStep = true
      }

      // handle Save list Step had fill data
      const _listStepHadFillData = JSON.parse(
        JSON.stringify(state.listStepHadFillData)
      )
      if (!_listStepHadFillData.includes(payload)) {
        _listStepHadFillData.push(payload)
      }
      // handle setGeneralFormik when unmount component step 1
      if (state.activeStep === PROJECT_STEP.GENERAL_INFORMATION) {
        state.generalInfoFormik = state.generalInfo
      }

      state.listStepHadFillData = _listStepHadFillData
      state.oldActiveStep = state.activeStep
      state.activeStep = payload
    },
    setGeneralInfo(state, action) {
      state.generalInfo = action.payload
    },
    setContractHeadcount(state, action) {
      state.contractHeadcount = action.payload
    },
    setAssignHeadcounts(state, action) {
      state.assignHeadcounts = action.payload
    },
    setAssignStaff(state, action) {
      state.assignStaffs = action.payload
    },
    setProjectCost(state, action) {
      state.projectCosts = action.payload
    },
    setProjectRevenueByProject(state, action) {
      state.projectRevenuesByProject = action.payload
    },
    setProjectRevenueByDivision(state, action) {
      state.projectRevenuesByDivision = action.payload
    },
    resetProjectDataStep(state, action) {
      state.activeStep = PROJECT_STEP.GENERAL_INFORMATION
      state.generalInfo = generalInitialState
      state.generalInfoFormik = generalInitialState
      state.contractHeadcount = []
      state.projectCosts = []
      state.projectRevenuesByProject = []
      state.projectRevenuesByDivision = []
      state.assignStaffs = []
      state.listStepHadFillData = [PROJECT_STEP.GENERAL_INFORMATION]
    },
    setIsHeadcountChange(state, action) {
      state.isHeadCountChange = action.payload
    },
    setIsRollbackGeneralChangeDate(state, action) {
      state.isRollbackGeneralChangeDate = action.payload
    },
    setStartDateChange(state, action) {
      state.startDate = action.payload
    },
    setEndDateChange(state, action) {
      state.endDate = action.payload
    },
    setIsTotalContractHeadcountChange(state, action) {
      state.isTotalContractHeadcountChange = action.payload
    },
    setCancelGetProjectList(state, { payload }) {
      state.cancelGetProjectList = payload
    },
    setProjectQueryParameters(state, { payload }) {
      state.projectQueryParameters = payload
    },
  },
  extraReducers: builder => {
    // getListProjects
    builder.addCase(getListProjects.pending, state => {
      state.isListFetching = true
      if (state.cancelGetProjectList) {
        state.cancelGetProjectList.cancel()
      }
    })
    builder.addCase(getListProjects.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectList = data?.content
        state.projectsTotalElements = data?.totalElements
      }
    })
    builder.addCase(getListProjects.rejected, (state, action) => {
      setTimeout(() => {
        state.isListFetching = false
      })
    })
    // getProjectDetail
    builder.addCase(getProjectDetail.fulfilled, (state, { payload }) => {})
    // getProjectDetailCost
    builder.addCase(getProjectCosts.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectCosts = data.content.map(formatPayloadCost)
        state.totalProjectCost = data.totalElements
        state.pageProjectCost = data.currentPage
        state.totalMoneyCost = data.total
      }
    })
    // getListProjectCostDetail
    builder.addCase(getProjectCostDetail.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectCostDetail = formatPayloadCost(data)
      }
    })
    // getListProjectRevenueByDivision
    builder.addCase(
      getListProjectRevenueByDivision.fulfilled,
      (state, { payload }) => {
        let { data, status } = payload
        if (status === HttpStatusCode.OK) {
          state.projectRevenuesByDivision =
            data.content?.map(formatPayloadRevenue)
          state.totalProjectRevenue = data.totalElements
          state.pageProjectRevenue = data.currentPage
          state.totalActualRevenue = data.totalRevenue?.totalActualRevenue
          state.totalExpectedRevenue = data.totalRevenue?.totalExpectedRevenue
        }
      }
    )
    // getListProjectRevenueByProject
    builder.addCase(
      getListProjectRevenueByProject.fulfilled,
      (state, { payload }) => {
        let { data, status } = payload
        if (status === HttpStatusCode.OK) {
          state.projectRevenuesByProject =
            data.content?.map(formatPayloadRevenue)
          state.totalProjectRevenue = data.totalElements
          state.pageProjectRevenue = data.currentPage
          state.totalActualRevenue = data.totalRevenue?.totalActualRevenue
          state.totalExpectedRevenue = data.totalRevenue?.totalExpectedRevenue
        }
      }
    )
    // getListProjectRevenueDetail
    builder.addCase(getProjectRevenueById.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.projectRevenueDetail = formatPayloadRevenue(data)
      }
    })
    // getListProjectHeadcount
    builder.addCase(getProjectHeadcount.fulfilled, (state, { payload }) => {
      let {
        data: { contractEffort, assignEffort, actualEffort },
      } = payload

      state.contractHeadcount = contractEffort
      state.contractHeadcountInitial = contractEffort
      // reset isHeadcountChange after call api list headcount
      state.isHeadCountChange = false
      state.assignEfforts = assignEffort
      state.actualEfforts = actualEffort
    })
    builder.addCase(getProjectGeneral.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.generalInfo = state.generalInfoFormik =
        convertProjectGeneralDataFromApi(data)

      //reset startDate, endDate change = false
      state.startDate = state.endDate = {
        change: false,
        oldValue: null,
      }
      state.generalInfoFormik.contractIds = data.contracts.map(
        (item: OptionItem) => ({
          ...item,
          value: item.id,
          label: item.code,
        })
      )
    })
    builder.addCase(
      getProjectStaffHeadcount.fulfilled,
      (state, { payload }) => {
        const { data } = payload

        // check total assign effort is calculate is wrong
        let _isTotalAssignEffortError = false
        const _assignStaffs = data.content.map(
          (item: IProjectAssignStaffResponse) => {
            const isErrorStartDate = moment(item.assignStartDate).isBefore(
              state.generalInfo.startDate,
              'day'
            )
            const isErrorEndDate = moment(item.assignEndDate).isAfter(
              state.generalInfo.endDate,
              'day'
            )

            if (isErrorStartDate || isErrorEndDate) {
              _isTotalAssignEffortError = true
            }

            return {
              ...item,
              role: item.role ?? '',
              position: item.position ?? {},
              assignStartDate: item.assignStartDate
                ? new Date(item.assignStartDate)
                : null,
              assignEndDate: item.assignEndDate
                ? new Date(item.assignEndDate)
                : null,
            }
          }
        )

        state.assignStaffs = _assignStaffs
        state.isTotalAssignEffortError = _isTotalAssignEffortError
        state.totalStaffAssignment = data.totalElements
      }
    )
    builder.addCase(getProjectStatistics.fulfilled, (state, { payload }) => {
      const { data }: { data: IProjectDashboard } = payload
      state.dashboardState = data ?? null

      if (!data?.totalStaff?.percentStaff) return
      data?.totalStaff?.percentStaff?.forEach((item: ITotalStaff) => {
        if (item.name === 'Assigned') {
          state.assignedStaffs = item.staffs
        } else if (item.name === 'Available') {
          state.availableStaffs = item.staffs
        }
      })
    })
  },
})

export const {
  setActiveStep,
  setGeneralInfo,
  setAssignStaff,
  setProjectCost,
  setProjectRevenueByDivision,
  setProjectRevenueByProject,
  setContractHeadcount,
  resetProjectDataStep,
  setIsHeadcountChange,
  setIsRollbackGeneralChangeDate,
  setStartDateChange,
  setEndDateChange,
  setIsTotalContractHeadcountChange,
  setAssignHeadcounts,
  setCancelGetProjectList,
  setProjectQueryParameters,
} = projectSlice.actions

export const projectSelector = (state: RootState) => state['project']

export default projectSlice.reducer
