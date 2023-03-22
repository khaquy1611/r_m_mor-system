import {
  alertError,
  alertSuccess,
  commonErrorAlert,
  updateLoading,
} from '@/reducer/screen'
import { scrollToTop } from '@/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import i18next from 'i18next'
import { ProjectService } from '../services'
import {
  PayloadListProject,
  PayloadProjectGeneral,
  PayloadProjectHeadcount,
  PayloadProjectStaffHeadcount,
  ProjectPayload,
} from '../services/project.service'
import { IListProjectsParams } from '../types'
import { setCancelGetProjectList } from './project'

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (
    { id, code }: { id: string; code: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ProjectService.deleteProject(id)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_DELETE_PROJECT_SUCCESS', {
            projectId: code,
          }),
        })
      )
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getListProjects = createAsyncThunk(
  'project/getListProjects',
  async (params: IListProjectsParams, { rejectWithValue, dispatch }) => {
    try {
      const source = axios.CancelToken.source()
      dispatch(setCancelGetProjectList(source))
      const res = await ProjectService.getListProjects(params, {
        cancelToken: source.token,
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectDetail = createAsyncThunk(
  'project/getProjectDetail',
  async (projectId: string, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getProjectDetail(projectId)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createNewProject = createAsyncThunk(
  'project/createNewProject',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createNewProject(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_CREATE_PROJECT_SUCCESS', {
            projectId: res.data?.general?.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('project:MSG_CREATE_PROJECT_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getProjectCosts = createAsyncThunk(
  'project/getProjectCosts',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getProjectCosts(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getListProjectRevenueByProject = createAsyncThunk(
  'project/getListProjectRevenueByProject',
  async ({ projectId, params }: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getListProjectRevenue({
        projectId,
        params: { ...params, tab: 'PROJECT' },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getListProjectRevenueByDivision = createAsyncThunk(
  'project/getListProjectRevenueByDivision',
  async ({ projectId, params }: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.getListProjectRevenue({
        projectId,
        params: { ...params, tab: 'DIVISION' },
      })
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createProjectRevenue = createAsyncThunk(
  'project/createProjectRevenue',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createProjectRevenue({
        projectId: payload.projectId,
        data: payload.data,
      })
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_CREATE_PROJECT_REVENUE_SUCCESS', {
            projectId: res.data.id || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('project:MSG_CREATE_PROJECT_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const createProjectCost = createAsyncThunk(
  'project/createProjectCost',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createProjectCost({
        projectId: payload.projectId,
        data: payload.data,
      })
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_CREATE_PROJECT_COST_SUCCESS', {
            projectId: res.data?.id || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(
        alertError({
          message: i18next.t('project:MSG_CREATE_PROJECT_ERROR'),
        })
      )

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateProjectGeneral = createAsyncThunk(
  'project/updateProjectGeneral',
  async (payload: PayloadProjectGeneral, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectGeneral(payload)
      dispatch(
        alertSuccess({
          message: i18next.t('project:MSG_UPDATE_PROJECT_INFORMATION_SUCCESS', {
            projectId: payload.data.code || '',
          }),
        })
      )
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateProjectHeadcount = createAsyncThunk(
  'project/updateProjectHeadcount',
  async (payload: PayloadProjectHeadcount, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectHeadcount(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const getProjectRevenueById = createAsyncThunk(
  'project/getProjectRevenueById',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectRevenueById(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const getProjectCostDetail = createAsyncThunk(
  'project/getProjectCostDetail',
  async (params: any, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectCostDetail(params)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)
export const updateProjectRevenue = createAsyncThunk(
  'project/updateProjectRevenue',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectRevenue(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const updateProjectCost = createAsyncThunk(
  'project/updateProjectCost',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectCost(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const deleteProjectRevenue = createAsyncThunk(
  'project/deleteProjectRevenue',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.deleteProjectRevenue(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)
export const deleteProjectCost = createAsyncThunk(
  'project/deleteProjectCost',
  async (payload: any, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.deleteProjectCost(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getProjectHeadcount = createAsyncThunk(
  'project/getProjectHeadcount',
  async (payload: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectHeadcount(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    } finally {
    }
  }
)

export const getProjectGeneral = createAsyncThunk(
  'project/getProjectGeneral',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await ProjectService.getProjectGeneral(payload)
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const getProjectStaffHeadcount = createAsyncThunk(
  'project/getProjectStaffHeadcount',
  async (payload: PayloadListProject, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectStaffHeadcount(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
    }
  }
)

export const createProjectStaffHeadcount = createAsyncThunk(
  'project/createProjectStaffHeadcount',
  async (
    payload: PayloadProjectStaffHeadcount,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.createProjectStaffHeadcount(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getProjectStaffHeadcountById = createAsyncThunk(
  'project/getProjectStaffHeadcountById',
  async (payload: ProjectPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectStaffHeadcountById(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
    }
  }
)

export const updateProjectStaffHeadcount = createAsyncThunk(
  'project/updateProjectStaffHeadcount',
  async (
    payload: PayloadProjectStaffHeadcount,
    { rejectWithValue, dispatch }
  ) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.updateProjectStaffHeadcount(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const deleteProjectStaffHeadcount = createAsyncThunk(
  'project/deleteProjectStaffHeadcount',
  async (payload: ProjectPayload, { rejectWithValue, dispatch }) => {
    dispatch(updateLoading(true))
    try {
      const res = await ProjectService.deleteProjectStaffHeadcount(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
      dispatch(updateLoading(false))
    }
  }
)

export const getProjectStatistics = createAsyncThunk(
  'project/getProjectStatistics',
  async (payload: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await ProjectService.getProjectStatistics(payload)
      return res
    } catch (err: any) {
      dispatch(commonErrorAlert())

      return rejectWithValue(err)
    } finally {
    }
  }
)
