import router from './router'
import { getInfo } from './api/user'
import { ctx, dispatch } from './store'

import keycloak from '@/keycloak'   // ⬅ TAMBAHKAN INI

import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/', '/404', '/403', '/articlesList', '/articles']
const publicRoutePatterns = ['/articles/', '/author/', '/articlesList']

function hasRequiredRole(userRoles, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) return true
  if (!Array.isArray(userRoles)) return false
  return requiredRoles.some(r => userRoles.includes(r))
}

function isPublicRoute(path) {
  if (whiteList.includes(path)) return true
  return publicRoutePatterns.some(pattern => path.startsWith(pattern))
}

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = to.meta.title
    ? `${to.meta.title} - WISMILAK Knowledge Base`
    : 'WISMILAK Knowledge Base'

  // 1️⃣ PRIORITAS: TOKEN KEYCLOAK
  const kcToken = keycloak?.token || null
  const hasLocalToken = dispatch.user.getToken()

  // Jika Keycloak login → selalu gunakan Keycloak sebagai utama
  const hasToken = kcToken || hasLocalToken

  // ----------- JIKA ADA TOKEN -----------
  if (hasToken) {
    // 2️⃣ Kalau user buka halaman login → redirect ke home
    if (to.path === '/account/login') {
      next({ path: '/' })
      NProgress.done()
      return
    }

    // 3️⃣ AMBIL USER INFO (Keycloak dulu, lalu fallback Laravel)
    if (ctx.userInfo && ctx.userInfo.name) {
      const roles = ctx.userInfo.roles || []
      if (to.meta.roles && !hasRequiredRole(roles, to.meta.roles)) {
        ElMessage.error('Akses ditolak (role tidak cukup)')
        next('/403')
        return
      }
      next()
      return
    }

    try {
      let user = {}

      // 🟩 4️⃣ PAKAI USER INFO DARI KEYCLOAK
      if (kcToken) {
        user = {
          id: keycloak.subject,
          name: keycloak.tokenParsed.name,
          email: keycloak.tokenParsed.email,
          roles: keycloak.tokenParsed.realm_access?.roles || []
        }
      } else {
        // 🟦 fallback ke Laravel API (jika masih pakai sistem lama)
        const response = await getInfo(hasToken)
        user = response.data
      }

      // simpan user info
      dispatch.user.saveInfo(user)

      // role check
      if (to.meta.roles) {
        if (!hasRequiredRole(user.roles, to.meta.roles)) {
          ElMessage.error(`Akses ditolak.`)
          next('/403')
          return
        }
      }

      next()

    } catch (err) {
      console.error('[PERMISSION] gagal mengambil user info:', err)

      dispatch.user.removeToken()
      dispatch.user.removeInfo()

      if (kcToken) keycloak.logout()

      next(`/account/login?redirect=${to.path}`)
    }

  // ----------- TIDAK ADA TOKEN -----------
  } else {
    if (isPublicRoute(to.path)) {
      next()
    } else {
      // Redirect ke login KEYCLOAK
      keycloak.login({
        redirectUri: window.location.origin + to.fullPath
      })
    }
  }

  NProgress.done()
})

router.afterEach(() => NProgress.done())
