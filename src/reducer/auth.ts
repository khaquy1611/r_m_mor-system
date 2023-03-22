import { HttpStatusCode } from '@/api/types'
import { ApiConstant } from '@/const'
import AuthService from '@/services/auth.service'
import { RootState } from '@/store'
import {
  ChangePasswordPayload,
  IStaffInfo,
  LoginFormControls,
  UserPermission,
} from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { alertError } from './screen'
import i18next from 'i18next'

export interface AuthState {
  token: string
  isLoginFetching: boolean
  permissions: UserPermission | any
  staff: IStaffInfo | null
  role: any
}
const initialState: AuthState = {
  token: Cookies.get(ApiConstant.ACCESS_TOKEN) || '',
  isLoginFetching: false,
  permissions: {},
  staff: null,
  role: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (requestBody: LoginFormControls, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.login(requestBody)
      return res
    } catch (err: any) {
      if (err.status === HttpStatusCode.BAD_REQUEST) {
        dispatch(
          alertError({ message: i18next.t('login:MSG_LOGIN_400') || '' })
        )
      } else {
        dispatch(
          alertError({
            message: err?.message || '',
          })
        )
      }
      return rejectWithValue(err)
    }
  }
)

export const getSelfInfo = createAsyncThunk(
  'auth/getSelfInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.getSelfInfo()
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.logout()
      if (res && res.status === HttpStatusCode.OK) {
        Cookies.remove(ApiConstant.ACCESS_TOKEN)
      }
      return res
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordPayload, { rejectWithValue, dispatch }) => {
    try {
      const res = await AuthService.changePassword(payload)
      return res
    } catch (err: any) {
      if (err[0]?.field === 'currentPassword') {
        dispatch(
          alertError({
            message: 'The password is incorrect. Try again',
          })
        )
      }
      return rejectWithValue(err)
    }
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(login.pending, state => {
      state.isLoginFetching = true
    }),
      builder.addCase(login.fulfilled, (state, { payload }) => {
        const { accessToken } = payload.data
        state.isLoginFetching = false
        state.token = accessToken
        Cookies.set(ApiConstant.ACCESS_TOKEN, accessToken)
      }),
      builder.addCase(login.rejected, state => {
        state.isLoginFetching = false
      })
    builder.addCase(getSelfInfo.fulfilled, (state, { payload }) => {
      const selfInfo = payload.data
      let permission = {}
      selfInfo.roles.forEach((role: any) => {
        permission = {
          ...permission,
          ...role.permission,
        }
      })
      state.permissions = {
        useHomePage: true,
        ...permission,
      }
      state.role = selfInfo.roles
      state.staff = selfInfo.staff
    })
  },
})

export const selectAuth = (state: RootState) => state['auth']

export default authSlice.reducer
