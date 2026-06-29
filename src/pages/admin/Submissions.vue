<template>
  <div class="space-y-10 pb-20">
    <!-- Header with Modal Trigger -->
    <div class="bg-white p-8 border-b-2 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter uppercase">Daftar <span class="text-blue-700">Pengajuan</span></h1>
        <p class="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Verifikasi & Persetujuan Materi</p>
      </div>
      
      <div class="flex items-center gap-4">
        <button @click="showSettingsModal = true" class="px-6 py-3 bg-white border-2 border-slate-900 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           Pengaturan Sistem
        </button>
        <button @click="confirmReset" class="px-6 py-3 bg-red-50 text-red-600 rounded-lg font-black text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-95">
          Reset Data
        </button>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-8 border-2 border-slate-100 rounded-2xl space-y-2">
        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ stat.label }}</div>
        <div class="text-4xl font-black text-slate-900 tracking-tighter">{{ stat.count }}</div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="px-6">
      <div class="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 border-b-2 border-slate-100">
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">ID & Tanggal</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Instansi & Materi</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status & Jadwal</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Bukti Tayang</th>
                <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y-2 divide-slate-50">
              <tr v-for="sub in submissions" :key="sub.no_registrasi" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-8">
                  <div class="font-black text-slate-900 text-sm tracking-tight">{{ sub.no_registrasi }}</div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase mt-1">{{ formatDate(sub.tanggal) }}</div>
                </td>
                <td class="px-6 py-8">
                  <div class="font-black text-slate-900 leading-none mb-1.5 uppercase tracking-tight text-sm">{{ sub.instansi }}</div>
                  <div class="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Materi: {{ sub.judul }}</div>
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">{{ sub.jenis }}</span>
                    <span v-if="sub.biaya > 0" class="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">Rp{{ formatIDR(sub.biaya) }} ({{ sub.durasi }} {{ sub.satuan }})</span>
                  </div>
                </td>
                <td class="px-6 py-8">
                  <div class="space-y-2">
                    <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest" :class="getStatusClass(sub.status)">
                      <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(sub.status)"></span>
                      {{ sub.status.replace('_', ' ') }}
                    </span>
                    
                    <div v-if="sub.tanggal_mulai && ['DISETUJUI', 'TAYANG', 'EXPIRED'].includes(sub.status)" class="space-y-0.5">
                      <div class="text-[9px] font-bold text-slate-500 uppercase">
                        Mulai: {{ formatDate(sub.tanggal_mulai) }}
                      </div>
                      <div class="text-[9px] font-bold text-slate-500 uppercase">
                        Durasi: {{ sub.durasi }} {{ sub.satuan }}
                      </div>
                      <div v-if="sub.status === 'TAYANG'" class="text-[9px] font-black text-blue-700 uppercase">
                        Sisa Aktif: {{ sub.sisa_hari }} Hari
                      </div>
                    </div>

                    <div v-if="sub.allow_edit" class="flex items-center gap-1.5 text-[9px] font-black text-amber-600 uppercase tracking-widest italic animate-pulse">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                       User Bisa Edit
                    </div>
                  </div>
                </td>
                <td class="px-6 py-8">
                  <!-- Inline Proof Documentation Upload for DISETUJUI, TAYANG, or EXPIRED -->
                  <div v-if="['DISETUJUI', 'TAYANG', 'EXPIRED'].includes(sub.status)" class="space-y-1.5">
                    <div v-if="!sub.url_dokumentasi" class="space-y-1.5">
                      <div class="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-1">
                         <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                         Belum Selesai (Belum Upload Bukti!)
                      </div>
                      <label class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                         Upload Bukti
                         <input type="file" @change="uploadProofInline($event, sub)" accept="image/*,video/*" class="hidden" />
                      </label>
                    </div>
                    <div v-else class="flex flex-col gap-1.5">
                      <div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                         <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         Selesai (Bukti Terunggah)
                      </div>
                      <div class="flex items-center gap-2">
                        <a :href="sub.url_dokumentasi" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all w-fit shadow-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           Lihat Bukti
                        </a>
                        <label class="inline-flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 cursor-pointer transition-colors w-fit pl-1">
                           Ganti Bukti
                           <input type="file" @change="uploadProofInline($event, sub)" accept="image/*,video/*" class="hidden" />
                        </label>
                      </div>
                    </div>
                    <!-- Progress Row Indicator -->
                    <div v-if="rowProgress[sub.no_registrasi] !== undefined" class="text-[9px] font-black text-blue-700 uppercase tracking-wider animate-pulse pt-1">
                       Mengunggah: {{ rowProgress[sub.no_registrasi] }}%
                    </div>
                  </div>
                  <div v-else class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    -
                  </div>
                </td>
                <td class="px-6 py-8 text-right">
                  <div class="flex items-center justify-end gap-3">
                    <div v-if="sub.url && sub.url.includes('|')" class="flex flex-wrap items-center gap-1 max-w-[150px] justify-end">
                      <a v-for="(url, idx) in sub.url.split('|')" :key="idx" :href="url" target="_blank" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-[9px] font-black uppercase tracking-widest transition-all text-slate-500" :title="`Lihat Materi ${Number(idx) + 1}`">
                        Materi {{ Number(idx) + 1 }}
                      </a>
                    </div>
                    <a v-else-if="sub.url" :href="sub.url" target="_blank" class="p-2.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg transition-all text-slate-500" title="Lihat Materi Asli">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </a>
                    
                    <button @click="openAction(sub)" class="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-blue-700 transition-all">
                      Kelola
                    </button>
                    <button @click="confirmDelete(sub.no_registrasi)" class="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus Data">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <transition name="page">
      <div v-if="showSettingsModal" class="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="p-8 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50">
            <div class="flex items-center gap-3 text-blue-700">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               <h3 class="font-black text-slate-900 uppercase tracking-tighter">Konfigurasi Sistem</h3>
            </div>
            <button @click="showSettingsModal = false" class="text-slate-400 hover:text-slate-900"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <div class="p-10 space-y-12 overflow-y-auto max-h-[70vh]">
            <div class="space-y-6">
              <div class="flex items-center gap-4">
                 <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">A. Tarif Penayangan</div>
                 <div class="flex-grow h-px bg-slate-100"></div>
              </div>
              <div class="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 flex items-center justify-between">
                <div class="space-y-1">
                  <p class="text-[9px] font-black text-blue-700 uppercase">Harga Per Hari</p>
                  <p class="text-xs font-bold text-slate-500">Biaya dasar iklan komersial.</p>
                </div>
                <div class="relative">
                  <span class="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">Rp</span>
                  <input :value="formatIDR(settings.PRICE_PER_DAY)" @input="handlePriceInput" type="text" class="pl-12 pr-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-700 outline-none transition-all font-black text-lg w-48 text-right" />
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-center gap-4">
                 <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">B. Daftar Kontak Petugas</div>
                 <div class="flex-grow h-px bg-slate-100"></div>
              </div>
              <div class="space-y-4">
                <div v-for="(admin, idx) in adminContacts" :key="idx" class="flex gap-4 items-end bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 group">
                  <div class="flex-grow grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                       <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Nama Petugas</label>
                       <input v-model="admin.name" type="text" class="w-full px-4 py-3 rounded-lg border-2 border-slate-200 font-bold text-sm focus:border-slate-900 outline-none bg-white uppercase" />
                    </div>
                    <div class="space-y-1">
                       <label class="text-[9px] font-black text-slate-400 uppercase ml-1">Nomor WhatsApp</label>
                       <input v-model="admin.phone" type="text" class="w-full px-4 py-3 rounded-lg border-2 border-slate-200 font-bold text-sm focus:border-slate-900 outline-none bg-white" />
                    </div>
                  </div>
                  <button @click="removeContact(idx)" class="p-3 text-red-400 hover:text-red-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
                <button @click="addContact" class="w-full py-4 border-2 border-dashed border-slate-300 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-700 hover:text-blue-700 transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
                  Tambah Kontak Admin
                </button>
              </div>
            </div>

            <button @click="saveSettings" :disabled="savingSettings" class="w-full py-6 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-700 transition-all disabled:bg-slate-300">
               {{ savingSettings ? 'Menyimpan...' : 'Simpan Seluruh Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal Kelola Status (Update) -->
    <transition name="page">
      <div v-if="activeSub" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] animate-in zoom-in-95 duration-200">
          
          <!-- Modal Header -->
          <div class="p-6 border-b-2 border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <h3 class="font-black text-slate-900 uppercase tracking-tight text-sm">Manajemen Status</h3>
            <button @click="activeSub = null" class="text-slate-400 hover:text-slate-900 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <!-- Modal Body (Scrollable Area) -->
          <div class="p-6 space-y-4 overflow-y-auto flex-grow min-h-0">
            <div class="p-6 bg-slate-50 rounded border-2 border-slate-100 space-y-4">
               <div class="flex justify-between items-start">
                  <div>
                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Registrasi</div>
                     <div class="font-black text-slate-900 font-mono text-sm">{{ activeSub.no_registrasi }}</div>
                  </div>
                  <div class="text-right" v-if="activeSub.biaya > 0">
                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tagihan</div>
                     <div class="font-black text-emerald-700">Rp{{ formatIDR(activeSub.biaya) }}</div>
                  </div>
               </div>
            </div>

            <!-- Status Choice -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Tindakan</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  @click="updateForm.status = 'DISETUJUI'" 
                  :class="updateForm.status === 'DISETUJUI' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-100'" 
                  class="py-3 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Diterima (Sesuai Jadwal)
                </button>
                <button 
                  type="button"
                  @click="updateForm.status = 'TAYANG'" 
                  :class="updateForm.status === 'TAYANG' ? 'bg-blue-700 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-100'" 
                  class="py-3 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Diterima (Langsung Tayang)
                </button>
                <button 
                  type="button"
                  @click="updateForm.status = 'EXPIRED'" 
                  :class="updateForm.status === 'EXPIRED' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-100'" 
                  class="py-3 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Set Kedaluwarsa
                </button>
                <button 
                  type="button"
                  @click="updateForm.status = 'DITOLAK'" 
                  :class="updateForm.status === 'DITOLAK' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-100'" 
                  class="py-3 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Ditolak
                </button>
              </div>
            </div>

            <!-- Pengaturan Tanggal & Durasi Tayang -->
            <div class="space-y-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100">
               <div class="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center justify-between">
                 <span class="flex items-center gap-1.5">📅 Jadwal & Durasi Tayang</span>
                 <span v-if="updateForm.satuan === 'HARI' && updateForm.durasi < 3" class="text-[8px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">⚠️ &lt; 3 Hari</span>
               </div>

               <!-- Pilihan Metode Durasi -->
               <div v-if="updateForm.satuan !== 'SELAMANYA'" class="flex gap-2 p-1 bg-slate-200/60 rounded-xl">
                 <button 
                   type="button" 
                   @click="updateCaraDurasi = 'DURASI'"
                   :class="updateCaraDurasi === 'DURASI' ? 'bg-white text-blue-700 shadow font-black' : 'text-slate-500 font-bold hover:text-slate-900'"
                   class="flex-1 py-1.5 text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                 >
                   🗓️ Durasi Hari
                 </button>
                 <button 
                   type="button" 
                   @click="updateCaraDurasi = 'TANGGAL_AKHIR'"
                   :class="updateCaraDurasi === 'TANGGAL_AKHIR' ? 'bg-white text-blue-700 shadow font-black' : 'text-slate-500 font-bold hover:text-slate-900'"
                   class="flex-1 py-1.5 text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                 >
                   🏁 Tanggal Mulai - Akhir
                 </button>
               </div>

               <!-- Tanggal Mulai -->
               <div class="space-y-1.5">
                 <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Mulai Tayang</label>
                 <input 
                   v-model="updateForm.tanggal_mulai" 
                   type="date" 
                   class="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-blue-700 outline-none transition-all font-black text-slate-900 text-xs" 
                   required 
                 />
               </div>

               <!-- If method: TANGGAL_AKHIR -->
               <div v-if="updateForm.satuan !== 'SELAMANYA' && updateCaraDurasi === 'TANGGAL_AKHIR'" class="space-y-1.5">
                 <div class="flex justify-between items-center">
                   <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Akhir Tayang</label>
                   <span v-if="updateForm.tanggal_mulai && updateTanggalAkhir && updateForm.durasi > 0" class="text-[9px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                     = {{ updateForm.durasi }} Hari Tayang
                   </span>
                 </div>
                 <input 
                   v-model="updateTanggalAkhir" 
                   type="date" 
                   :min="updateForm.tanggal_mulai" 
                   class="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-blue-700 outline-none transition-all font-black text-slate-900 text-xs" 
                   required 
                 />
               </div>

               <!-- If method: DURASI -->
               <div v-else class="space-y-1.5">
                 <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Durasi Penayangan</label>
                 <div class="flex gap-2">
                   <input 
                     v-if="updateForm.satuan !== 'SELAMANYA'"
                     v-model="updateForm.durasi" 
                     type="number" 
                     min="1" 
                     max="999" 
                     class="flex-grow px-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-blue-700 outline-none transition-all font-black text-slate-900 text-xs" 
                     required 
                   />
                   <div v-else class="flex-grow px-4 py-3 rounded-xl bg-white border-2 border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center">
                     ♾️ Tanpa Batas Waktu
                   </div>
                   <select 
                     v-model="updateForm.satuan" 
                     class="w-32 px-3 rounded-xl bg-blue-50 border-2 border-blue-100 font-black text-[9px] uppercase tracking-widest outline-none text-blue-700"
                   >
                     <option value="HARI">Hari</option>
                     <option value="MINGGU">Minggu</option>
                     <option value="BULAN">Bulan</option>
                     <option value="TAHUN">Tahun</option>
                     <option value="SELAMANYA">Selamanya</option>
                   </select>
                 </div>
               </div>
            </div>

            <!-- Conditional File Upload for TAYANG -->
            <div v-if="updateForm.status === 'TAYANG'" class="space-y-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-100 animate-in slide-in-from-top-2 duration-300">
               <label class="text-[10px] font-black text-blue-700 uppercase tracking-widest">Dokumentasi Tayang</label>
               <input type="file" @change="handleDocUpload" accept="image/*,video/*" class="w-full text-[10px] font-black file:bg-blue-700 file:text-white file:border-0 file:px-4 file:py-2 file:rounded cursor-pointer" />
               <p class="text-[9px] font-bold text-blue-400 uppercase">* Foto/Video materi saat sudah tampil di videotron (bisa diunggah nanti langsung pada baris tabel utama).</p>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan Admin</label>
              <textarea v-model="updateForm.catatan" rows="3" class="w-full px-6 py-4 rounded border-2 border-slate-100 focus:border-blue-700 outline-none transition-all font-bold text-sm" placeholder="Tulis alasan/info..."></textarea>
            </div>

            <!-- Allow Edit Toggle (Only for DITOLAK or special cases) -->
            <div v-if="updateForm.status === 'DITOLAK'" class="flex items-center justify-between p-4 bg-amber-50 rounded-xl border-2 border-amber-100 animate-in slide-in-from-top-2">
               <div class="space-y-0.5">
                  <p class="text-[10px] font-black text-amber-700 uppercase tracking-widest">Izinkan Perbaikan</p>
                  <p class="text-[9px] font-bold text-amber-500 uppercase">User dapat mengedit data & file materi.</p>
               </div>
               <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="updateForm.allow_edit" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
               </label>
            </div>
          </div>
          
          <!-- Modal Footer (Fixed at bottom of modal) -->
          <div class="p-6 bg-slate-50 border-t-2 border-slate-100 flex justify-end gap-3 shrink-0">
            <button @click="activeSub = null" class="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">Batal</button>
            <button 
              @click="handleUpdate" 
              :disabled="updating || !updateForm.status" 
              class="px-8 py-3 bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all cursor-pointer disabled:bg-slate-200"
            >
               {{ updating ? 'Memproses...' : 'Update & Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { getSubmissions, updateSubmissionStatus, deleteSubmission, resetSubmissions, getSettings, updateSettings, post } from '../../api'

const submissions = ref<any[]>([])
const settings = reactive({ PRICE_PER_DAY: 0 })
const adminContacts = ref<any[]>([])
const loading = ref(true)
const updating = ref(false)
const savingSettings = ref(false)
const showSettingsModal = ref(false)
const activeSub = ref<any>(null)

const updateForm = reactive({ 
  status: '', 
  catatan: '', 
  docBase64: '', 
  docMimeType: '', 
  allow_edit: false, 
  tanggal_mulai: '',
  durasi: 1,
  satuan: 'HARI'
})

const updateCaraDurasi = ref('DURASI')
const updateTanggalAkhir = ref('')

const calculateUpdateDurationFromDates = () => {
  if (updateCaraDurasi.value === 'TANGGAL_AKHIR' && updateForm.tanggal_mulai && updateTanggalAkhir.value) {
    const start = new Date(updateForm.tanggal_mulai)
    const end = new Date(updateTanggalAkhir.value)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24))
    if (diffDays >= 0) {
      updateForm.durasi = diffDays
      updateForm.satuan = 'HARI'
    } else {
      updateForm.durasi = 0
    }
  }
}

watch([() => updateForm.tanggal_mulai, updateTanggalAkhir, updateCaraDurasi], () => {
  if (updateCaraDurasi.value === 'TANGGAL_AKHIR') {
    calculateUpdateDurationFromDates()
  }
})

watch(() => updateForm.satuan, (newVal) => {
  if (newVal === 'SELAMANYA') {
    updateForm.durasi = 1
  }
})

const rowProgress = ref<Record<string, number>>({})

const uploadProofInline = async (e: any, sub: any) => {
  const file = e.target.files[0]
  if (!file) return
  
  if (file.size > 100 * 1024 * 1024) {
    alert('File terlalu besar! Maksimal 100MB.')
    return
  }
  
  rowProgress.value[sub.no_registrasi] = 0
  
  try {
    const CHUNK_SIZE = 60 * 1024 
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
    const uploadId = 'up_inline_doc_' + Date.now()
    
    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      const chunkBase64 = await new Promise<string>((resolve) => {
        const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(chunk)
      })
      const res = await post('uploadChunk', { uploadId, chunkIndex: i, chunkData: chunkBase64 })
      if (!res.success) throw new Error(res.message)
      rowProgress.value[sub.no_registrasi] = Math.round(((i + 1) / totalChunks) * 100)
    }
    
    const finalFileName = `DOC_${sub.no_registrasi}_${Date.now()}`;
    const assembleRes = await post('assembleChunkFile', {
      uploadId,
      totalChunks,
      fileName: finalFileName,
      mimeType: file.type
    })
    
    if (!assembleRes.success) throw new Error(assembleRes.message)
    
    const updateRes = await updateSubmissionStatus({
      no_registrasi: sub.no_registrasi,
      status: sub.status,
      catatan: sub.catatan || '',
      docUrlDirect: assembleRes.fileUrl
    })
    
    if (updateRes.success) {
      alert('✅ Bukti penayangan berhasil diunggah!')
      fetchAll()
    } else {
      alert('❌ Gagal mengupdate data: ' + updateRes.message)
    }
  } catch (error: any) {
    console.error(error)
    alert('❌ Gagal mengunggah bukti: ' + (error.message || 'Error koneksi'))
  } finally {
    delete rowProgress.value[sub.no_registrasi]
  }
}

