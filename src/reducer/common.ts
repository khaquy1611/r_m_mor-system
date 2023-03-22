import { CONTRACT_GROUP_TYPE, NDA } from '@/modules/contract/const'
import { IParamsGrade } from '@/modules/staff/types'
import CommonService from '@/services/common.service'
import { RootState } from '@/store'
import {
  Branch,
  CurrencyType,
  DivisionType,
  IDivisionByProjectType,
  IProjectManager,
  IProjectStaff,
  IQueries,
  MarketType,
  MasterCommonType,
  OptionItem,
  PositionType,
  SkillSet,
} from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { CancelTokenSource } from 'axios'
import { alertError, alertSuccess } from './screen'
import i18next from 'i18next'

export interface CommonState {
  listBranches: OptionItem[]
  isLoading: boolean
  contractGroups: OptionItem[]
  contractTypes: OptionItem[]
  divisions: DivisionType[]
  divisionByProject: IDivisionByProjectType[]
  priorities: OptionItem[]
  skillSets: SkillSet[]
  listStatus: OptionItem[]
  listPosition: PositionType[]
  listMarket: MarketType[]
  listCurrency: CurrencyType[]
  listProvinces: any
  listGrade: {
    [key: number]: any[]
  }
  leaderGrades: any[]
  staffContactPersons: OptionItem[]
  projectManagers: OptionItem[]
  listCommonCustomers: OptionItem[]
  listCommonPartners: OptionItem[]
  listCommonStaffs: OptionItem[]
  listProjectTypes: OptionItem[]
  listProjectManagers: OptionItem[]
  totalProjectManagers: number
  projectStaffs: OptionItem[]
  cancelGetStaffs: CancelTokenSource | null
  listContractCode: OptionItem[]
  listContractByContractGroup: OptionItem[]
  listDashboardBranches: OptionItem[]
  itemNotify: any
  notificationsForUser: any[]
  numberOfNotification: number
  reCallNotify: boolean
}

const initialState: CommonState = {
  listBranches: [],
  isLoading: false,
  contractGroups: [],
  contractTypes: [],
  divisions: [],
  divisionByProject: [],
  priorities: [],
  skillSets: [],
  listStatus: [],
  listPosition: [],
  listMarket: [],
  listCurrency: [],
  listProvinces: [],
  listGrade: {},
  leaderGrades: [],
  staffContactPersons: [],
  projectManagers: [],
  listCommonCustomers: [],
  listCommonPartners: [],
  listCommonStaffs: [],
  listProjectTypes: [],
  listProjectManagers: [],
  totalProjectManagers: 0,
  projectStaffs: [],
  cancelGetStaffs: null,
  listContractCode: [],
  listContractByContractGroup: [],
  listDashboardBranches: [],
  itemNotify: {},
  notificationsForUser: [],
  numberOfNotification: 0,
  reCallNotify: false,
}

