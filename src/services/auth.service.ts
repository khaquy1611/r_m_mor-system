import ApiClientWithToken, { LoginClient } from '@/api/api'
import { TYPE_WEBSITE_DEFAULT } from '@/const/app.const'
import {
  LoginFormControls,
  LoginApiResponse,
  ChangePasswordPayload,
} from '@/types'

export default {
  login(requestBody: LoginFormControls): Promise<LoginApiResponse> {
    const url = '/login'
    return LoginClient.post(url, { ...requestBody, type: TYPE_WEBSITE_DEFAULT })
  },
  getSelfInfo() {
    return ApiClientWithToken.get('/info')
  },
  logout() {
    return ApiClientWithToken.post('/logout')
  },
  changePassword(payload: ChangePasswordPayload) {
    return ApiClientWithToken.post('/info/change-password', {
      ...payload,
      type: TYPE_WEBSITE_DEFAULT,
    })
  },
}
