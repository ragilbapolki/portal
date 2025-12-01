<template>
  <header class="page-header">
    <div class="header-container">
      <!-- LOGO -->
      <div class="header-logo">
        <router-link to="/" class="logo-link">
          <img
            src="@/assets/images/logo_kb_no_text.png"
            alt="Wismilak Logo"
            class="company-logo"
          />
          <div class="company-text">
            <span class="company-name-header">WISMILAK</span>
            <span class="company-subtitle">Knowledge Base</span>
          </div>
        </router-link>
      </div>

      <!-- ACTIONS: LOGIN / USER MENU -->
      <div class="header-actions">

        <!-- SUDAH LOGIN → TAMPILKAN USER DROPDOWN -->
        <div v-if="isAuthenticated" class="user-menu">
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="el-dropdown-link user-info">
              <img
                :src="user.avatar_url"
                :alt="user.name"
                class="user-avatar"
              />
              <span class="user-name">{{ user.name }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">👤 Profil</el-dropdown-item>
                <el-dropdown-item command="dashboard">🏛️ Admin Dashboard</el-dropdown-item>

                <el-dropdown-item divided command="logout">
                  🚪 Logout
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- BELUM LOGIN → TAMPILKAN TOMBOL LOGIN -->
        <button v-else @click="login" class="login-button">
          Login
        </button>

      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import keycloak from "@/keycloak";
import { ArrowDown } from "@element-plus/icons-vue";

const router = useRouter();

/* ===============================
   🔐 CEK STATUS LOGIN GLOBAL
   =============================== */
const isAuthenticated = computed(() => keycloak.authenticated);

/* ===============================
   👤 DATA USER DARI KEYCLOAK
   =============================== */
const user = computed(() => {
  if (!keycloak.authenticated) return {};

  return {
    name:
      keycloak.tokenParsed?.name ||
      keycloak.tokenParsed?.preferred_username,
    email: keycloak.tokenParsed?.email,
    avatar_url: "/default-avatar.png"
  };
});

/* ===============================
   🔑 LOGIN → langsung ke Keycloak
   =============================== */
const login = () => keycloak.login();

/* ===============================
   🚪 LOGOUT → bersihkan session Keycloak
   =============================== */
const handleLogout = () => {
  keycloak.logout({
    redirectUri: window.location.origin
  });
};

/* ===============================
   📌 DROPDOWN MENU HANDLER
   =============================== */
const handleCommand = (cmd) => {
  switch (cmd) {
    case "profile":
      router.push("/profile/me");
      break;
    case "dashboard":
      router.push("/admin/dashboard");
      break;
    case "logout":
      handleLogout();
      break;
  }
};
</script>

<style scoped>
/* Header Styles */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo .logo-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.company-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.company-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.company-name-header {
  font-size: 1.25rem;
  font-weight: 800;
  color: #16a34a;
  letter-spacing: 0.05em;
}

.company-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f9fafb;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.login-button {
  padding: 0.5rem 1.5rem;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.login-button:hover {
  background: #15803d;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .user-name {
    display: none;
  }
}
</style>
