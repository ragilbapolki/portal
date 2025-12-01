// index.js
import {
  createRouter,
  createWebHistory
} from 'vue-router'

import PublicHome from '@/views/public/home.vue'
import PublicArticleDetail from '@/views/public/ArticleDetail.vue'
import PublicAuthorProfile from '@/views/public/AuthorProfile.vue'
import PublicArticleList from '@/views/public/ArticleList.vue'
import AdminCategories from '@/views/admin/category/index.vue'
import AdminDivision from '@/views/admin/division/DivisionManagement.vue'
import AdminProfile from '@/views/admin/profile/MyProfile.vue'
import AdminUser from '@/views/admin/user/UserList.vue'
import AdminArticleList from '@/views/admin/article/ArticleList.vue'
import AdminArticleForm from '@/views/admin/article/ArticleForm.vue'
import AdminArticleView from '@/views/admin/article/ArticleView.vue'
import AdminArticleGalery from '@/views/admin/article/ArticleGallery.vue'

import Layout from '@/layout/index.vue'
import {
  DataAnalysis,
  DocumentCopy,
  Grid,
  OfficeBuilding,
  User
} from '@element-plus/icons-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '/account/login',
      name: 'login',
      hidden: true,
      component: () => import('@/views/account/login.vue'),
    },
    {
      path: '/login-callback',
      name: 'LoginCallback',
      component: () => import('@/views/account/LoginCallback.vue'),
      hidden: true,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      component: PublicHome,
      hidden: true,
      meta: {
        title: 'Home',
        requiresAuth: false
      }
    },
    {
      path: '/articlesList',
      name: 'PublicArticleList',
      component: PublicArticleList
    },
    {
      path: '/articles/:slug',
      name: 'ArticleDetail',
      component: PublicArticleDetail,
      props: true
    },
    {
      path: '/author/:id',
      name: 'AuthorProfile',
      component: PublicAuthorProfile,
      props: true
    },
    {
      path: '/admin',
      component: Layout,
      redirect: '/admin/dashboard',
      meta: {
        requiresAuth: true,
      },
      children: [{
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/dashboard.vue'),
        meta: {
          title: 'Dashboard',
          icon: DataAnalysis,
          keepAlive: true,
          affix: true,
          requiresAuth: true,
        }
      }]
    },
    // Categories Management - ADMIN ONLY
    {
      path: '/admin/categories',
      component: Layout,
      redirect: '/admin/categories/list',
      meta: {
        title: 'Categories',
        icon: Grid,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'CategoryList',
          component: AdminCategories,
          meta: {
            title: 'Kategori',
            icon: Grid,
            breadcrumb: [
              { title: 'Categories', to: '/admin/categories/list' },
              { title: 'List' }
            ]
          }
        },
      ]
    },
    // Division Management - ADMIN ONLY
    {
      path: '/admin/divisi',
      component: Layout,
      redirect: '/admin/divisi/list',
      meta: {
        title: 'Division',
        icon: OfficeBuilding,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'DivisionList',
          component: AdminDivision,
          meta: {
            title: 'Divisi / Departemen',
            icon: OfficeBuilding,
            breadcrumb: [
              { title: 'Divisi', to: '/admin/division/list' },
              { title: 'List' }
            ]
          }
        },
      ]
    },
    // Profile - All authenticated users
    {
      path: '/profile',
      component: Layout,
      redirect: '/profile/me',
      meta: {
        title: 'Profile',
        requiresAuth: true
      },
      hidden: true,
      children: [
        {
          path: 'me',
          name: 'MyProfile',
          component: AdminProfile,
          meta: {
            title: 'My Profile',
            requiresAuth: true
          }
        },
      ]
    },
    // Users Management - ADMIN ONLY
    {
      path: '/admin/users',
      component: Layout,
      redirect: '/admin/users/list',
      meta: {
        title: 'Users',
        icon: User,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'UserList',
          component: AdminUser,
          meta: {
            title: 'Users',
            icon: User,
            requiresAuth: true,
            breadcrumb: [
              { title: 'Users', to: '/admin/users/list' },
              { title: 'List' }
            ]
          }
        }
      ]
    },
    // Articles Management - ADMIN & EDITOR
    {
      path: '/admin/articles',
      component: Layout,
      redirect: '/admin/articles/list',
      meta: {
        title: 'Articles',
        icon: DocumentCopy,
        requiresAuth: true,
      },
      children: [
        {
          path: 'list',
          name: 'AdminArticleList',
          component: AdminArticleList,
          meta: {
            title: 'Article List',
            icon: DocumentCopy,
            requiresAuth: true,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'List' }
            ]
          }
        },
        {
          path: 'create',
          name: 'ArticleCreate',
          component: AdminArticleForm,
          hidden: true,
          meta: {
            title: 'Create Article',
            requiresAuth: true,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Create' }
            ]
          }
        },
        {
          path: 'edit/:id',
          name: 'ArticleEdit',
          component: AdminArticleForm,
          hidden: true,
          meta: {
            title: 'Edit Article',
            requiresAuth: true,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Edit' }
            ]
          }
        },
        {
          path: 'view/:id',
          name: 'ArticleView',
          component: AdminArticleView,
          hidden: true,
          meta: {
            title: 'View Article',
            requiresAuth: true,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'View' }
            ]
          }
        },
        {
          path: ':id/gallery',
          name: 'ArticleGallery',
          component: AdminArticleGalery,
          hidden: true,
          meta: {
            title: 'Article Gallery',
            requiresAuth: true,
            breadcrumb: [
              { title: 'Articles', to: '/admin/articles/list' },
              { title: 'Gallery' }
            ]
          }
        },
      ]
    },
    // 404 Error Page
    {
      path: '/404',
      component: () => import('@/views/404.vue'),
      hidden: true
    },
    // 403 Forbidden Page
    {
      path: '/403',
      component: () => import('@/views/404.vue'),
      hidden: true,
      meta: {
        title: 'Access Denied'
      }
    },
    // Catch all 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
      hidden: true
    },
  ],
})

// Helper function to check if user has required role
function hasRequiredRole(userRole, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true
  }
  return requiredRoles.includes(userRole)
}

router.afterEach((to, from) => {
  // Remove loading state if any
})

export const resetRouter = () => {
  console.log(router)
}

export default router
