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
      meta: { title: 'Doodle Zines' },
    },
    {
      path: '/editNote/:id',
      name: 'edit-note',
      component: import('../views/NotesEditView.vue'),
      meta: { title: 'Edit Note | Doodle Zines' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About | Doodle Zines' },
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('../views/NotesView.vue'),
      meta: { title: 'Notes | Doodle Zines' },
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/PostListView.vue'),
      meta: { title: 'My Zines | Doodle Zines' },
    },
    {
      path: '/issues',
      name: 'IssueList',
      component: () => import('../views/IssueListView.vue'),
      meta: { public: true, title: 'Issues | Doodle Zines' },
    },
    {
      path: '/issues/:id',
      name: 'IssueDetail',
      component: () => import('../views/IssueDetailView.vue'),
      meta: { public: true, title: 'Issue | Doodle Zines' },
    },
    {
      path: '/issues/:id/edit',
      name: 'IssueEditor',
      component: () => import('../views/IssueEditorView.vue'),
      meta: { editorial: true, title: 'Edit Issue | Doodle Zines' },
    },
    {
      path: '/posts/new',
      name: 'PostCreate',
      component: () => import('../views/PostCreateView.vue'),
      meta: { title: 'New Zine | Doodle Zines' },
    },
    {
      path: '/posts/:id',
      name: 'PostDetail',
      component: () => import('../views/PostDetailView.vue'),
      props: true,
      meta: { public: true, title: 'Zine | Doodle Zines' },
    },
    {
      path: '/posts/:id/edit',
      name: 'PostEdit',
      component: () => import('@/views/PostEditView.vue'),
      meta: { title: 'Edit Zine | Doodle Zines' },
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../views/StatsView.vue'),
      meta: { title: 'Stats | Doodle Zines' },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      meta: { title: 'Welcome Back | Doodle Zines' },
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

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'Doodle Zines'
})

export default router
