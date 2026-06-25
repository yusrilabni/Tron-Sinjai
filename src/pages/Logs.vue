<template>
  <div class="space-y-12 pb-20">
    <!-- Header -->
    <div class="text-center space-y-4 pt-10">
      <div class="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">
        Aktivitas Sistem
      </div>
      <h1 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">Log <span class="text-blue-700">Pengajuan</span></h1>
      <p class="text-slate-500 font-bold max-w-2xl mx-auto">Riwayat pendaftaran dengan perlindungan data pribadi (Masked Data). Pengajuan yang ditolak dapat diperbaiki jika Admin memberikan izin akses edit.</p>
    </div>

    <!-- Log Table -->
    <div class="max-w-7xl mx-auto px-6">
      <div class="bg-white border-2 border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b-2 border-slate-100">
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Registrasi</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Pengusul & Kontak</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Materi</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status & Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="log in logs" :key="log.no_registrasi" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-6">
                  <div class="flex items-center gap-2 group/id">
                    <div class="font-black text-slate-900 font-mono text-sm tracking-tighter">{{ log.no_registrasi }}</div>
                    <button @click="copyCode(log.no_registrasi)" class="p-1.5 bg-slate-100 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-all opacity-0 group-hover/id:opacity-100" title="Salin Kode">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                  </div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase mt-1">{{ formatDate(log.tanggal) }}</div>
                </td>
                <td class="px-6 py-6">
                  <div class="font-black text-slate-900 uppercase tracking-tight text-[11px] mb-1">{{ log.instansi }}</div>
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {{ log.pic }}
                    </div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 lowercase">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {{ log.email }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6">
                  <div class="text-xs font-black text-slate-700 truncate max-w-[200px]">{{ log.judul }}</div>
                </td>
                <td class="px-6 py-6">
                  <div class="flex flex-col gap-2">
                    <span 
                      class="inline-flex items-center gap-2 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest w-fit"
                      :class="getStatusClass(log.status)"
                    >
                      {{ log.status.replace('_', ' ') }}
                    </span>
                    <p v-if="log.catatan" class="text-[10px] font-bold text-slate-400 italic leading-relaxed max-w-[200px]">
                      "{{ log.catatan }}"
                    </p>
                  </div>
                </td>
              </tr>
              <tr v-if="logs.length === 0 && !loading">
                <td colspan="4" class="px-6 py-20 text-center text-slate-300 font-black uppercase tracking-widest italic">Belum ada riwayat pengajuan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPublicLogs } from '../api'

const logs = ref<any[]>([])
const loading = ref(true)

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await getPublicLogs()
    if (res.success) {
      logs.value = res.data
    }
  } finally {
    loading.value = false
  }
}

const getStatusClass = (s: string) => {
  if (s === 'MENUNGGU_VERIFIKASI') return 'bg-orange-50 text-orange-600 border border-orange-100'
  if (s === 'DISETUJUI') return 'bg-blue-50 text-blue-600 border border-blue-100'
  if (s === 'TAYANG') return 'bg-emerald-600 text-white font-black shadow-md italic'
  if (s === 'DITOLAK') return 'bg-red-50 text-red-600 border border-red-100'
  if (s === 'EXPIRED') return 'bg-slate-100 text-slate-400 border border-slate-200'
  return 'bg-slate-50 text-slate-600'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
  alert('Kode ' + code + ' telah disalin!')
}

onMounted(fetchLogs)
</script>
