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
      { 
        path: '', 
        name: 'home', 
        component: Home,
        meta: { 
          title: 'Portal Videotron Sinjai - Layanan Pengajuan Penayangan',
          description: 'Satu pintu pendaftaran, penayangan, dan pemantauan media informasi videotron Kabupaten Sinjai secara transparan.'
        }
      },
      { 
        path: 'registrasi', 
        name: 'registrasi', 
        component: Registrasi,
        meta: { 
          title: 'Pilih Kategori Layanan - Portal Videotron Sinjai',
          description: 'Pilih tipe formulir untuk pengajuan penayangan materi publikasi di media videotron Kabupaten Sinjai.'
        }
      },
      { 
        path: 'registrasi-standar', 
        name: 'registrasi-standar', 
        component: Registrasi,
        meta: { 
          title: 'Layanan Umum (Maks 3 Hari) - Portal Videotron Sinjai',
          description: 'Formulir pengajuan materi publikasi, Sosialisasi, dan Iklan Umum untuk khalayak umum dengan durasi maksimal 3 hari.'
        }
      },
      { 
        path: 'registrasi-internal', 
        name: 'registrasi-internal', 
        component: Registrasi,
        meta: { 
          title: 'Layanan Internal & Prioritas (Maks 30 Hari) - Portal Videotron Sinjai',
          description: 'Formulir pengajuan khusus untuk OPD instansi pemkab, pemerintah vertikal, atau agenda prioritas daerah dengan durasi tayang maksimal 30 hari.'
        }
      },
      { 
        path: 'status', 
        name: 'status', 
        component: Status,
        meta: { 
          title: 'Pantau Status Pengajuan - Portal Videotron Sinjai',
          description: 'Cek kelayakan status tayang pengajuan materi videotron Anda secara berkala secara real-time.'
        }
      },
      { 
        path: 'logs', 
        name: 'logs', 
        component: Logs,
        meta: { 
          title: 'Log Aktivitas Penayangan - Portal Videotron Sinjai',
          description: 'Catatan transparansi publik mengenai konten, status, dan riwayat tayang pada portal videotron Kabupaten Sinjai.'
        }
      },
      { 
        path: 'login', 
        name: 'login', 
        component: Login,
        meta: { 
          title: 'Login Administrator - Portal Videotron Sinjai',
          description: 'Halaman masuk khusus untuk panel admin pengelola media videotron Kabupaten Sinjai.'
        }
      },
      { 
        path: 'admin/gallery', 
        name: 'admin-gallery', 
        component: GalleryAdmin,
        meta: { 
          title: 'Kelola Galeri Penayangan (Admin) - Portal Videotron Sinjai' 
        }
      },
      { 
        path: 'admin/submissions', 
        name: 'admin-submissions', 
        component: SubmissionsAdmin,
        meta: { 
          title: 'Daftar Pengajuan Masuk (Admin) - Portal Videotron Sinjai' 
        }
      },
      { 
        path: 'admin/activity', 
        name: 'admin-activity', 
        component: ActivityAdmin,
        meta: { 
          title: 'Log System & Settings (Admin) - Portal Videotron Sinjai' 
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global route guard to protect admin routes and dynamically update page titles & metadata
router.beforeEach((to, _from, next) => {
  const title = (to.meta.title as string) || 'Portal Videotron Sinjai - Layanan Pengajuan Penayangan'
  const description = (to.meta.description as string) || 'Ajukan materi publikasi, sosialisasi, dan iklan Anda untuk ditayangkan di Videotron Kabupaten Sinjai secara transparan.'

  document.title = title

  // Update dynamic Open Graph and Twitter tags in document head
  const selectors = {
    'meta[property="og:title"]': title,
    'meta[name="twitter:title"]': title,
    'meta[property="og:description"]': description,
    'meta[name="twitter:description"]': description
  }

  for (const [selector, value] of Object.entries(selectors)) {
    const el = document.querySelector(selector)
    if (el) el.setAttribute('content', value)
  }

  const isAdmin = !!localStorage.getItem('admin_user')
  if (to.path.startsWith('/admin') && !isAdmin) {
    next('/login')
  } else {
    next()
  }
})

export default router