const stats = computed(() => [
  { label: 'Pending', count: submissions.value.filter(s => s.status === 'MENUNGGU_VERIFIKASI').length },
  { label: 'Disetujui', count: submissions.value.filter(s => s.status === 'DISETUJUI').length },
  { label: 'Tayang', count: submissions.value.filter(s => s.status === 'TAYANG').length },
  { label: 'Kadaluarsa', count: submissions.value.filter(s => s.status === 'EXPIRED').length },
  { label: 'Ditolak', count: submissions.value.filter(s => s.status === 'DITOLAK').length },
  { label: 'Total', count: submissions.value.length },
])

const formatIDR = (val: any) => {
  if (val === undefined || val === null) return '0'
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const handlePriceInput = (e: any) => {
  const rawValue = e.target.value.replace(/\./g, '')
  settings.PRICE_PER_DAY = parseInt(rawValue) || 0
}

const fetchAll = async () => {
  loading.value = true
  try {
    const [subRes, setRes] = await Promise.all([getSubmissions(), getSettings()])
    if (subRes.success) submissions.value = subRes.data
    if (setRes.success) {
      settings.PRICE_PER_DAY = setRes.data.PRICE_PER_DAY
      adminContacts.value = Array.isArray(setRes.data.CONTACT_LIST) ? setRes.data.CONTACT_LIST : []
    }
  } finally { loading.value = false }
}

const addContact = () => adminContacts.value.push({ name: '', phone: '62' })
const removeContact = (idx: number) => adminContacts.value.splice(idx, 1)

const saveSettings = async () => {
  if (savingSettings.value) return
  savingSettings.value = true
  try {
    const res = await updateSettings({ PRICE_PER_DAY: settings.PRICE_PER_DAY, CONTACT_LIST: adminContacts.value })
    if (res.success) { alert('✅ Pengaturan berhasil diperbarui!'); showSettingsModal.value = false }
  } finally { savingSettings.value = false }
}

const openAction = (sub: any) => {
  activeSub.value = sub
  updateForm.status = sub.status === 'MENUNGGU_VERIFIKASI' ? '' : sub.status
  updateForm.catatan = sub.catatan || ''
  updateForm.allow_edit = sub.allow_edit || false
  
  let startDateStr = ''
  if (sub.tanggal_mulai) {
    try {
      const d = new Date(sub.tanggal_mulai)
      if (!isNaN(d.getTime())) {
        const tzOffset = d.getTimezoneOffset() * 60000
        const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10)
        startDateStr = localISOTime
      } else {
        startDateStr = String(sub.tanggal_mulai).split('T')[0]
      }
    } catch(e) {
      startDateStr = String(sub.tanggal_mulai).split('T')[0]
    }
  } else {
    startDateStr = new Date().toISOString().split('T')[0]
  }
  
  updateForm.tanggal_mulai = startDateStr
  updateForm.durasi = parseInt(sub.durasi) || 1
  updateForm.satuan = sub.satuan || 'HARI'
  updateForm.docBase64 = ''
  updateForm.docMimeType = ''
  
  updateCaraDurasi.value = 'DURASI'
  if (startDateStr && updateForm.durasi > 0 && updateForm.satuan !== 'SELAMANYA') {
    try {
      const startParts = startDateStr.split('-')
      const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
      let multiplier = 1
      if (updateForm.satuan === 'MINGGU') multiplier = 7
      if (updateForm.satuan === 'BULAN') multiplier = 30
      if (updateForm.satuan === 'TAHUN') multiplier = 365
      const endDate = new Date(start.getTime() + (updateForm.durasi * multiplier * 24 * 60 * 60 * 1000))
      const tzOffset = endDate.getTimezoneOffset() * 60000
      updateTanggalAkhir.value = (new Date(endDate.getTime() - tzOffset)).toISOString().slice(0, 10)
    } catch(e) {
      updateTanggalAkhir.value = ''
    }
  } else {
    updateTanggalAkhir.value = ''
  }
}

