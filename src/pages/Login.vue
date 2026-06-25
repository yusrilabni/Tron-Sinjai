<template>
  <div class="max-w-md mx-auto mt-20 px-4">
    <div class="bg-white p-10 md:p-12 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-slate-100 space-y-10 relative overflow-hidden">
      <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-accent to-blue-400"></div>
      
      <div class="text-center space-y-4">
        <div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-slate-900/20 mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
           </svg>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight leading-none">Admin Area</h1>
        <p class="text-slate-500 font-medium">Masuk untuk mengelola sistem.</p>
      </div>
      
      <!-- Session Expired Notification Banner -->
      <div v-if="sessionExpired" class="p-4 bg-amber-50 border-2 border-amber-100 text-amber-700 text-xs font-black uppercase rounded-2xl text-center animate-pulse">
         ⚠️ Sesi Anda telah berakhir. Silakan login kembali.
      </div>

      <form @submit.prevent="handleLoginSubmit" class="space-y-6">
        <div class="space-y-2">
          <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
          <input 
            v-model="creds.username" 
            type="text" 
            class="w-full px-8 py-5 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none transition-all font-bold text-slate-900"
            placeholder="admin"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <input 
            v-model="creds.password" 
            type="password" 
            class="w-full px-8 py-5 rounded-2xl border-2 border-slate-100 focus:border-accent outline-none transition-all font-bold text-slate-900"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-primary hover:bg-slate-800 text-white py-6 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 transition-all disabled:bg-slate-300 active:scale-95"
          >
            {{ loading ? 'Otentikasi...' : 'Masuk Dashboard' }}
          </button>
        </div>
      </form>

      <div class="text-center">
        <router-link to="/" class="text-sm font-bold text-slate-400 hover:text-accent transition-colors">
          &larr; Kembali ke Beranda
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin } from '../api'

const router = useRouter()
const loading = ref(false)
const sessionExpired = ref(false)
const creds = reactive({
  username: '',
  password: ''
})

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('expired') === '1') {
    sessionExpired.value = true
  }
})

const handleLoginSubmit = async () => {
  loading.value = true
  try {
    const res = await adminLogin(creds)
    if (res.success) {
      localStorage.setItem('admin_user', JSON.stringify(res.user))
      if (res.token) {
        localStorage.setItem('admin_token', res.token)
      }
      router.push('/admin/gallery')
    } else {
      alert('⚠️ ' + res.message)
    }
  } catch (error) {
    alert('❌ Terjadi kesalahan koneksi.')
  } finally {
    loading.value = false
  }
}
</script>
