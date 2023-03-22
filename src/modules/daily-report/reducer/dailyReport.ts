import { alertError, commonErrorAlert, updateLoading } from '@/reducer/screen'
import { RootState } from '@/store'
import { IQueries } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { IQueriesReportList } from '../pages/DailyReportList'
import dailyReportService from '../services/dailyReport.service'
import {
  IDailyReportResponse,
  IGetDailyReportParams,
  IReport,
  IReportAppRequest,
  IReportDetailParams,
  IReportRequest,
  IStaff,
} from '../types'

export interface IDailyReport {
  responseReport: IDailyReportResponse | null
  reports: IReport[]
  staffInfo: IStaff | null
  listApplications: any[]
  isOpenConfirmReport: boolean
}

const initialState: IDailyReport = {
  responseReport: null,
  reports: [],
  staffInfo: null,
  listApplications: [],
  isOpenConfirmReport: false,
}

export const getDailyReports = createAsyncThunk(
  'dailyReport/getDailyReports',
  async (params: IGetDailyReportParams, { rejectWithValue, dispatch }) => {
    try {
      const res = await dailyReportService.getDailyReports(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getDailyReportDetail = createAsyncThunk(
  'dailyReport/getDailyReportDetail',
  async (params: IReportDetailParams, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.getDailyReportDetail(params)
      return res
    } catch (err: any) {
      if (err[0]?.title) {
        dispatch(
          alertError({
            message: err[0]?.title,
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getApplication = createAsyncThunk(
  'dailyReport/getApplication',
  async (params: IQueriesReportList, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.getApplication(params)
      return res
    } catch (err: any) {
      if (!err) {
        throw err
      }
      if (err[0]?.title) {
        dispatch(
          alertError({
            message: err[0]?.title,
          })
        )
      }
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getApplicationDetail = createAsyncThunk(
  'dailyReport/getApplicationDetail',
  async (id: string | number, { rejectWithValue, dispatch }) => {
    try {
      const res = await dailyReportService.getApplicationDetail(id)
      return res
    } catch (err: any) {
      if (!err) {
        throw err
      }
      return rejectWithValue(err)
    }
  }
)

export const createDailyReport = createAsyncThunk(
  'dailyReport/createDailyReport',
  async (params: IReportRequest, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.createDailyReport(params)
      return res
    } catch (err: any) {
      if (err[0].field === 'Account') {
        dispatch(
          alertError({
            message: err[0]?.message ?? 'An error has occurred',
          })
        )
      } else {
        dispatch(commonErrorAlert())
      }

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const approveReport = createAsyncThunk(
  'dailyReport/approveReport',
  async ({ id, status }: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.approveReport(id, status)
      return res
    } catch (err: any) {
      if (!err) {
        throw err
      }
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createDailyReportApplication = createAsyncThunk(
  'dailyReport/createDailyReportApplication',
  async (params: IReportAppRequest, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.createDailyReportApplication(params)
      return res
    } catch (err: any) {
      if (!err) {
        throw err
      }
      if (err[0].field === 'Account') {
        dispatch(
          alertError({
            message: err[0]?.message ?? 'An error has occurred',
          })
        )
      } else if (err[0].code === 'application-duplicate') {
        dispatch(
          alertError({
            message: err[0]?.title ?? 'An error has occurred',
          })
        )
      } else {
        dispatch(commonErrorAlert())
      }

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateDailyReport = createAsyncThunk(
  'dailyReport/updateDailyReport',
  async (
    params: { reportId: string; data: IReportRequest },
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.updateDailyReport(params)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteDailyReport = createAsyncThunk(
  'dailyReport/deleteDailyReport',
  async (params: string, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await dailyReportService.deleteDailyReport(params)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const dailyReportSlice = createSlice({
  name: 'dailyReport',
  initialState,
  reducers: {
    setReports(state, { payload }) {
      state.reports = payload
    },
    setApplications(state, { payload }) {
      state.listApplications = payload
    },
    setOpenConfirmDaily(state, { payload }) {
      state.isOpenConfirmReport = payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getDailyReports.fulfilled, (state, { payload }) => {
      const {
        data: { staff, dailyReport },
      } = payload

      state.responseReport = payload?.data ?? null
      state.staffInfo = staff ?? null
      state.reports = dailyReport.map((_report: any) => ({
        ..._report,
        reportDate: new Date(_report.reportDate),
      }))
    })
  },
})

export const { setReports, setApplications, setOpenConfirmDaily } =
  dailyReportSlice.actions
export const dailyReportSelector = (state: RootState) => state['dailyReport']

export default dailyReportSlice.reducer