const handleDocUpload = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    updateForm.docBase64 = reader.result as string
    updateForm.docMimeType = file.type
  }
  reader.readAsDataURL(file)
}

const handleUpdate = async () => {
  if (updating.value) return
  if (updateCaraDurasi.value === 'TANGGAL_AKHIR') {
    if (!updateTanggalAkhir.value) return alert('Pilih tanggal akhir tayang.')
    if (updateForm.durasi <= 0) return alert('Tanggal akhir tayang harus setelah tanggal mulai tayang.')
  }
  updating.value = true
  try {
    const res = await updateSubmissionStatus({ 
      no_registrasi: activeSub.value.no_registrasi, 
      status: updateForm.status,
      catatan: updateForm.catatan,
      docBase64: updateForm.docBase64,
      docMimeType: updateForm.docMimeType,
      allow_edit: updateForm.allow_edit,
      tanggal_mulai: updateForm.tanggal_mulai,
      durasi: updateForm.durasi,
      satuan: updateForm.satuan
    })
    if (res.success) { activeSub.value = null; fetchAll() }
  } finally { updating.value = false }
}

const confirmDelete = async (noReg: string) => {
  if (confirm(`Hapus data ${noReg}?`)) {
    try {
      const res = await deleteSubmission(noReg)
      if (res.success) fetchAll()
    } catch (e) { alert('Gagal menghapus') }
  }
}

