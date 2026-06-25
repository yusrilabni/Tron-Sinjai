<template>
  <div class="space-y-10 pb-20">
    <!-- Header -->
    <div class="bg-white p-8 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase">Audit <span class="text-blue-700">Aktivitas</span></h1>
        <p class="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Riwayat Tindakan Administrator</p>
      </div>
      <button @click="fetchLogs" class="px-6 py-3 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all">
        Refresh Log
      </button>
    </div>

    <!-- Timeline Body -->
    <div class="max-w-4xl mx-auto px-6">
      <div v-if="loading" class="space-y-6">
         <div v-for="i in 5" :key="i" class="h-24 bg-slate-50 animate-pulse rounded-2xl"></div>
      </div>

      <div v-else-if="logs.length > 0" class="relative space-y-6 before:absolute before:inset-y-0 before:left-8 before:w-0.5 before:bg-slate-100">
        <div v-for="(log, idx) in logs" :key="idx" class="relative pl-20 group">
           <!-- Dot -->
           <div class="absolute left-[30px] top-8 w-4 h-4 bg-white border-4 border-slate-300 rounded-full z-10 group-hover:border-blue-600 transition-colors"></div>
           
           <div class="bg-white p-8 rounded-2xl border-2 border-slate-100 group-hover:border-blue-100 group-hover:shadow-xl transition-all space-y-3">
              <div class="flex justify-between items-start">
                 <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded">{{ log.action }}</span>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ log.user }}</span>
                 </div>
                 <span class="text-[10px] font-bold text-slate-400 font-mono">{{ formatFullDate(log.timestamp) }}</span>
              </div>
              <p class="text-slate-700 font-bold leading-relaxed text-sm">{{ log.details }}</p>
           </div>
        </div>
      </div>

      <div v-else class="text-center py-32 bg-slate-50 rounded-3xl border-4 border-dashed border-slate-100">
         <p class="text-slate-300 font-black uppercase tracking-widest italic text-lg">Belum Ada Aktivitas Tercatat</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLogs } from '../../api'

const logs = ref<any[]>([])
const loading = ref(true)

const fetchLogs = async () => {
  loading.value = true
  try {
    const res = await getLogs()
    if (res.success) logs.value = res.data
  } finally {
    loading.value = false
  }
}

const formatFullDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  }).format(date)
}

onMounted(fetchLogs)
</script>