export const deleteFile = createAsyncThunk(
  'common/deleteFile',
  async (payload: any, { rejectWithValue, dispatch }) => {
    try {
      const res = await CommonService.deleteFile(payload.id)
      dispatch(
        alertSuccess({
          message: i18next.t('common:MSG_DELETE_FILE_SUCCESS', {
            fileName: payload.fileName,
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('common:MSG_DELETE_FILE_ERROR'),
        })
      )
      return rejectWithValue(err)
    }
  }
)

export const getBranchList = createAsyncThunk(
  'common/getBranchList',
  async (
    { useAllBranches }: { useAllBranches: boolean },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getBranchList({ useAllBranches })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getBranchDashboardList = createAsyncThunk(
  'common/getBranchDashboardList',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getBranchDashboardList()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractGroups = createAsyncThunk(
  'common/getContractGroups',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getContractGroups()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractTypes = createAsyncThunk(
  'common/getContractTypes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getContractTypes()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisions = createAsyncThunk(
  'common/getDivisions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDivisions()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisionsDashboard = createAsyncThunk(
  'common/getDivisionsDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDivisionsDashboard()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDivisionsByProject = createAsyncThunk(
  'common/getDivisionsByProject',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDivisionsByProject()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getGrades = createAsyncThunk(
  'common/getGrades',
  async (params: IParamsGrade, { rejectWithValue }) => {
    try {
      const res = await CommonService.getGrades(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getLeaderGrades = createAsyncThunk(
  'common/getLeaderGrades',
  async (params: IParamsGrade, { rejectWithValue }) => {
    try {
      const res = await CommonService.getLeaderGrades(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getSkillSets = createAsyncThunk(
  'common/getSkillSets',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getSkillSets()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStatus = createAsyncThunk(
  'common/getStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getStatus()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPriorities = createAsyncThunk(
  'common/getPriorities',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getPriorities()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getPositions = createAsyncThunk(
  'common/getPositions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getPositions()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getMarkets = createAsyncThunk(
  'common/getMarkets',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getMarkets()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCurrencies = createAsyncThunk(
  'common/getCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getCurrencies()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProvinces = createAsyncThunk(
  'common/getProvinces',
  async (_, { rejectWithValue }) => {
    try {
      const res = await await CommonService.getProvinces()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getStaffContactPerson = createAsyncThunk(
  'common/getStaffContactPerson',
  async (_, { rejectWithValue }) => {
    try {
      const res = await await CommonService.getStaffContactPerson()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const sendFeedback = createAsyncThunk(
  'staff/sendFeedback',
  async (value: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.sendFeedback(value)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonCustomers = createAsyncThunk(
  'common/getCommonCustomers',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getCommonCustomers(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonPartners = createAsyncThunk(
  'common/getCommonPartners',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getCommonPartners(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getCommonStaffs = createAsyncThunk(
  'common/getCommonStaffs',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetStaffs(source))
      const res = await CommonService.getCommonStaffs(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectManagerStaffs = createAsyncThunk(
  'common/getProjectManagerStaffs',
  async (staffId: string | number, { rejectWithValue, dispatch }) => {
    try {
      const res = await CommonService.getProjectManagerStaffs(staffId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectTypes = createAsyncThunk(
  'common/getProjectTypes',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CommonService.getProjectTypes()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getDirectManager = createAsyncThunk(
  'common/getDirectManager',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getDirectManager(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectManagers = createAsyncThunk(
  'common/getProjectManagers',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getProjectManagers(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectStaffs = createAsyncThunk(
  'common/getProjectStaffs',
  async (params: number, { rejectWithValue }) => {
    try {
      const res = await CommonService.getProjectStaffs(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractCodes = createAsyncThunk(
  'common/getContractCodes',
  async (
    params: {
      customerId: string | number
      projectId: string | number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await CommonService.getContractCodes(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getContractByContractGroup = createAsyncThunk(
  'common/getContractByContractGroup',
  async (contractGroup: string | number, { rejectWithValue }) => {
    try {
      const res = await CommonService.getContractByContractGroup(contractGroup)
      return { ...res, group: contractGroup }
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getNotificationsForUser = createAsyncThunk(
  'common/getNotificationsForUser',
  async (queries: IQueries, { rejectWithValue }) => {
    try {
      const res = await CommonService.getNotificationsForUser(queries)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getNumberOfNotification = createAsyncThunk(
  'common/getNumberOfNotification',
  async (_: any, { rejectWithValue }) => {
    try {
      const res = await CommonService.getNumberOfNotification()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const readNotify = createAsyncThunk(
  'common/readNotify',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const res = await CommonService.readNotify(id)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCancelGetStaffs(state, { payload }) {
      state.cancelGetStaffs = payload
    },
    resetBranches(state) {
      state.listBranches = []
      state.listDashboardBranches = []
    },
    setItemNotify(state, { payload }) {
      state.itemNotify = payload
    },
    setNotificationsForUser(state, { payload }) {
      state.notificationsForUser = payload
    },
    setNumberOfNotification(state, { payload }) {
      state.numberOfNotification = payload
    },
    setReCallNotify(state, { payload }) {
      state.reCallNotify = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getBranchList.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getBranchList.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.listBranches = payload.data.map((item: Branch) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getBranchList.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getBranchDashboardList.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.listDashboardBranches = payload.data.map((item: Branch) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getContractGroups.fulfilled, (state, { payload }) => {
      state.contractGroups = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getContractTypes.fulfilled, (state, { payload }) => {
      state.contractTypes = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getDivisions.fulfilled, (state, { payload }) => {
      state.divisions = payload.data
    })
    builder.addCase(getDivisionsByProject.fulfilled, (state, { payload }) => {
      state.divisionByProject = payload.data
    })
    builder.addCase(getDivisionsDashboard.fulfilled, (state, { payload }) => {
      state.divisions = payload.data
    })
    builder.addCase(getPriorities.fulfilled, (state, { payload }) => {
      state.priorities = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getSkillSets.fulfilled, (state, { payload }) => {
      state.skillSets = payload.data
    })
    builder.addCase(getStatus.fulfilled, (state, { payload }) => {
      state.listStatus = payload.data.map((item: MasterCommonType) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    })
    builder.addCase(getPositions.fulfilled, (state, { payload }) => {
      state.listPosition = payload.data
    })
    builder.addCase(getMarkets.fulfilled, (state, { payload }) => {
      state.listMarket = payload.data
    })
    builder.addCase(getCurrencies.fulfilled, (state, { payload }) => {
      state.listCurrency = payload.data
    })
    builder.addCase(getProvinces.fulfilled, (state, { payload }) => {
      state.listProvinces = payload.data
    })
    builder.addCase(getGrades.fulfilled, (state, { payload }) => {
      state.listGrade = payload.data[0]?.grades || []
    })
    builder.addCase(getGrades.rejected, (state, action) => {
      state.listGrade = []
    })
    builder.addCase(getLeaderGrades.fulfilled, (state, { payload }) => {
      state.leaderGrades = payload.data[0]?.grades || []
    })
    builder.addCase(getLeaderGrades.rejected, (state, action) => {
      state.leaderGrades = []
    })
    builder.addCase(getNumberOfNotification.fulfilled, (state, { payload }) => {
      state.numberOfNotification = payload.data
    })
    builder.addCase(getStaffContactPerson.fulfilled, (state, { payload }) => {
      state.staffContactPersons = payload.data.map(
        (contactPerson: OptionItem) => ({
          ...contactPerson,
          label: contactPerson?.name || '',
          id: contactPerson.id?.toString(),
          value: contactPerson.id?.toString(),
        })
      )
    })
    builder.addCase(getCommonCustomers.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonCustomers = data.content.map((customer: OptionItem) => ({
        ...customer,
        value: customer.id,
        label: customer.name,
        description: customer.id,
      }))
    })
    builder.addCase(getCommonPartners.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonPartners = data.content.map((partner: OptionItem) => ({
        ...partner,
        value: partner.id,
        label: partner.name,
        description: partner.id,
      }))
    })

    builder.addCase(getCommonStaffs.pending, (state, a) => {
      if (state.cancelGetStaffs) {
        state.cancelGetStaffs.cancel()
      }
    })
    builder.addCase(getCommonStaffs.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listCommonStaffs = data.content.map((staff: OptionItem) => ({
        ...staff,
        value: staff.id,
        label: staff.name,
        description: staff.id,
      }))
    })
    builder.addCase(getProjectTypes.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listProjectTypes =
        data.map((option: OptionItem) => ({
          value: option.id,
          label: option.name,
          id: option.id,
        })) || []
    })
    builder.addCase(getProjectManagers.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.totalProjectManagers = data.totalElements
      state.listProjectManagers = data.content.map((item: IProjectManager) => ({
        id: item.id.toString(),
        value: item.id.toString(),
        label: item.name,
        description: item.email,
      }))
    })
    builder.addCase(getProjectStaffs.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.projectStaffs = data.map((item: IProjectStaff) => ({
        id: item.id.toString(),
        value: item.id.toString(),
        label: item.name,
      }))
    })
    builder.addCase(getContractCodes.fulfilled, (state, { payload }) => {
      const { data } = payload
      state.listContractCode =
        data?.content.map((option: OptionItem) => ({
          id: option.id,
          value: option.id,
          label: option.code,
        })) || []
    })
    builder.addCase(getContractCodes.rejected, (state, { payload }) => {
      state.listContractCode = []
    })
    builder.addCase(
      getContractByContractGroup.fulfilled,
      (state, { payload }) => {
        const { data } = payload
        state.listContractByContractGroup =
          data?.map((option: OptionItem) => ({
            ...option,
            id: option.id,
            value: option.id,
            label: option.code,
          })) || []
      }
    )
  },
})

export const {
  setCancelGetStaffs,
  resetBranches,
  setItemNotify,
  setNotificationsForUser,
  setNumberOfNotification,
  setReCallNotify,
} = commonSlice.actions

export const commonSelector = (state: RootState) => state['common']

export default commonSlice.reducer
