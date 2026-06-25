<template>
  <div class="max-w-4xl mx-auto space-y-12 pb-20">
    <div class="text-center space-y-4 px-4 pt-10">
      <div class="inline-flex px-4 py-2 bg-blue-50 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">
        Pelacakan Berkas
      </div>
      <h1 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase">Cek <span class="text-blue-700">Status</span></h1>
      <p class="text-lg text-slate-500 font-bold max-w-xl mx-auto tracking-tight">Masukkan nomor registrasi untuk melihat detail pengajuan Anda.</p>
    </div>

    <div class="bg-white shadow-[0_30px_100px_rgba(0,0,0,0.05)] rounded-2xl border-2 border-slate-100 p-8 md:p-12 space-y-12 relative overflow-hidden">
      
      <!-- Edit Overlay / Modal -->
      <transition name="page">
        <div v-if="isEditing" class="absolute inset-0 z-50 bg-white p-8 md:p-12 overflow-y-auto animate-in fade-in duration-300">
           <div class="flex justify-between items-center mb-10">
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter">Perbaiki <span class="text-blue-700">Pengajuan</span></h3>
              <button @click="isEditing = false" class="text-slate-400 hover:text-slate-900 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
           </div>
           
           <form @submit.prevent="submitUpdate" class="space-y-8">
              <div class="grid md:grid-cols-2 gap-8">
                 <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Judul Materi</label>
                    <input v-model="editForm.judul" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
                 </div>
                 <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Mulai Baru</label>
                    <input v-model="editForm.tanggal_mulai" type="date" :min="todayDate" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
                 </div>
              </div>

              <div class="space-y-4">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metode Berkas Baru (Opsional)</label>
                <div class="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                  <button 
                    type="button" 
                    @click="editUploadType = 'FILE'" 
                    :class="editUploadType === 'FILE' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'"
                    class="py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                  >
                    📁 Upload File
                  </button>
                  <button 
                    type="button" 
                    @click="editUploadType = 'LINK'" 
                    :class="editUploadType === 'LINK' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'"
                    class="py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                  >
                    🔗 Link Drive
                  </button>
                </div>

                <!-- Input Upload File -->
                <div v-if="editUploadType === 'FILE'" class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Unggah Berkas Baru (Maks 100MB)</label>
                  <input type="file" @change="handleNewFile" accept="image/*,video/*" class="w-full text-xs font-black file:bg-slate-900 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4 cursor-pointer" />
                  <p class="text-[9px] font-bold text-slate-400 uppercase">* Kosongkan jika tidak ingin mengganti file.</p>
                </div>

                <!-- Input Link Google Drive -->
                <div v-else class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tautan Google Drive Baru</label>
                  <input v-model="editLinkUrl" type="url" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="https://drive.google.com/file/d/.../view" />
                  <p class="text-[9px] font-bold text-slate-400 uppercase">* Kosongkan jika tidak ingin mengganti link. Pastikan link diatur ke publik dan download diizinkan.</p>
                </div>
              </div>

              <div v-if="updating" class="space-y-2">
                 <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-blue-600">
                    <span>{{ statusLabel }}</span>
                    <span>{{ uploadProgress }}%</span>
                 </div>
                 <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-700 transition-all duration-300" :style="`width: ${uploadProgress}%`"></div>
                 </div>
              </div>

              <button type="submit" :disabled="updating" class="w-full py-6 bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-900 transition-all active:scale-95 disabled:bg-slate-100">
                 {{ updating ? 'Memproses Perubahan...' : 'Simpan & Kirim Ulang' }}
              </button>
           </form>
        </div>
      </transition>

      <form @submit.prevent="handleCheck" class="relative group">
        <input 
          v-model="noReg" 
          type="text" 
          placeholder="TRON-20260603-xxxx" 
          class="w-full px-8 py-6 rounded border-2 border-slate-100 focus:border-blue-700 outline-none text-xl font-black text-slate-900 placeholder:text-slate-200 transition-all pr-40 uppercase tracking-widest"
          required
        />
        <button 
          type="submit" 
          :disabled="loading"
          class="absolute right-3 top-3 bottom-3 px-8 bg-slate-900 hover:bg-blue-700 text-white rounded font-black text-xs uppercase tracking-widest transition-all disabled:bg-slate-200 active:scale-95"
        >
          {{ loading ? 'Mencari...' : 'Cari Data' }}
        </button>
      </form>

      <!-- Detailed Results -->
      <transition name="page">
        <div v-if="statusData" class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <!-- Status Banner -->
          <div class="p-10 rounded-xl border-2 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden" :class="statusColorClass">
            <div class="space-y-2 text-center md:text-left relative z-10">
               <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Status Saat Ini</span>
               <h3 class="text-4xl font-black uppercase tracking-tighter leading-none">{{ statusData.status.replace('_', ' ') }}</h3>
            </div>
            
            <div class="flex flex-col gap-4 relative z-10">
               <div v-if="statusData.catatan" class="bg-white/40 p-6 rounded-lg border border-current/10 max-w-md">
                  <span class="text-[9px] font-black uppercase tracking-widest block mb-2 opacity-60">Catatan Admin:</span>
                  <p class="text-sm font-bold italic">"{{ statusData.catatan }}"</p>
               </div>
               
               <!-- EDIT BUTTON: Only if Rejected AND Admin allowed edit -->
               <button v-if="statusData.status === 'DITOLAK' && statusData.allow_edit" @click="startEdit" class="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-lg font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Perbaiki Materi Sekarang
               </button>
               <p v-else-if="statusData.status === 'DITOLAK'" class="text-[9px] font-black text-red-600 uppercase tracking-widest bg-white/50 px-4 py-2 rounded border border-red-200 italic">
                  * Akses edit belum diberikan oleh admin.
               </p>
            </div>
          </div>

          <!-- Documentation Section (If Status is TAYANG) -->
          <div v-if="statusData.status === 'TAYANG' && statusData.url_dokumentasi" class="bg-blue-700 p-1 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700">
             <div class="bg-slate-900 rounded-[22px] p-4 space-y-6">
                <div class="flex items-center justify-between px-4 pt-2">
                   <div class="flex items-center gap-3">
                      <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                      <span class="text-[10px] font-black text-white uppercase tracking-[0.3em]">Live Documentation</span>
                   </div>
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bukti Penayangan Resmi</span>
                </div>
                <!-- Documentation Media -->
                <div class="aspect-[3/2] bg-black rounded-lg overflow-hidden relative group/doc">
                   <img :src="getPreviewUrl(statusData.url_dokumentasi)" class="w-full h-full object-contain" @error="handleDocError" v-if="!docError" />
                   <div v-else class="w-full h-full flex items-center justify-center text-center p-10">
                      <p class="text-slate-500 font-bold text-xs uppercase tracking-widest">Dokumentasi tersedia.<br/>Silakan klik tombol lihat di bawah.</p>
                   </div>
                   <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-end p-6">
                      <a :href="statusData.url_dokumentasi" target="_blank" class="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                         Buka File Dokumentasi Penuh
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                   </div>
                </div>
             </div>
          </div>

          <!-- Data Grid -->
          <div class="grid md:grid-cols-2 gap-12 pt-6 border-t-2 border-slate-50">
            <!-- Left: Info -->
            <div class="space-y-8">
               <div class="space-y-6">
                 <h4 class="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Informasi Pengaju</h4>
                 <div class="space-y-4">
                    <div class="flex flex-col">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instansi / Unit</span>
                      <span class="text-lg font-black text-slate-900 uppercase">{{ statusData.instansi }}</span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Judul Materi</span>
                      <span class="text-lg font-black text-slate-900">{{ statusData.judul }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jenis</span>
                        <span class="text-sm font-black text-slate-700">{{ statusData.jenis }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</span>
                        <span class="text-sm font-black text-slate-700">{{ statusData.kategori }}</span>
                      </div>
                    </div>
                 </div>
               </div>

               <div class="pt-6 border-t-2 border-slate-50">
                  <a :href="statusData.url" target="_blank" class="inline-flex items-center gap-3 px-6 py-4 bg-slate-100 hover:bg-blue-700 hover:text-white rounded font-black text-xs uppercase tracking-widest transition-all w-full justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Buka Link File Asli
                  </a>
               </div>
            </div>

            <!-- Right: Original Material Preview -->
            <div class="space-y-6">
               <h4 class="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Materi Pendaftaran</h4>
               <div class="aspect-[3/2] bg-slate-100 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-200 relative group/preview">
                  <img v-if="statusData.url && !imageError" :src="getPreviewUrl(statusData.url)" class="w-full h-full object-contain bg-slate-900 transition-opacity duration-300" @error="handleImageError" alt="Preview" />
                  <div v-if="imageError || !statusData.url" class="w-full h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                     <div class="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover/preview:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                     <p class="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] leading-relaxed">Pratinjau tidak dapat dimuat langsung.<br/><span class="text-blue-600">Gunakan tombol buka link di samping.</span></p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { checkStatus, post } from '../api'

const noReg = ref('')
const loading = ref(false)
const statusData = ref<any>(null)
const imageError = ref(false)
const docError = ref(false)
const todayDate = new Date().toISOString().split('T')[0]

// Edit State
const isEditing = ref(false)
const updating = ref(false)
const uploadProgress = ref(0)
const statusLabel = ref('Menyiapkan...')
const editUploadType = ref('FILE')
const editLinkUrl = ref('')
const editForm = reactive({
  judul: '',
  tanggal_mulai: '',
  fileObject: null as File | null,
  fileName: '',
  mimeType: ''
})

const handleCheck = async () => {
  loading.value = true
  statusData.value = null
  imageError.value = false
  docError.value = false
  try {
    const res = await checkStatus(noReg.value)
    if (res.success) {
      statusData.value = res.data
    } else {
      alert('⚠️ ' + res.message)
    }
  } catch (error) {
    alert('❌ Terjadi kesalahan saat menghubungi server.')
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  editForm.judul = statusData.value.judul
  editForm.tanggal_mulai = statusData.value.tanggal_mulai ? statusData.value.tanggal_mulai.split('T')[0] : ''
  editForm.fileObject = null
  editForm.fileName = ''
  isEditing.value = true
}

const handleNewFile = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 100 * 1024 * 1024) return alert('File maksimal 100MB.')
  editForm.fileObject = file
  editForm.fileName = file.name
  editForm.mimeType = file.type
}

const uploadInChunks = async (file: File, onProgress: (pct: number) => void): Promise<{ uploadId: string, totalChunks: number }> => {
  const CHUNK_SIZE = 60 * 1024 
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const uploadId = 'up_edit_' + Date.now()

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    const chunkBase64 = await new Promise<string>((resolve) => {
      const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(chunk)
    })
    const res = await post('uploadChunk', { uploadId, chunkIndex: i, chunkData: chunkBase64 })
    if (!res.success) throw new Error(res.message)
    if (i % 10 === 0 || i === totalChunks - 1) onProgress(Math.round(((i + 1) / totalChunks) * 100))
  }
  return { uploadId, totalChunks }
}

