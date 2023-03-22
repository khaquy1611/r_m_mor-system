import {
  combineReducers,
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import screenReducer from '@/reducer/screen'
import authReducer from '@/reducer/auth'
import commonReducer from '@/reducer/common'
import customerReducer from '@/modules/customer/reducer/customer'
import partnerReducer from '@/modules/customer/reducer/partner'
import projectReducer from '@/modules/project/reducer/project'
import staffReducer from '@/modules/staff/reducer/staff'
import dailyReportReducer from '@/modules/daily-report/reducer/dailyReport'
import contractReducer from '@/modules/contract/reducer/contract'
import financeReducer from '@/modules/finance/reducer/finance'

const rootReducer = combineReducers({
  screen: screenReducer,
  auth: authReducer,
  customer: customerReducer,
  common: commonReducer,
  partner: partnerReducer,
  project: projectReducer,
  staff: staffReducer,
  dailyReport: dailyReportReducer,
  finance: financeReducer,
  contract: contractReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
