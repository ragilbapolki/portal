<template>
  <div class="portal-container">
    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <h1 class="company-name">PT Wismilak Inti Makmur Tbk</h1>
        <span class="company-desc">Portal Aplikasi Internal</span>
      </div>
    </header>

    <!-- CONTENT -->
    <main>
      <h2 class="title">Aplikasi</h2>

      <div class="app-grid">
        <div
          v-for="app in filteredApps"
          :key="app.name"
          class="app-card"
          @click="openApp(app.url)"
        >
          <img :src="app.icon" class="app-icon" />
          <h3>{{ app.name }}</h3>
          <p>{{ app.desc }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import kbLogo from "@/assets/images/logo_kb_no_text.png";

const search = ref("");

/* ================ USER ================== */
const user = ref({
  name: "Ragil",
  avatar:
    "https://ui-avatars.com/api/?name=Ragil&background=0D8ABC&color=fff",
});

/* ================ APPS ================== */
/* Tambahkan URL email di sini */
const apps = ref([
  {
    name: "Knowledge Base",
    desc: "Artikel Pengetahuan",
    icon: kbLogo,
    url: "http://localhost:5173/",
  },
  {
    name: "Email",
    desc: "Akses email kantor",
    icon: '📧',
    url: "https://mail.wismilak.com/", // 👈 URL baru
  },
]);

/* ================ FILTER SEARCH ================== */
const filteredApps = computed(() => {
  return apps.value.filter((app) =>
    app.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

/* ================ OPEN APP ================== */
const openApp = (url) => {
  window.open(url, "_blank");
};
</script>

<style scoped>
/* RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* MAIN CONTAINER */
.portal-container {
  background: #f4f6f9;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

/* HEADER */
.header {
  background: #fff;
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.company-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #16a34a;
}

.company-desc {
  font-size: 0.8rem;
  color: #6b7280;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* SEARCH */
.search-input {
  padding: 0.7rem 1rem;
  width: 260px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: 0.2s;
}

.search-input:focus {
  border-color: #16a34a;
}

/* USER INFO */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

/* TITLE */
.title {
  margin: 2rem 2rem 1rem;
  font-size: 1.4rem;
  font-weight: 700;
}

/* GRID APPS */
.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.2rem;
  padding: 0 2rem 2rem;
}

/* CARD */
.app-card {
  background: white;
  padding: 1.5rem;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: 0.25s;
  text-align: center;
}

.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.app-icon {
  width: 55px;
  margin-bottom: 0.8rem;
}

.app-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.app-card p {
  color: #6b7280;
  font-size: 0.87rem;
}
</style>
