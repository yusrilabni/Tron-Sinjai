import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Registrasi from '../pages/Registrasi.vue'
import Status from '../pages/Status.vue'
import Logs from '../pages/Logs.vue'
import Login from '../pages/Login.vue'
import GalleryAdmin from '../pages/admin/Gallery.vue'
import SubmissionsAdmin from '../pages/admin/Submissions.vue'
import ActivityAdmin from '../pages/admin/Activity.vue'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'registrasi', name: 'registrasi', component: Registrasi },
      { path: 'registrasi-standar', name: 'registrasi-standar', component: Registrasi },
      { path: 'registrasi-internal', name: 'registrasi-internal', component: Registrasi },
      { path: 'status', name: 'status', component: Status },
      { path: 'logs', name: 'logs', component: Logs },
      { path: 'login', name: 'login', component: Login },
      { path: 'admin/gallery', name: 'admin-gallery', component: GalleryAdmin },
      { path: 'admin/submissions', name: 'admin-submissions', component: SubmissionsAdmin },
      { path: 'admin/activity', name: 'admin-activity', component: ActivityAdmin },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global route guard to protect admin routes
router.beforeEach((to, _from, next) => {
  const isAdmin = !!localStorage.getItem('admin_user')
  if (to.path.startsWith('/admin') && !isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router
