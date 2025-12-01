import 'normalize.css/normalize.css'
import '@/styles/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import SvgIcon from './components/SvgIcon.vue'
import { ctx } from './store'
import './permission'

import keycloak from './keycloak'

async function enableMock() {
  if (import.meta.env.MODE !== 'development') return

  const { worker } = await import('../mocks/browser')
  return worker.start({
    serviceWorker: { url: '/mockServiceWorker.js' }
  })
}

// ---------------------------------------
// BOOTSTRAP APP
// ---------------------------------------
async function bootstrap() {
  // Jalankan Mock jika dev
  await enableMock()

  // ---------------------------------------
  // 🔑 INITIALIZE KEYCLOAK
  // ---------------------------------------
  const authenticated = await keycloak.init({
    onLoad: "login-required",
    checkLoginIframe: false,
  });

  if (authenticated) {
    console.log("🔓 Keycloak Authenticated");
    localStorage.setItem("kc_token", keycloak.token);
    localStorage.setItem("kc_refresh", keycloak.refreshToken);
  } else {
    console.log("❌ Not authenticated");
  }

  // Pastikan token tidak null sebelum disimpan
  localStorage.setItem("kc_token", keycloak.token ?? "")
  localStorage.setItem("kc_refresh", keycloak.refreshToken ?? "")

  // ---------------------------------------
  // 🚀 MOUNT VUE APP SETELAH KEYCLOAK SIAP
  // ---------------------------------------
  const app = createApp(App)

  app.use(router)
  app.use(ElementPlus)
  app.component('svg-icon', SvgIcon)
  app.provide('context', ctx)

  // simpan ke global properties
  app.config.globalProperties.$keycloak = keycloak

  app.mount('#app')

  setInterval(async () => {
    try {
      const refreshed = await keycloak.updateToken(30)
      if (refreshed) {
        console.log("🔁 Token diperbarui")

        localStorage.setItem("kc_token", keycloak.token ?? "")
        localStorage.setItem("kc_refresh", keycloak.refreshToken ?? "")
      }
    } catch (e) {
      console.error("Gagal refresh token, redirect login...", e)
      keycloak.login() // fallback
    }
  }, 10000)
}

// MULAI
bootstrap()
