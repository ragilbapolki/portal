<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { dispatch } from '@/store'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const code = route.query.code
  const state = route.query.state

  if (!code) {
    router.push('/account/login')
    return
  }

  try {
    // CALL BACKEND UNTUK EXCHANGE CODE -> TOKEN
    const res = await axios.post('/api/auth/keycloak/callback', {
      code,
      state,
      redirect_uri: window.location.origin + '/login-callback',
    })

    dispatch.user.setToken(res.data.access_token)

    router.push('/')
  } catch (err) {
    console.error(err)
    router.push('/account/login')
  }
})
</script>

<template>
  <div>Logging in...</div>
</template>
