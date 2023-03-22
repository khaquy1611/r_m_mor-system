import { HttpStatusCode } from '@/api/types'
import { RootState } from '@/store'
import { createSlice } from '@reduxjs/toolkit'
import { uniqBy } from 'lodash'
import { SkillSetListItem } from '../components/ModalExportSkillSets/ModalExportSkillSets'
import {
  GENERAL_INFO_STAFF_INIT,
  initialFiltersDashboard,
  staffQueryParameters,
  STAFF_STEP,
} from '../const'
import { StaffState } from '../types'
import {
  formatResponseContracts,
  formatResponseGeneralInfoStaff,
  formatResponseSkillSet,
} from '../utils'
import {
  downLoadImageUrl,
  getCertificates,
  getContracts,
  getDashboardStaff,
  getDetailStaff,
  getListStaff,
  getSkillSets,
  getStaffHeadcountUsed,
  getStaffProject,
} from './thunk'

interface SkillSetRes {
  id: number
  level: string
  note: string
  yearsOfExperience: number
  skillGroup: {
    id: number
    name: string
  }
  skillName: {
    id: number
    name: string
  }
}

export const refactorSkillSetList = (
  dataContentApi: SkillSetRes[]
): SkillSetListItem[] => {
  const result: SkillSetListItem[] = []
  const skillGroupIds: {
    id: number
    name: string
  }[] = uniqBy(
    dataContentApi.map((item: SkillSetRes) => ({
      id: item.skillGroup.id,
      name: item.skillGroup.name,
    })),
    'id'
  )
  skillGroupIds.forEach((skillGroup: { id: number; name: string }) => {
    result.push({
      id: skillGroup.id.toString(),
      skillGroupName: skillGroup.name,
      skillSetLevels: dataContentApi
        .filter((item: SkillSetRes) => item.skillGroup.id === skillGroup.id)
        .map((item: SkillSetRes) => ({
          id: item.skillName.id.toString(),
          level: item.level,
          skillName: item.skillName.name,
          yearOfExperience: item.yearsOfExperience.toString(),
          note: item.note,
        })),
    })
  })
  return result.reverse()
}

const initialState: StaffState = {
  staffList: [],
  skillSetStaffs: [],
  totalElementsStaff: 0,
  contracts: [],
  certificates: [],
  total: 0,
  totalElementsContract: 0,
  totalElementsCertificate: 0,
  activeStep: STAFF_STEP.GENERAL_INFORMATION,
  oldActiveStep: STAFF_STEP.GENERAL_INFORMATION,
  isRollbackGeneralStep: false,
  generalInfoStaff: GENERAL_INFO_STAFF_INIT,
  staffProject: {
    total: 0,
    data: [],
  },
  staffHeadcounts: {
    monthly: [],
    actual: [],
  },
  skillSetList: [],
  filterDashBoard: initialFiltersDashboard,
  staffDashboardStatisticPosition: {},
  staffDashboardStatisticStatus: {},
  staffDashboardComparison: {},
  staffDashboardIdealStatsSE: [],
  staffDashboardIdealStatsQC: [],
  staffDashboardOnboardStatistic: {},
  staffDashboardTurnoverRate: 0,
  isListFetching: false,
  cancelGetStaffList: null,
  staffQueryParameters: structuredClone(staffQueryParameters),
  fileContent: '',
  fileName: '',
}

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaffs(state, action) {
      state.staffList = action.payload
    },
    setFilterDashBoard(state, action) {
      state.filterDashBoard = action.payload
    },
    setSkillSetStaffs(state, action) {
      state.skillSetStaffs = action.payload
    },
    setSkillSetList(state, action) {
      state.skillSetList = action.payload
    },
    setContracts(state, action) {
      state.contracts = action.payload
    },
    setCertificates(state, action) {
      state.certificates = action.payload
    },
    setGeneralInfoStaff(state, action) {
      state.generalInfoStaff = action.payload
    },
    setActiveStep(state, action) {
      if (
        action.payload === STAFF_STEP.GENERAL_INFORMATION &&
        state.activeStep === STAFF_STEP.SKILL_SET
      ) {
        state.isRollbackGeneralStep = true
      }
      state.oldActiveStep = state.activeStep
      state.activeStep = action.payload
    },
    resetFormStaff(state, action) {
      state.activeStep = STAFF_STEP.GENERAL_INFORMATION
      state.generalInfoStaff = GENERAL_INFO_STAFF_INIT
      state.skillSetStaffs = []
      state.certificates = []
      state.contracts = []
      state.skillSetList = []
    },
    setCancelGetStaffList(state, { payload }) {
      state.cancelGetStaffList = payload
    },
    setStaffQueryParameters(state, { payload }) {
      state.staffQueryParameters = payload
    },
  },
  extraReducers: builder => {
    // getListStaff
    builder.addCase(getListStaff.pending, (state, _) => {
      state.isListFetching = true
      if (state.cancelGetStaffList) {
        state.cancelGetStaffList.cancel()
      }
    })
    builder.addCase(getListStaff.fulfilled, (state, { payload }) => {
      state.isListFetching = false
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffList = data.content
        state.total = data.totalElements
      }
    })
    builder.addCase(getListStaff.rejected, (state, _) => {
      setTimeout(() => {
        state.isListFetching = false
      })
    })
    // getStaffDetail
    builder.addCase(getDetailStaff.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.generalInfoStaff = formatResponseGeneralInfoStaff(data.general)
      }
    })
    //get skillSet
    builder.addCase(getSkillSets.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.skillSetList = refactorSkillSetList(data.content || [])
        state.skillSetStaffs = data.content.map(formatResponseSkillSet)
        state.totalElementsStaff = data.totalElements
      }
    })
    builder.addCase(getContracts.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.contracts = data.content.map(formatResponseContracts)
        state.totalElementsContract = data.totalElements
      }
    })

    builder.addCase(getCertificates.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.certificates = data.content.map(formatResponseContracts)
        state.totalElementsCertificate = data.totalElements
      }
    })
    builder.addCase(getStaffProject.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffProject = {
          total: data.totalElements || 0,
          data: data.content || [],
        }
      }
    })
    builder.addCase(getStaffHeadcountUsed.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffHeadcounts.monthly = data?.headcountUsedByMonth ?? []
        state.staffHeadcounts.actual = data?.actualEffort ?? []
      }
    })
    builder.addCase(getDashboardStaff.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.staffDashboardStatisticPosition = data.statisticsByType.POSITION
        state.staffDashboardStatisticStatus = data.statisticsByType.STATUS
        state.staffDashboardComparison = data.comparison
        state.staffDashboardIdealStatsSE = data.idealStats.SOFTWARE_ENGINEER
        state.staffDashboardIdealStatsQC = data.idealStats.QUALITY_CONTROL
        state.staffDashboardOnboardStatistic = data.onboardStatistic
        state.staffDashboardTurnoverRate = data.turnoverRate
      }
    })
    builder.addCase(downLoadImageUrl.fulfilled, (state, { payload }) => {
      let { data, status } = payload
      if (status === HttpStatusCode.OK) {
        state.fileContent = data?.fileContent ?? ''
        state.fileName = data?.fileName ?? ''
      }
    })
  },
})

export const {
  setStaffs,
  setSkillSetStaffs,
  setGeneralInfoStaff,
  setActiveStep,
  setCertificates,
  setContracts,
  resetFormStaff,
  setSkillSetList,
  setFilterDashBoard,
  setCancelGetStaffList,
  setStaffQueryParameters,
} = staffSlice.actions

export const staffSelector = (state: RootState) => state['staff']

export default staffSlice.reducer
