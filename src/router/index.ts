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
      meta: { title: 'FableFox' },
    },
    {
      path: '/editNote/:id',
      name: 'edit-note',
      component: import('../views/NotesEditView.vue'),
      meta: { title: 'Edit Note | FableFox' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About | FableFox' },
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue'),
      meta: { title: 'Notes | FableFox' },
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostListView.vue'),
      meta: { title: 'My Stories & Zines | FableFox' },
    },
    {
      path: '/issues',
      name: 'IssueList',
      component: () => import('../views/IssueListView.vue'),
      meta: { public: true, title: 'Issues | FableFox' },
    },
    {
      path: '/issues/:id',
      name: 'IssueDetail',
      component: () => import('../views/IssueDetailView.vue'),
      meta: { public: true, title: 'Issue | FableFox' },
    },
    {
      path: '/issues/:id/edit',
      name: 'IssueEditor',
      component: () => import('../views/IssueEditorView.vue'),
      meta: { editorial: true, title: 'Edit Issue | FableFox' },
    },
    {
      path: '/posts/new',
      name: 'PostCreate',
      component: () => import('../views/PostCreateView.vue'),
      meta: { title: 'New Story or Zine | FableFox' },
    },
    {
      path: '/posts/:id',
      name: 'PostDetail',
      component: () => import('../views/PostDetailView.vue'),
      props: true,
      meta: { public: true, title: 'Story or Zine | FableFox' },
    },
    {
      path: '/posts/:id/edit',
      name: 'PostEdit',
      component: () => import('@/views/PostEditView.vue'),
      meta: { title: 'Edit Story or Zine | FableFox' },
    },
    {
      path: '/zines/:id/pages',
      name: 'PageUploader',
      component: () => import('../views/PageUploaderView.vue'),
      meta: { title: 'Arrange Zine Pages | FableFox' },
    },
    {
      path: '/zines/:slug/read',
      name: 'FlipbookReader',
      component: () => import('../views/FlipbookView.vue'),
      meta: { public: true, title: 'Read Zine | FableFox' },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { title: 'Stats | FableFox' },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { title: 'Welcome Back | FableFox' },
    },
  ],
})

router.beforeEach(async (to) => {
  const storeAuth = useStoreAuth()
  await storeAuth.restoreSession()
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

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'FableFox'
})

export default router
