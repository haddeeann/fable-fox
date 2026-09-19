import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useStoreAuth } from '@/stores/storeAuth'

// route level code-splitting
// this generates a separate chunk (About.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/editNote/:id',
      name: 'edit-note',
      component: import('../views/NotesEditView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue'),
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostListView.vue'),
    },
    {
      path: '/issues',
      name: 'IssueList',
      component: () => import('../views/IssueListView.vue'),
      meta: { public: true },
    },
    {
      path: '/issues/:id',
      name: 'IssueDetail',
      component: () => import('../views/IssueDetailView.vue'),
      meta: { public: true },
    },
    {
      path: '/issues/:id/edit',
      name: 'IssueEditor',
      component: () => import('../views/IssueEditorView.vue'),
      meta: { editorial: true },
    },
    {
      path: '/posts/new',
      name: 'PostCreate',
      component: () => import('../views/PostCreateView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'PostDetail',
      component: () => import('../views/PostDetailView.vue'),
      props: true,
      meta: { public: true },
    },
    {
      path: '/posts/:id/edit',
      name: 'PostEdit',
      component: () => import('@/views/PostEditView.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const storeAuth = useStoreAuth()
  const publicRoutes = ['auth', 'home', 'about']
  if (!storeAuth.user && !to.meta.public && !publicRoutes.includes(String(to.name))) {
    return {
      name: 'home',
    }
  }
  if (to.meta.editorial && !['admin', 'editor'].includes(storeAuth.user?.role || '')) {
    return { name: 'IssueList' }
  }
  if (storeAuth.user && to.name === 'auth') {
    return false
  }
})

export default router
