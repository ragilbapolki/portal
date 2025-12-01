import axios from 'axios'
import { dispatch } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import keycloak from '@/keycloak'   // ⬅ tambahkan ini

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API || 'http://127.0.0.1:8000/api/v1',
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  async config => {
    let token = null

    // 1️⃣ utamakan token KEYCLOAK
    if (keycloak && keycloak.authenticated) {
      token = keycloak.token
    }
    // 2️⃣ fallback ke token lama
    else {
      token = dispatch.user.getToken()
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code && res.code !== 20000) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5000
      })

      if ([50008, 50012, 50014].includes(res.code)) {
        ElMessageBox.confirm(
          'You have been logged out, login again?',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          // LOGOUT KEYCLOAK
          if (keycloak) keycloak.logout()

          dispatch.user.removeToken()
          location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error)
  }
)

export default service
