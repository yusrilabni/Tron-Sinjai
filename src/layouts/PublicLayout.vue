<template>
  <div class="min-h-screen flex flex-col bg-white selection:bg-blue-900 selection:text-white font-sans">
    <!-- Navbar -->
    <nav class="sticky top-0 z-[100] bg-white border-b-2 border-slate-100">
      <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <!-- Brand -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-700/20 group-hover:bg-amber-500 transition-colors">V</div>
          <div class="flex flex-col">
            <span class="text-xl font-black text-slate-900 tracking-tighter leading-none uppercase">SINJAI <span class="text-blue-700">TRON</span></span>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Media Informasi Digital</span>
          </div>
        </router-link>

        <!-- Dynamic Nav Links -->
        <div class="hidden md:flex items-center gap-10">
          <router-link v-for="item in currentMenuItems" :key="item.path" :to="item.path" 
            class="text-[13px] font-black uppercase tracking-wider transition-all relative py-1"
            :class="$route.path === item.path ? 'text-blue-700' : 'text-slate-500 hover:text-blue-700'">
            {{ item.name }}
            <div v-if="$route.path === item.path" class="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"></div>
          </router-link>
        </div>

        <!-- Action -->
        <div class="flex items-center gap-6">
          <template v-if="!isAdmin">
            <router-link to="/login" class="hidden sm:block text-[11px] font-black text-slate-400 hover:text-blue-700 uppercase tracking-[0.2em] transition-colors">
              Admin
            </router-link>
            <router-link to="/registrasi" class="px-7 py-3 bg-blue-700 text-white rounded-md text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-700/20 active:scale-95">
              Daftar Iklan
            </router-link>
          </template>
          <template v-else>
            <div class="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
              <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">Admin Mode</span>
            </div>
            <button @click="handleLogout" class="text-[11px] font-black text-red-500 hover:text-red-700 uppercase tracking-[0.2em] transition-colors">
              Logout
            </button>
          </template>
          
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-b-2 border-slate-100 p-8 space-y-6">
        <router-link v-for="item in currentMenuItems" :key="item.path" :to="item.path"
          @click="mobileMenuOpen = false"
          class="block text-xl font-black text-slate-900 uppercase tracking-tight">
          {{ item.name }}
        </router-link>
        <template v-if="!isAdmin">
          <router-link @click="mobileMenuOpen = false" to="/login" class="block text-sm font-black text-slate-400 uppercase tracking-widest">Login Admin</router-link>
        </template>
        <template v-else>
          <button @click="handleLogout" class="block text-sm font-black text-red-500 uppercase tracking-widest text-left w-full">Logout</button>
        </template>
      </div>
    </nav>

    <!-- Main -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-white pt-24 pb-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div class="col-span-1 md:col-span-2 space-y-8">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-700 rounded flex items-center justify-center text-white font-black text-lg">V</div>
              <span class="text-2xl font-black tracking-tighter uppercase">SINJAI <span class="text-blue-500">TRON</span></span>
            </div>
            <p class="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
              Layanan digital pengelolaan konten videotron terpusat untuk mewujudkan transparansi informasi publik di Kabupaten Sinjai.
            </p>
          </div>
          <div>
            <h4 class="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-8">Eksplorasi</h4>
            <ul class="space-y-4">
              <li v-for="item in currentMenuItems" :key="item.path">
                <router-link :to="item.path" class="text-sm text-slate-300 hover:text-white font-bold transition-colors">{{ item.name }}</router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-8">Kontak</h4>
            <p class="text-sm text-slate-300 font-bold leading-relaxed">
              Diskominfo Sinjai<br/>
              <span class="text-slate-500 font-medium italic">kominfo@sinjaikab.go.id</span>
            </p>
          </div>
        </div>
        <div class="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
          <p>&copy; 2026 Pemerintah Kabupaten Sinjai</p>
          <div class="flex gap-10">
            <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const isAdmin = ref(false)

const checkAuth = () => {
  isAdmin.value = !!localStorage.getItem('admin_user')
}

const handleLogout = () => {
  localStorage.removeItem('admin_user')
  localStorage.removeItem('admin_token')
  isAdmin.value = false
  mobileMenuOpen.value = false
  router.push('/')
}

const currentMenuItems = computed(() => {
  if (isAdmin.value) {
    return [
      { name: 'Dashboard', path: '/' },
      { name: 'Kelola Pengajuan', path: '/admin/submissions' },
      { name: 'Konten Galeri', path: '/admin/gallery' },
      { name: 'Aktivitas Admin', path: '/admin/activity' },
    ]
  }
  return [
    { name: 'Beranda', path: '/' },
    { name: 'Registrasi', path: '/registrasi' },
    { name: 'Cek Status', path: '/status' },
    { name: 'Log Pengajuan', path: '/logs' },
  ]
})

onMounted(checkAuth)
watch(() => route.path, checkAuth)
</script>

<style>
@reference "tailwindcss";

body {
  @apply antialiased text-slate-900;
}

.page-enter-active, .page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