const confirmReset = async () => {
  if (confirm('RESET TOTAL? Seluruh database & Drive akan dikosongkan permanen!')) {
    try {
      const res = await resetSubmissions()
      if (res.success) { alert('Sistem telah direset total!'); fetchAll() }
    } catch (e) { alert('Gagal reset') }
  }
}

const getStatusClass = (s: string) => {
  if (s === 'MENUNGGU_VERIFIKASI') return 'bg-orange-50 text-orange-700 border border-orange-200'
  if (s === 'DISETUJUI') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (s === 'TAYANG') return 'bg-blue-50 text-blue-700 border border-blue-200'
  if (s === 'DITOLAK') return 'bg-red-50 text-red-700 border border-red-200'
  if (s === 'EXPIRED') return 'bg-amber-50 text-amber-700 border border-amber-200'
  return 'bg-slate-50 text-slate-700'
}

const getStatusDotClass = (s: string) => {
  if (s === 'MENUNGGU_VERIFIKASI') return 'bg-orange-500'
  if (s === 'DISETUJUI') return 'bg-emerald-500'
  if (s === 'TAYANG') return 'bg-blue-500 animate-pulse'
  if (s === 'DITOLAK') return 'bg-red-500'
  if (s === 'EXPIRED') return 'bg-amber-500'
  return 'bg-slate-400'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

onMounted(fetchAll)
</script>
