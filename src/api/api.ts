import { BASE_URL, HEADER_DATA_FORM_FILE } from '@/const/api.const'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { ApiConstant, PathConstant } from '../const'
import Cookies from 'js-cookie'
import { HttpStatusCode } from './types'
import i18next from 'i18next'

class HttpService {
  axios: any
  getCredential: any
  constructor(axios: any, getCredential: any) {
    this.axios = axios
    this.getCredential = getCredential
  }
  request(config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.request(config)
  }
  get(url: string, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.get(url, config)
  }
  post(url: string, data?: any, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.post(url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.put(url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.patch(url, data, config)
  }
  delete(url: string, config?: AxiosRequestConfig) {
    config = this.getCredential(config)
    return this.axios.delete(url, config)
  }
}

const redirectToLoginPage = (status: number) => {
  const isNavigateLoginPage = !localStorage.getItem(ApiConstant.SESSION_INVALID)
  if (status === HttpStatusCode.UNAUTHORIZED && isNavigateLoginPage) {
    Cookies.remove(ApiConstant.ACCESS_TOKEN)
    alert(i18next.t('login:MSG_SESSION_INVALID'))
    window.location.href = PathConstant.LOGIN
    localStorage.setItem(ApiConstant.SESSION_INVALID, 'true')
  }
}

const defaultConfig = (headers: any) => ({
  baseURL: BASE_URL,
  headers: { ...headers },
  timeout: ApiConstant.TIMEOUT,
})

const getCredentialWithAccessToken = (config: any = {}) => {
  const accessToken = Cookies.get(ApiConstant.ACCESS_TOKEN)
  if (!accessToken) return config
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: 'Bearer ' + accessToken,
    },
  }
}

const configInterceptors = (axiosClient: any) => {
  axiosClient.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    (res: any) => {
      const status = res?.response?.status
      redirectToLoginPage(status)
      return Promise.reject(
        res?.response?.data?.errors || { status: res?.response?.status }
      )
    }
  )
  return axiosClient
}

const axiosClient = configInterceptors(
  axios.create(defaultConfig(ApiConstant.HEADER_DEFAULT))
)
const axiosClientFormFile = configInterceptors(
  axios.create(defaultConfig(HEADER_DATA_FORM_FILE))
)

const ApiClientWithToken = new HttpService(
  axiosClient,
  getCredentialWithAccessToken
)

export const ApiClientFormFile = new HttpService(
  axiosClientFormFile,
  getCredentialWithAccessToken
)

const loginConfigInterceptors = (axiosClient: any) => {
  axiosClient.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    (res: any) => Promise.reject(res.response?.data)
  )
  return axiosClient
}

export const LoginClient = loginConfigInterceptors(
  axios.create(defaultConfig(ApiConstant.HEADER_DEFAULT))
)

export default ApiClientWithToken