const submitUpdate = async () => {
  updating.value = true
  uploadProgress.value = 0
  
  try {
    let finalFileUrl = ""
    let isLink = false
    
    if (editUploadType.value === 'FILE' && editForm.fileObject) {
       statusLabel.value = 'Mengunggah File Baru...'
       const chunkInfo = await uploadInChunks(editForm.fileObject, (pct) => { uploadProgress.value = pct })
       statusLabel.value = 'Menyusun File...'
       uploadProgress.value = 99
       
       const sanitizedTitle = editForm.judul.substring(0, 20).replace(/[^a-z0-9]/gi, '-');
       const finalFileName = `REG_REVISI_${sanitizedTitle}_${Date.now()}`;

       const assembleRes = await post('assembleChunkFile', {
          uploadId: chunkInfo.uploadId, totalChunks: chunkInfo.totalChunks,
          fileName: finalFileName, mimeType: editForm.mimeType
       })
       if (!assembleRes.success) throw new Error(assembleRes.message)
       finalFileUrl = assembleRes.fileUrl
    } else if (editUploadType.value === 'LINK' && editLinkUrl.value) {
       statusLabel.value = 'Memvalidasi Link Google Drive...'
       uploadProgress.value = 50
       if (!editLinkUrl.value.includes('drive.google.com') && !editLinkUrl.value.includes('docs.google.com')) {
         throw new Error('Harap masukkan link Google Drive yang valid.')
       }
       finalFileUrl = editLinkUrl.value
       isLink = true
    }

    statusLabel.value = 'Memperbarui Data...'
    uploadProgress.value = 90
    const res = await post('updateSubmission', {
       no_registrasi: statusData.value.no_registrasi,
       judul: editForm.judul,
       tanggal_mulai: editForm.tanggal_mulai,
       fileUrl: finalFileUrl,
       isLinkSubmission: isLink
    })

    if (res.success) {
        alert('✅ Pengajuan berhasil diperbarui dan dikirim ulang!')
        isEditing.value = false
        editLinkUrl.value = ''
        editForm.fileObject = null
        editForm.fileName = ''
        handleCheck() // Refresh data
    } else {
        alert('❌ Gagal: ' + res.message)
    }
  } catch (error: any) {
    console.error(error); alert('Terjadi kesalahan perbaikan: ' + error.message)
  } finally {
    updating.value = false
  }
}

const handleImageError = () => { imageError.value = true }
const handleDocError = () => { docError.value = true }

const getPreviewUrl = (url: string) => {
  if (!url) return ''
  let fileId = ''
  if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0]
  else if (url.includes('/d/')) fileId = url.split('/d/')[1].split('/')[0]
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  return url
}

const statusColorClass = computed(() => {
  if (!statusData.value) return ''
  const status = statusData.value.status
  if (status === 'MENUNGGU_VERIFIKASI') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (status === 'DISETUJUI') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'TAYANG') return 'bg-blue-600 text-white border-blue-700 shadow-xl'
  if (status === 'DITOLAK') return 'bg-red-50 text-red-700 border-red-200'
  if (status === 'EXPIRED') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
})
</script>
