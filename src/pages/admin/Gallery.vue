<template>
  <div class="space-y-10 pb-20 pt-6">
    <!-- Breadcrumb & Title -->
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>Admin</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
          <span class="text-blue-600">Gallery</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Manajemen <span class="text-blue-700">Konten</span></h1>
      </div>
      
      <!-- Stats Brief -->
      <div class="bg-slate-50 px-8 py-4 rounded-2xl border-2 border-slate-100 flex items-center gap-6">
        <div class="space-y-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Total Koleksi</span>
          <p class="text-2xl font-black text-blue-700 leading-none">{{ gallery.length }}</p>
        </div>
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10">
      
      <!-- Left: Sidebar Upload & Content Groups -->
      <div class="lg:col-span-4 space-y-8">
        
        <!-- Card 1: Content Groups -->
        <div class="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-2xl">
          <div class="bg-slate-900 p-6 flex items-center justify-between">
            <h2 class="text-sm font-black text-white uppercase tracking-[0.2em]">Grup Konten</h2>
            <button 
              @click="showCreateGroupModal = true" 
              class="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded font-black text-[9px] uppercase tracking-widest transition-all"
            >
              + Grup Baru
            </button>
          </div>
          
          <div class="p-6 space-y-6">
            <div v-if="groups.length === 0" class="py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-widest border border-dashed border-slate-200 rounded-2xl">
              Belum ada grup dibuat
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="group in groups" 
                :key="group.id" 
                class="p-4 bg-slate-50 border rounded-2xl transition-all space-y-3 relative group/card"
                :class="dragOverGroupId === group.id ? 'border-blue-700 bg-blue-50/20 ring-4 ring-blue-500/10' : 'border-slate-200 hover:border-blue-500'"
                @dragover.prevent
                @dragenter="onDragEnter(group.id)"
                @dragleave="onDragLeave"
                @drop="onDropOnGroup($event, group)"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-black text-slate-900 text-xs uppercase tracking-tight">{{ group.nama }}</h4>
                    <p class="text-[9px] font-bold text-slate-400 line-clamp-1 mt-0.5">{{ group.deskripsi || 'Tidak ada deskripsi' }}</p>
                  </div>
                  <button @click="handleDeleteGroupClick(group.id)" class="text-slate-300 hover:text-red-600 transition-colors p-1" title="Hapus Grup">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <!-- Drop Zone Indicator -->
                <div 
                  :class="dragOverGroupId === group.id ? 'bg-blue-100 border-blue-400 text-blue-700 font-extrabold' : 'bg-white border-slate-300 text-slate-400'"
                  class="border border-dashed rounded-xl p-3 text-center transition-all text-[8px] font-black uppercase"
                >
                  📂 Drop media di sini ({{ group.item_ids.length }} item)
                </div>
                
                <div class="flex justify-end gap-2 pt-1">
                  <button @click="openManageGroup(group)" class="px-2.5 py-1 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 rounded font-black text-[8px] uppercase tracking-widest transition-all">
                    Urutkan / Kelola
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Upload Form -->
        <div class="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-2xl">
          <div class="bg-slate-900 p-6 flex items-center justify-between">
            <h2 class="text-sm font-black text-white uppercase tracking-[0.2em]">Upload Materi</h2>
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <form @submit.prevent="handleUpload" class="p-8 space-y-8">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Publikasi</label>
              <input v-model="form.judul" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" placeholder="Misal: Ucapan HUT Sinjai..." required />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Instansi / Usaha</label>
              <input v-model="form.instansi" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" placeholder="Misal: Dinas Kesehatan / Kedai Kopi..." required />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Konten</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  @click="form.jenis = 'OPD'; form.kategori = ''; caraDurasi = 'DURASI'; tanggalAkhir = '';"
                  :class="form.jenis === 'OPD' ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'"
                  class="py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all text-center"
                >
                  Internal Pemkab
                </button>
                <button 
                  type="button" 
                  @click="form.jenis = 'BERBAYAR'; form.kategori = '';"
                  :class="form.jenis === 'BERBAYAR' ? 'bg-blue-700 text-white border-blue-700 shadow-lg shadow-blue-700/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'"
                  class="py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all text-center"
                >
                  Usaha Komersial
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub Kategori</label>
              <select v-model="form.kategori" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" required>
                <option value="">Pilih Kategori...</option>
                <template v-if="form.jenis === 'OPD'">
                  <option value="Pembangunan">Pembangunan Daerah</option>
                  <option value="Himbauan">Himbauan Masyarakat</option>
                  <option value="Pemerintahan">Info Pemerintahan</option>
                  <option value="Layanan Masyarakat">Layanan Masyarakat</option>
                  <option value="Agenda Pemkab">Agenda / Event Pemkab</option>
                  <option value="Peringatan Hari Besar">HUT / Peringatan Hari Besar</option>
                  <option value="Prestasi Daerah">Prestasi / Penghargaan</option>
                  <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                  <option value="Lainnya">Lainnya (Kustom)...</option>
                </template>
                <template v-else>
                  <option value="UMKM">Produk UMKM</option>
                  <option value="Komersial">Promosi Bisnis</option>
                  <option value="Event">Event / Acara</option>
                  <option value="F&B / Kuliner">F&B / Kuliner</option>
                  <option value="Jasa / Layanan">Jasa / Layanan Jasa</option>
                  <option value="Fashion / Lifestyle">Fashion / Gaya Hidup</option>
                  <option value="Kesehatan / Kecantikan">Kesehatan & Kecantikan</option>
                  <option value="Wisata / Rekreasi">Wisata / Rekreasi</option>
                  <option value="Pendidikan / Les">Pendidikan / Les</option>
                  <option value="Lowongan Kerja">Lowongan Kerja</option>
                  <option value="Informasi Masyarakat">Informasi Masyarakat</option>
                  <option value="Himbauan Publik">Himbauan Publik</option>
                  <option value="Sosialisasi Program">Sosialisasi Program</option>
                  <option value="Info Pemerintahan">Info Pemerintahan</option>
                  <option value="Layanan Publik">Layanan Publik</option>
                  <option value="Lainnya">Lainnya (Kustom)...</option>
                </template>
              </select>
            </div>

            <!-- Custom Category Text Input -->
            <div v-if="form.kategori === 'Lainnya'" class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Masukkan Kategori Kustom</label>
              <input v-model="form.kategori_kustom" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" placeholder="Ketik kategori kustom..." required />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Publikasi</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  @click="form.status = 'TAYANG'; form.tanggal_mulai = todayDate"
                  :class="form.status === 'TAYANG' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'"
                  class="py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all text-center"
                >
                  Tayang Sekarang
                </button>
                <button 
                  type="button" 
                  @click="form.status = 'DISETUJUI'"
                  :class="form.status === 'DISETUJUI' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100'"
                  class="py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider transition-all text-center"
                >
                  Sesuai Jadwal
                </button>
              </div>
            </div>

            <!-- Pilihan Metode Durasi (Hanya jika bukan Selamanya) -->
            <div v-if="form.satuan !== 'SELAMANYA'" class="flex gap-3 p-1.5 bg-slate-100 rounded-xl">
              <button 
                type="button" 
                @click="caraDurasi = 'DURASI'"
                :class="caraDurasi === 'DURASI' ? 'bg-white text-blue-700 shadow border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
                class="flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer"
              >
                🗓️ Durasi
              </button>
              <button 
                type="button" 
                @click="caraDurasi = 'TANGGAL_AKHIR'"
                :class="caraDurasi === 'TANGGAL_AKHIR' ? 'bg-white text-blue-700 shadow border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
                class="flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer"
              >
                🏁 Tanggal Akhir
              </button>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Mulai Tayang</label>
              <input 
                v-model="form.tanggal_mulai" 
                type="date" 
                :disabled="form.status === 'TAYANG'"
                class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-black text-slate-900 disabled:opacity-50" 
                required 
              />
            </div>

            <!-- Jika metode durasi: Tanggal Akhir -->
            <div v-if="form.satuan !== 'SELAMANYA' && caraDurasi === 'TANGGAL_AKHIR'" class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Akhir Tayang</label>
                <span v-if="form.tanggal_mulai && tanggalAkhir && form.durasi > 0" class="text-[9px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {{ form.durasi }} Hari
                </span>
              </div>
              <input 
                v-model="tanggalAkhir" 
                type="date" 
                :min="form.tanggal_mulai || todayDate" 
                class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-black text-slate-900" 
                required 
              />
            </div>

            <!-- Jika metode durasi: Durasi Biasa -->
            <div v-else class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Durasi Penayangan
              </label>
              <div class="flex gap-2">
                <input 
                  v-if="form.satuan !== 'SELAMANYA'"
                  v-model="form.durasi" 
                  type="number" 
                  min="1" 
                  :max="99" 
                  class="flex-grow px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-black text-slate-900" 
                  required 
                />
                <div v-else class="flex-grow px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center">
                  ♾️ Tanpa Batas Waktu
                </div>
                <select 
                  v-model="form.satuan" 
                  class="w-32 px-4 rounded-xl bg-blue-50 border-2 border-blue-100 font-black text-[10px] uppercase tracking-widest outline-none"
                >
                  <option value="HARI">Hari</option>
                  <option value="MINGGU">Minggu</option>
                  <option value="BULAN">Bulan</option>
                  <option value="TAHUN">Tahun</option>
                  <option value="SELAMANYA">Selamanya</option>
                </select>
              </div>
            </div>

            <!-- Group Selection (Only shown if groups exist) -->
            <div v-if="groups.length > 0" class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Masukkan ke Grup (Opsional)</label>
              <select v-model="form.target_group_id" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900">
                <option value="">-- Tanpa Grup (Materi Mandiri) --</option>
                <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.nama }}</option>
              </select>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Pengiriman Berkas</label>
              <div class="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button 
                  type="button" 
                  @click="uploadType = 'FILE'" 
                  :class="uploadType === 'FILE' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'"
                  class="py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                >
                  📁 Upload File
                </button>
                <button 
                  type="button" 
                  @click="uploadType = 'LINK'" 
                  :class="uploadType === 'LINK' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'"
                  class="py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                >
                  🔗 Link Drive
                </button>
              </div>

              <!-- Input Upload File -->
              <div v-if="uploadType === 'FILE'" class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Pilih Berkas Media (6x4 Landscape)</label>
                <div class="relative group">
                  <input type="file" @change="onFileChange" accept="image/*,video/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple :required="uploadType === 'FILE'" />
                  <div class="w-full px-6 py-10 rounded-xl border-2 border-dashed border-slate-100 group-hover:border-blue-700 group-hover:bg-blue-50/30 transition-all flex flex-col items-center gap-4 text-center">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400 group-hover:text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                    <div>
                      <p class="text-xs font-black text-slate-900 uppercase tracking-tight">{{ form.fileNameSummary || 'Pilih Gambar/Video' }}</p>
                      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Maksimal 100MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Input Link Google Drive -->
              <div v-else class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Tautan Google Drive</label>
                <input v-model="linkUrl" type="url" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="https://drive.google.com/file/d/.../view" :required="uploadType === 'LINK'" />
                <p class="text-[9px] font-bold text-slate-400 uppercase ml-1">
                  * Akses link harus disetel ke "Siapa saja yang memiliki link" dan opsi download diizinkan.
                </p>
              </div>
            </div>

            <!-- Upload Progress for Admin -->
            <div v-if="uploading" class="space-y-2">
               <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-blue-600">
                  <span>{{ statusLabel }}</span>
                  <span>{{ uploadProgress }}%</span>
               </div>
               <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-700 transition-all duration-300" :style="`width: ${uploadProgress}%`"></div>
               </div>
            </div>

            <button 
              type="submit" 
              :disabled="uploading"
              class="w-full bg-blue-700 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-700/20 hover:bg-slate-900 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300"
            >
              Publikasikan Sekarang
            </button>
          </form>
        </div>

      </div>

      <!-- Right: Main Grid -->
      <div class="lg:col-span-8 space-y-8">
        
        <!-- Filter Header -->
        <div class="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
           <div class="flex items-center gap-4">
              <div class="px-3 py-1 bg-blue-700 text-white text-[9px] font-black rounded uppercase tracking-widest italic">Live Feed</div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Urutan Terbaru</p>
           </div>
           <div class="flex gap-2">
              <!-- Grid/List Switch placeholder if needed -->
           </div>
        </div>

        <!-- Empty State -->
        <div v-if="unifiedAdminItems.length === 0" class="py-32 text-center space-y-6 bg-white border-2 border-dashed border-slate-100 rounded-[40px]">
           <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </div>
           <p class="text-slate-400 font-bold italic text-sm uppercase tracking-widest">Belum ada materi publikasi di database.</p>
        </div>

        <!-- Modern Grid -->
        <div v-else class="grid md:grid-cols-2 gap-8">
           <template v-for="item in unifiedAdminItems" :key="item.is_group ? 'g-' + item.id : 'i-' + item.id">
              
              <!-- GROUP CARD DESIGN (Spans full width, wraps child cards as normal size cards) -->
              <div v-if="item.is_group" :class="item.items.length === 1 ? 'col-span-1' : 'col-span-1 md:col-span-2'" class="group bg-slate-50/50 backdrop-blur-sm border-2 border-dashed border-slate-200/80 rounded-[32px] p-6 md:p-8 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:bg-slate-50/70 transition-all duration-500 relative overflow-hidden">
                
                <!-- Group Header Banner -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-slate-200">
                   <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-blue-100/50 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                      </div>
                      <div>
                         <div class="flex items-center gap-2">
                            <h4 class="text-sm font-black text-slate-800 uppercase tracking-tight">{{ item.nama }}</h4>
                            <span class="px-2 py-0.5 bg-blue-600/10 text-blue-600 text-[8px] font-black rounded-md uppercase tracking-wider">Koleksi Grup</span>
                         </div>
                         <p class="text-xs font-bold text-slate-400 mt-0.5">{{ item.deskripsi || 'Tidak ada deskripsi' }}</p>
                      </div>
                   </div>
                   
                   <div class="flex items-center gap-3">
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/80 border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm shrink-0">
                         🗂️ {{ item.items.length }} Materi &bull; Update: {{ getGroupLatestDateFormatted(item) }}
                      </span>
                      <div class="flex gap-2">
                         <button @click="openManageGroup(item)" class="px-3 py-1.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 rounded font-black text-[8px] uppercase tracking-widest transition-all">
                            Kelola
                         </button>
                         <button @click="handleDeleteGroupClick(item.id)" class="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Hapus Grup">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </div>
                   </div>
                </div>

                <!-- Sub-grid of cards inside the group (snug fit display) -->
                <div :class="item.items.length === 1 
                  ? 'grid grid-cols-1 gap-6 pt-6' 
                  : (item.items.length === 2 
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6' 
                      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6')">
                  <div v-for="child in item.items" :key="child.id" class="group/card bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-700/20 hover:shadow-lg transition-all duration-500 overflow-hidden flex flex-col relative">
                    <!-- Folder Album Stack Effect (renders if item has multiple images) -->
                    <template v-if="child.url && child.url.includes('|')">
                       <div class="absolute inset-0 bg-slate-200/80 rounded-2xl transform translate-x-1.5 translate-y-1.5 transition-transform duration-500 shadow-sm border border-slate-300/30"></div>
                       <div class="absolute inset-0 bg-slate-100 rounded-2xl transform translate-x-1 translate-y-1 transition-transform duration-500 shadow border border-slate-200/40"></div>
                    </template>

                    <!-- Main card container wrapper -->
                    <div class="relative z-10 bg-white flex-grow flex flex-col rounded-2xl overflow-hidden">
                      <!-- Thumbnail -->
                      <div class="relative aspect-[3/2] bg-slate-900 overflow-hidden">
                         <img v-if="child.tipe === 'IMAGE' || child.tipe === 'PHOTO' || (child.url && child.url.includes('|'))" :src="getPreviewUrl(child.url && child.url.includes('|') ? child.url.split('|')[0] : child.url)" draggable="false" class="w-full h-full object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700 opacity-60 group-hover/card:opacity-100" />
                         <div v-else class="w-full h-full flex flex-col items-center justify-center gap-3 text-white/40">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            <span class="text-[8px] font-black uppercase tracking-[0.3em]">Video Content</span>
                         </div>
                         
                         <!-- Source Badge -->
                         <div class="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                            <div :class="child.jenis === 'BERBAYAR' ? 'bg-blue-700 border-blue-600' : 'bg-amber-500 border-amber-400'" class="px-2 py-0.5 text-white text-[7px] font-black uppercase tracking-widest rounded border">
                               {{ child.jenis === 'BERBAYAR' ? 'Berbayar' : 'Internal' }}
                            </div>
                            <div v-if="child.url && child.url.includes('|')" class="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest rounded border border-white/10 flex items-center gap-1">
                               <svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                               📁 {{ child.url.split('|').length }} FOTO
                            </div>
                         </div>

                         <!-- Action Quick Overlays -->
                         <div class="absolute inset-0 bg-blue-700/80 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-3 z-30">
                            <button @click="openAlbum(child)" class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 shadow-xl hover:scale-110 transition-transform cursor-pointer">
                               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                         </div>
                      </div>

                      <!-- Content Info -->
                      <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
                         <div class="space-y-1.5">
                            <div class="flex items-center justify-between">
                               <span class="text-[7px] font-black text-blue-600 uppercase tracking-widest">{{ child.url && child.url.includes('|') ? 'ALBUM' : child.tipe }}</span>
                               <div class="flex items-center gap-1.5">
                                  <span v-if="child.durasi" class="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[7px] font-black uppercase tracking-wider">⏱️ {{ child.durasi }} {{ child.satuan === 'HARI' ? 'Hari' : child.satuan }}</span>
                                  <span class="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(child.tanggal_mulai || child.tanggal) }}</span>
                               </div>
                            </div>
                            <h4 class="text-sm font-black text-slate-900 leading-tight uppercase line-clamp-2">{{ child.judul }}</h4>
                            
                            <!-- Duration Warning Alert -->
                            <div v-if="child.satuan === 'HARI' && child.durasi < 3" class="mt-1 px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[7px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                               <span>⚠️ Tayang tidak maksimal ({{ child.durasi }} Hari)</span>
                            </div>
                            
                            <!-- Move Group Dropdown Selector -->
                            <div class="pt-1.5 flex items-center gap-1.5">
                              <span class="text-[8px] font-bold text-slate-400 uppercase shrink-0">Pindah:</span>
                              <select 
                                :value="item.id" 
                                @change="handleGroupChange(child.id, $event)"
                                class="text-[8px] font-black uppercase tracking-wider bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 outline-none focus:border-blue-500 cursor-pointer max-w-[130px] truncate"
                              >
                                 <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.nama }}</option>
                              </select>
                            </div>
                         </div>
                         
                          <div class="pt-3 border-t border-slate-50 flex items-center justify-between">
                             <div class="flex items-center gap-1.5">
                                <div class="w-1.5 h-1.5 rounded-full" :class="child.source === 'GALLERY' ? 'bg-emerald-500' : (child.status === 'EXPIRED' || child.is_expired ? 'bg-red-500' : (child.status === 'DISETUJUI' ? 'bg-blue-500' : 'bg-emerald-500 animate-pulse'))"></div>
                                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">
                                   {{ child.source === 'GALLERY' ? 'Publish' : (child.status === 'EXPIRED' || child.is_expired ? 'Kadaluarsa' : (child.status === 'DISETUJUI' ? 'Disetujui' : 'Tayang')) }}
                                </span>
                             </div>
                             <div class="flex items-center gap-1.5">
                                <button 
                                  @click="handleGroupChange(child.id, { target: { value: '' } })" 
                                  class="p-1 text-slate-400 hover:text-orange-600 transition-colors cursor-pointer flex items-center justify-center" 
                                  title="Keluarkan dari Grup"
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                </button>
                                <button v-if="child.source === 'SUBMISSION'" @click="openAction(child)" class="px-2 py-1 bg-slate-900 hover:bg-blue-700 text-white rounded font-black text-[8px] uppercase tracking-widest transition-all">
                                   Kelola
                                </button>
                                <button @click="confirmDelete(child)" class="p-1 text-red-400 hover:text-red-600 transition-colors" title="Hapus">
                                   <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                             </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- INDIVIDUAL CARD DESIGN -->
              <div v-else draggable="true" @dragstart="onDragStart($event, item)" class="col-span-1 group bg-white rounded-3xl border-2 border-slate-50 hover:border-blue-700/20 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative cursor-grab active:cursor-grabbing">
                
                <!-- Folder Album Stack Effect (renders if item has multiple images) -->
                <template v-if="item.url && item.url.includes('|')">
                   <div class="absolute inset-0 bg-slate-200/80 rounded-2xl transform translate-x-2.5 translate-y-2.5 transition-transform duration-500 shadow-sm border border-slate-300/30"></div>
                   <div class="absolute inset-0 bg-slate-100 rounded-2xl transform translate-x-1.5 translate-y-1.5 transition-transform duration-500 shadow border border-slate-200/40"></div>
                </template>

                <!-- Main card container wrapper with relative and bg-white -->
                <div class="relative z-10 bg-white flex-grow flex flex-col rounded-3xl overflow-hidden">
                  <!-- Thumbnail -->
                  <div class="relative aspect-[3/2] bg-slate-900 overflow-hidden">
                     <img v-if="item.tipe === 'IMAGE' || item.tipe === 'PHOTO' || (item.url && item.url.includes('|'))" :src="getPreviewUrl(item.url && item.url.includes('|') ? item.url.split('|')[0] : item.url)" draggable="false" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                     <div v-else class="w-full h-full flex flex-col items-center justify-center gap-4 text-white/40">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <span class="text-[9px] font-black uppercase tracking-[0.3em]">Video Content</span>
                     </div>
                     
                     <!-- Source Badge -->
                     <div class="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        <div :class="item.jenis === 'BERBAYAR' ? 'bg-blue-700 border-blue-600' : 'bg-amber-500 border-amber-400'" class="px-3 py-1 text-white text-[8px] font-black uppercase tracking-widest rounded-md border">
                           {{ item.jenis === 'BERBAYAR' ? 'Berbayar' : 'Internal' }}
                        </div>
                        <div v-if="item.url && item.url.includes('|')" class="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-md border border-white/10 flex items-center gap-1">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                           📁 {{ item.url.split('|').length }} FOTO
                        </div>
                     </div>

                     <!-- Action Quick Overlays -->
                     <div class="absolute inset-0 bg-blue-700/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-30">
                        <button @click="openAlbum(item)" class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-700 shadow-xl hover:scale-110 transition-transform cursor-pointer">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                     </div>
                  </div>

                  <!-- Content Info -->
                  <div class="p-6 flex-grow flex flex-col justify-between space-y-4">
                     <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="text-[8px] font-black text-blue-600 uppercase tracking-widest">{{ item.url && item.url.includes('|') ? 'ALBUM' : item.tipe }}</span>
                            <div class="flex items-center gap-2">
                               <span v-if="item.durasi" class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] font-black uppercase tracking-wider">⏱️ {{ item.durasi }} {{ item.satuan === 'HARI' ? 'Hari' : item.satuan }}</span>
                               <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(item.tanggal_mulai || item.tanggal) }}</span>
                            </div>
                         </div>
                         <h4 class="text-base font-black text-slate-900 leading-tight uppercase line-clamp-2">{{ item.judul }}</h4>
                         
                         <!-- Duration Warning Alert -->
                         <div v-if="item.satuan === 'HARI' && item.durasi < 3" class="mt-1 px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[8px] font-bold uppercase tracking-wider inline-flex items-center gap-1 animate-pulse">
                            <span>⚠️ Tayang tidak maksimal ({{ item.durasi }} Hari)</span>
                         </div>
                         
                         <!-- Group Selector Dropdown -->
                         <div class="pt-2 flex items-center gap-1.5">
                           <span class="text-[8px] font-bold text-slate-400 uppercase shrink-0">Pilih Grup:</span>
                           <select 
                             value="" 
                             @change="handleGroupChange(item.id, $event)"
                             class="text-[8px] font-black uppercase tracking-wider bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 outline-none focus:border-blue-500 cursor-pointer max-w-[130px] truncate"
                           >
                              <option value="" disabled selected>-- Pilih Grup --</option>
                              <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.nama }}</option>
                           </select>
                         </div>
                     </div>
                     
                      <div class="pt-4 border-t border-slate-50 flex items-center justify-between">
                         <div class="flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full" :class="item.source === 'GALLERY' ? 'bg-emerald-500' : (item.status === 'EXPIRED' || item.is_expired ? 'bg-red-500' : (item.status === 'DISETUJUI' ? 'bg-blue-500' : 'bg-emerald-500 animate-pulse'))"></div>
                            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                               {{ item.source === 'GALLERY' ? 'Publish' : (item.status === 'EXPIRED' || item.is_expired ? 'Kadaluarsa' : (item.status === 'DISETUJUI' ? 'Disetujui' : 'Tayang')) }}
                            </span>
                         </div>
                         <div class="flex items-center gap-2">
                            <button v-if="item.source === 'SUBMISSION'" @click="openAction(item)" class="px-3 py-1.5 bg-slate-900 hover:bg-blue-700 text-white rounded font-black text-[9px] uppercase tracking-widest transition-all">
                               Kelola
                            </button>
                            <button @click="confirmDelete(item)" class="p-1.5 text-red-400 hover:text-red-600 transition-colors" title="Hapus">
                               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                         </div>
                      </div>
                  </div>
                </div>
              </div>

           </template>
        </div>
      </div>
    </div>

    <!-- Modal Kelola Status (Update) -->
    <transition name="page">
      <div v-if="activeSub" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
          
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
                    <div class="font-black text-slate-900 font-mono text-sm">{{ activeSub.id }}</div>
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

            <!-- Tampilkan Date Picker HANYA jika status asal materi adalah EXPIRED -->
            <div v-if="activeSub && activeSub.status === 'EXPIRED' && (updateForm.status === 'DISETUJUI' || updateForm.status === 'TAYANG')" class="space-y-2 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-100 animate-in slide-in-from-top-2 duration-300">
               <label class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Tanggal Mulai Baru</label>
               <input v-model="updateForm.tanggal_mulai" type="date" class="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-500 outline-none transition-all font-black text-slate-900" required />
               <p class="text-[9px] font-bold text-emerald-500 uppercase">* Masukkan tanggal mulai baru untuk mengaktifkan kembali materi yang kedaluwarsa.</p>
            </div>

            <!-- Conditional File Upload for TAYANG -->
            <div v-if="updateForm.status === 'TAYANG'" class="space-y-2 p-4 bg-blue-50 rounded-xl border-2 border-blue-100 animate-in slide-in-from-top-2 duration-300">
               <label class="text-[10px] font-black text-blue-700 uppercase tracking-widest">Dokumentasi Tayang (Wajib)</label>
               <input type="file" @change="handleDocUpload" accept="image/*,video/*" class="w-full text-[10px] font-black file:bg-blue-700 file:text-white file:border-0 file:px-4 file:py-2 file:rounded cursor-pointer" />
               <p class="text-[9px] font-bold text-blue-400 uppercase">* Foto/Video materi saat sudah tampil di videotron.</p>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catatan Admin</label>
              <textarea v-model="updateForm.catatan" rows="3" class="w-full px-6 py-4 rounded border-2 border-slate-100 focus:border-blue-700 outline-none transition-all font-bold text-sm" placeholder="Tulis alasan/info..."></textarea>
            </div>
          </div>
          
          <!-- Modal Footer (Fixed at bottom of modal) -->
          <div class="p-6 bg-slate-50 border-t-2 border-slate-100 flex justify-end gap-3 shrink-0">
            <button @click="activeSub = null" class="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">Batal</button>
            <button 
              @click="handleUpdate" 
              :disabled="updating || !updateForm.status || (updateForm.status === 'TAYANG' && !updateForm.docBase64)" 
              class="px-8 py-3 bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all cursor-pointer disabled:bg-slate-200"
            >
               {{ updating ? 'Memproses...' : 'Update & Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Lightbox Album Modal -->
    <transition name="page">
      <div v-if="activeAlbum" class="fixed inset-0 z-[500] flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
        <!-- Close Button -->
        <button @click="activeAlbum = null" class="absolute top-6 right-6 text-white/70 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div class="w-full max-w-5xl space-y-6 flex flex-col items-center">
           <!-- Header / Title -->
           <div class="text-center space-y-1">
              <span class="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Album Galeri (Admin)</span>
              <h3 class="text-xl font-black text-white uppercase tracking-tight">{{ activeAlbumTitle }}</h3>
           </div>

           <!-- Main Preview Content -->
           <div class="relative w-full aspect-[3/2] md:aspect-[16/9] bg-black/50 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl">
              <img :src="getPreviewUrl(activeAlbum[activeAlbumIndex])" class="max-w-full max-h-full object-contain" />
              
              <!-- Left/Right Nav Arrows -->
              <button 
                v-if="activeAlbum.length > 1" 
                @click="activeAlbumIndex = (activeAlbumIndex - 1 + activeAlbum.length) % activeAlbum.length" 
                class="absolute left-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button 
                v-if="activeAlbum.length > 1" 
                @click="activeAlbumIndex = (activeAlbumIndex + 1) % activeAlbum.length" 
                class="absolute right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>

           <!-- Footer / Pagination Indicator -->
           <div class="flex items-center gap-4 text-white">
              <span class="text-xs font-black uppercase tracking-widest text-white/50">Foto {{ activeAlbumIndex + 1 }} dari {{ activeAlbum.length }}</span>
              <a :href="activeAlbum[activeAlbumIndex]" target="_blank" class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded text-[9px] font-black uppercase tracking-widest transition-all">
                 Buka File Asli
              </a>
           </div>
        </div>
      </div>
    </transition>

    <!-- Modal Buat Grup Baru -->
    <transition name="page">
      <div v-if="showCreateGroupModal" class="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div class="flex justify-between items-center border-b border-slate-100 pb-4">
             <h3 class="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Buat Grup Baru</h3>
             <button @click="showCreateGroupModal = false" class="text-slate-400 hover:text-slate-900">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <form @submit.prevent="handleCreateGroupSubmit" class="space-y-6">
             <div class="space-y-2">
               <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Grup</label>
               <input v-model="newGroupForm.nama" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" placeholder="Misal: Info Kesehatan" required />
             </div>
             <div class="space-y-2">
               <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Grup (Opsional)</label>
               <textarea v-model="newGroupForm.deskripsi" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900 h-24" placeholder="Rincian informasi grup..."></textarea>
             </div>
             <button type="submit" class="w-full py-4 bg-blue-700 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all">Simpan Grup</button>
          </form>
        </div>
      </div>
    </transition>

    <!-- Modal Kelola & Urutkan Grup (Drag & Drop Sorting) -->
    <transition name="page">
      <div v-if="activeGroup" class="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
        <div class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
          
          <!-- Modal Header -->
          <div class="p-6 bg-slate-900 flex justify-between items-center text-white shrink-0">
             <div>
                <span class="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em]">Kelola & Urutkan Grup</span>
                <h3 class="text-lg font-black uppercase tracking-tight">{{ activeGroup.nama }}</h3>
             </div>
             <button @click="activeGroup = null" class="text-white/60 hover:text-white p-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          <!-- Modal Body -->
          <div class="p-8 flex-grow overflow-y-auto space-y-6">
             <p class="text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
               💡 Drag & drop baris di bawah untuk mengatur ulang urutan tampilan konten grup pada halaman beranda, atau klik tombol sampah untuk menghapusnya dari grup.
             </p>
             
             <div v-if="sortedItems.length === 0" class="py-16 text-center text-slate-300 font-black uppercase tracking-widest italic border-2 border-dashed border-slate-100 rounded-2xl">
                Grup ini masih kosong
             </div>

             <div v-else class="space-y-3">
                <div 
                  v-for="(item, index) in sortedItems" 
                  :key="item.id"
                  draggable="true"
                  @dragstart="onSortStart($event, index)"
                  @dragover.prevent
                  @drop="onSortDrop($event, index)"
                  class="flex items-center gap-4 p-4 bg-slate-50 border-2 border-slate-50 hover:border-blue-700/20 rounded-xl cursor-move active:bg-blue-50/10 transition-all select-none"
                >
                  <!-- Drag Handle Icon -->
                  <div class="text-slate-400 shrink-0">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 8h16M4 16h16" /></svg>
                  </div>

                  <!-- Number Label -->
                  <div class="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-black text-slate-600 font-mono shrink-0">
                     {{ index + 1 }}
                  </div>

                  <!-- Thumbnail Preview -->
                  <div class="w-16 aspect-[3/2] bg-slate-900 rounded overflow-hidden shrink-0">
                     <img v-if="item.tipe === 'IMAGE' || item.tipe === 'PHOTO' || (item.url && item.url.includes('|'))" :src="getPreviewUrl(item.url && item.url.includes('|') ? item.url.split('|')[0] : item.url)" class="w-full h-full object-cover" />
                     <div v-else class="w-full h-full flex items-center justify-center text-[7px] font-black text-white/50 uppercase text-center leading-none">VIDEO</div>
                  </div>

                  <!-- Item Info -->
                  <div class="flex-grow min-w-0">
                     <h4 class="text-xs font-black text-slate-900 uppercase tracking-tight truncate">{{ item.judul }}</h4>
                     <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ item.instansi }} &bull; {{ item.kategori }}</p>
                  </div>

                  <!-- Action -->
                  <button @click="removeItemFromGroup(index)" class="p-2 text-slate-300 hover:text-red-600 transition-colors shrink-0 cursor-pointer" title="Hapus dari Grup">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
             </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 bg-slate-50 border-t-2 border-slate-100 flex justify-end gap-3 shrink-0">
                <button @click="activeGroup = null" class="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer">Batal</button>
             <button @click="saveGroupOrder" class="px-8 py-3 bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all cursor-pointer">Simpan Urutan</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Toast Notification -->
    <transition name="page">
      <div v-if="toastMessage" class="fixed bottom-6 right-6 z-[600] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-xs font-black uppercase tracking-wider animate-in slide-in-from-bottom-4 duration-300 bg-slate-900 border-slate-800 text-white">
          <span v-if="toastType === 'success'" class="text-emerald-400">✅</span>
          <span v-else class="text-red-400">❌</span>
          <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getGallery, post, updateSubmissionStatus, deleteSubmission, getGroups, createGroup, updateGroupItems, deleteGroup } from '../../api'

const router = useRouter()
const uploading = ref(false)
const updating = ref(false)
const uploadProgress = ref(0)
const statusLabel = ref('Menyiapkan...')
const gallery = ref<any[]>([])

const toastMessage = ref<string | null>(null)
const toastType = ref<'success' | 'error'>('success')
let toastTimeout: any = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

const groups = ref<any[]>([])
const showCreateGroupModal = ref(false)
const newGroupForm = reactive({
  nama: '',
  deskripsi: ''
})

const activeGroup = ref<any | null>(null)
const sortedItems = ref<any[]>([])
const dragIdx = ref<number | null>(null)

const getGroupLatestDate = (group: any) => {
  if (!group.items || group.items.length === 0) return 0
  let latest = 0
  group.items.forEach((item: any) => {
    const dateVal = new Date(item.tanggal_mulai || item.tanggal).getTime()
    if (dateVal > latest) latest = dateVal
  })
  return latest
}

const getGroupLatestDateFormatted = (group: any) => {
  const latestVal = getGroupLatestDate(group)
  if (latestVal > 0) {
    return formatDate(new Date(latestVal).toISOString())
  }
  return '-'
}

const unifiedAdminItems = computed(() => {
  const activeGroups = groups.value
  const groupedIds = new Set(activeGroups.flatMap(g => (g.item_ids || []).map(String)))

  const individualItems = gallery.value.filter(item => !groupedIds.has(String(item.id)))

  const groupCards = activeGroups.map(group => {
    const childItems = (group.item_ids || []).map((id: string) => {
      return gallery.value.find(item => String(item.id) === String(id))
    }).filter(Boolean)
    
    return {
      is_group: true,
      id: group.id,
      nama: group.nama,
      deskripsi: group.deskripsi,
      status: group.status,
      items: childItems
    }
  }).filter(g => g.items.length > 0)

  // Sort individual items by date (latest first)
  const sortedIndividual = individualItems
    .map(item => ({ ...item, is_group: false }))
    .sort((a, b) => {
      const dateA = new Date(a.tanggal_mulai || a.tanggal).getTime()
      const dateB = new Date(b.tanggal_mulai || b.tanggal).getTime()
      return dateB - dateA
    })

  // Sort group cards by date (latest first)
  const sortedGroups = groupCards
    .sort((a, b) => {
      const dateA = getGroupLatestDate(a)
      const dateB = getGroupLatestDate(b)
      return dateB - dateA
    })

  return [...sortedIndividual, ...sortedGroups]
})

const fetchGroupsData = async () => {
  try {
    const res = await getGroups()
    if (res.success) groups.value = res.data
  } catch (e) { console.error('Fetch Groups Error:', e) }
}

const activeAlbum = ref<string[] | null>(null)
const activeAlbumTitle = ref('')
const activeAlbumIndex = ref(0)

const openAlbum = (item: any) => {
  if (item.url && item.url.includes('|')) {
    activeAlbum.value = item.url.split('|')
    activeAlbumTitle.value = item.judul
    activeAlbumIndex.value = 0
  } else {
    window.open(item.url, '_blank')
  }
}

const todayDate = new Date().toISOString().split('T')[0]

const form = reactive({
  judul: '',
  instansi: '',
  kategori: '',
  kategori_kustom: '',
  fileObjects: [] as File[],
  fileNameSummary: '',
  mimeType: '',
  jenis: 'OPD',
  status: 'TAYANG',
  tanggal_mulai: todayDate,
  durasi: 1,
  satuan: 'HARI',
  target_group_id: ''
})

const caraDurasi = ref('DURASI') // 'DURASI' or 'TANGGAL_AKHIR'
const tanggalAkhir = ref('')
const uploadType = ref('FILE')
const linkUrl = ref('')

const calculateDurationFromDates = () => {
  if (caraDurasi.value === 'TANGGAL_AKHIR' && form.tanggal_mulai && tanggalAkhir.value) {
    const start = new Date(form.tanggal_mulai)
    const end = new Date(tanggalAkhir.value)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24))
    if (diffDays > 0) {
      form.durasi = diffDays
      form.satuan = 'HARI'
    } else {
      form.durasi = 0
    }
  }
}

watch([() => form.tanggal_mulai, tanggalAkhir, caraDurasi], () => {
  if (caraDurasi.value === 'TANGGAL_AKHIR') {
    calculateDurationFromDates()
  }
})

watch(() => form.satuan, (newVal) => {
  if (newVal === 'SELAMANYA') {
    form.durasi = 1
  }
})

const fetchGallery = async () => {
  try {
    const res = await getGallery()
    if (res.success) gallery.value = res.data
  } catch (e) { console.error(e) }
}

const onFileChange = (e: any) => {
  const files: FileList = e.target.files
  if (!files || files.length === 0) return
  
  const selected: File[] = []
  
  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    if (f.size > 100 * 1024 * 1024) {
      alert(`File "${f.name}" terlalu besar! Maksimal 100MB per file.`)
      e.target.value = ''
      return
    }
    selected.push(f)
  }
  
  form.fileObjects = selected
  form.fileNameSummary = selected.length === 1 ? selected[0].name : `${selected.length} file terpilih`
  form.mimeType = selected[0].type
}

// Reuse high-stability chunked upload logic
const uploadInChunks = async (file: File, onProgress: (pct: number) => void): Promise<{ uploadId: string, totalChunks: number }> => {
  const CHUNK_SIZE = 60 * 1024 
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const uploadId = 'up_gal_' + Date.now()
  
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

const handleUpload = async () => {
  if (uploadType.value === 'FILE') {
    if (!form.fileObjects || form.fileObjects.length === 0) return alert('Pilih file terlebih dahulu.')
  } else {
    if (!linkUrl.value) return alert('Masukkan link Google Drive.')
    if (!linkUrl.value.includes('drive.google.com') && !linkUrl.value.includes('docs.google.com')) {
      return alert('Harap masukkan link Google Drive yang valid.')
    }
  }

  if (!form.instansi) return alert('Nama instansi / usaha wajib diisi.')
  if (!form.kategori) return alert('Sub kategori wajib dipilih.')
  if (form.kategori === 'Lainnya' && !form.kategori_kustom) return alert('Masukkan nama kategori kustom Anda.')
  if (caraDurasi.value === 'TANGGAL_AKHIR') {
    if (!tanggalAkhir.value) return alert('Pilih tanggal akhir tayang.')
    if (form.durasi <= 0) return alert('Tanggal akhir tayang harus setelah tanggal mulai tayang.')
  }
  
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    let finalFileUrl = ''
    let isLink = false
    
    if (uploadType.value === 'FILE') {
      const urls: string[] = []
      let fileIdx = 0
      
      for (const file of form.fileObjects) {
        fileIdx++
        statusLabel.value = `Mengunggah file ${fileIdx} dari ${form.fileObjects.length}...`
        
        const chunkInfo = await uploadInChunks(file, (pct) => { 
          uploadProgress.value = pct 
        })
        
        statusLabel.value = `Menyusun file ${fileIdx}...`
        uploadProgress.value = 99
        
        const sanitizedTitle = form.judul.substring(0, 15).replace(/[^a-z0-9]/gi, '-');
        const finalFileName = `GAL_MULT_${sanitizedTitle}_${fileIdx}_${Date.now()}`;
        
        const assembleRes = await post('assembleChunkFile', {
           uploadId: chunkInfo.uploadId, 
           totalChunks: chunkInfo.totalChunks,
           fileName: finalFileName, 
           mimeType: file.type
        })
        
        if (!assembleRes.success) throw new Error(assembleRes.message)
        urls.push(assembleRes.fileUrl)
      }
      
      finalFileUrl = urls.join('|')
    } else {
      statusLabel.value = 'Memvalidasi Link Google Drive...'
      uploadProgress.value = 50
      finalFileUrl = linkUrl.value
      isLink = true
    }

    // Phase 3: Final Submission Entry
    statusLabel.value = 'Mempublikasikan...'
    uploadProgress.value = 90
    const res = await post('submitPengajuan', { 
      judul: form.judul,
      instansi: form.instansi,
      kategori: form.kategori === 'Lainnya' ? form.kategori_kustom : form.kategori,
      jenis: form.jenis,
      status: form.status,
      tanggal_mulai: form.tanggal_mulai,
      durasi: form.durasi,
      satuan: form.satuan,
      fileUrl: finalFileUrl,
      mimeType: form.mimeType,
      isLinkSubmission: isLink
    })

    if (res.success) {
      const newItemId = res.no_registrasi
      
      // Jika ada target grup terpilih, hubungkan langsung
      if (form.target_group_id) {
        const targetGroup = groups.value.find(g => g.id === form.target_group_id)
        if (targetGroup) {
          const updatedIds = [...(targetGroup.item_ids || []), newItemId]
          try {
            await updateGroupItems({ id: targetGroup.id, item_ids: updatedIds })
            showToast(`Materi berhasil dipublikasikan dan dimasukkan ke grup "${targetGroup.nama}"!`, 'success')
            fetchGroupsData()
          } catch (err) {
            console.error('Gagal memasukkan materi baru ke grup:', err)
            showToast('Materi dipublikasikan, namun gagal dimasukkan ke grup', 'error')
          }
        }
      } else {
        showToast('Materi manual berhasil dipublikasikan!', 'success')
      }

      form.judul = ''
      form.instansi = ''
      form.kategori = ''
      form.kategori_kustom = ''
      form.fileNameSummary = ''
      form.fileObjects = []
      form.jenis = 'OPD'
      form.status = 'TAYANG'
      form.tanggal_mulai = todayDate
      form.durasi = 1
      form.satuan = 'HARI'
      form.target_group_id = ''
      linkUrl.value = ''
      fetchGallery()
    } else {
      showToast('Gagal: ' + res.message, 'error')
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    showToast('Gagal mengunggah gallery: ' + (error.message || 'Error koneksi'), 'error')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const activeSub = ref<any>(null)
const updateForm = reactive({ status: '', catatan: '', docBase64: '', docMimeType: '', allow_edit: false, tanggal_mulai: '' })

const openAction = (item: any) => {
  activeSub.value = item
  updateForm.status = item.status === 'MENUNGGU_VERIFIKASI' ? '' : item.status
  updateForm.catatan = item.catatan || ''
  updateForm.tanggal_mulai = item.status === 'EXPIRED' ? new Date().toISOString().split('T')[0] : ''
  updateForm.docBase64 = ''
  updateForm.docMimeType = ''
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
  updating.value = true
  try {
    const res = await updateSubmissionStatus({ 
      no_registrasi: activeSub.value.id, 
      status: updateForm.status,
      catatan: updateForm.catatan,
      docBase64: updateForm.docBase64,
      docMimeType: updateForm.docMimeType,
      tanggal_mulai: updateForm.tanggal_mulai
    })
    if (res.success) { activeSub.value = null; fetchGallery() }
  } catch (e) {
    alert('Gagal memperbarui status')
  } finally { updating.value = false }
}

const confirmDelete = async (item: any) => {
  const label = item.source === 'GALLERY' ? 'materi galeri manual' : `pengajuan ${item.id}`
  if (confirm(`Hapus ${label}?`)) {
    try {
      let res
      if (item.source === 'GALLERY') {
        res = await post('deleteGalleryItem', { id: item.id })
      } else {
        res = await deleteSubmission(item.id)
      }
      if (res.success) {
        alert('Berhasil dihapus!')
        fetchGallery()
      } else {
        alert('Gagal menghapus: ' + res.message)
      }
    } catch (e) {
      alert('Gagal menghapus')
    }
  }
}

const getPreviewUrl = (url: string) => {
  if (!url) return ''
  let fileId = ''
  if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0]
  else if (url.includes('/d/')) fileId = url.split('/d/')[1].split('/')[0]
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  return url
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date)
}

const handleCreateGroupSubmit = async () => {
  if (!newGroupForm.nama) return showToast('Nama grup wajib diisi.', 'error')
  try {
    const res = await createGroup(newGroupForm)
    if (res.success) {
      showToast('Grup berhasil dibuat!', 'success')
      newGroupForm.nama = ''
      newGroupForm.deskripsi = ''
      showCreateGroupModal.value = false
      fetchGroupsData()
    }
  } catch (e) {
    showToast('Gagal membuat grup', 'error')
  }
}

const handleDeleteGroupClick = async (groupId: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus grup ini? Konten di dalamnya tidak akan terhapus.')) {
    try {
      const res = await deleteGroup(groupId)
      if (res.success) {
        showToast('Grup berhasil dihapus!', 'success')
        fetchGroupsData()
      }
    } catch (e) {
      showToast('Gagal menghapus grup', 'error')
    }
  }
}

// Drag & Drop to add item to Group
const dragOverGroupId = ref<string | null>(null)

const onDragEnter = (groupId: string) => {
  dragOverGroupId.value = groupId
}

const onDragLeave = () => {
  dragOverGroupId.value = null
}

const onDragStart = (e: DragEvent, item: any) => {
  if (e.dataTransfer) {
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'copyMove'
  }
}

const onDropOnGroup = async (e: DragEvent, group: any) => {
  dragOverGroupId.value = null
  const itemId = e.dataTransfer?.getData('text/plain')
  if (!itemId) return
  
  if (group.item_ids.includes(itemId)) {
    showToast('Item ini sudah ada di dalam grup!', 'error')
    return
  }
  
  const updatedItemIds = [...group.item_ids, itemId]
  try {
    const res = await updateGroupItems({ id: group.id, item_ids: updatedItemIds })
    if (res.success) {
      showToast(`Berhasil menambahkan ke grup "${group.nama}"!`, 'success')
      fetchGroupsData()
    }
  } catch (e) {
    showToast('Gagal menambahkan item ke grup', 'error')
  }
}

const handleGroupChange = async (itemId: string, event: any) => {
  const newGroupId = event.target.value
  const itemIdStr = String(itemId)
  console.log('[handleGroupChange] Triggered - Item:', itemIdStr, 'Target Group:', newGroupId)
  
  // Temukan grup asal dari item ini
  const oldGroup = groups.value.find(g => (g.item_ids || []).map(String).includes(itemIdStr))
  
  // Jika item ini sudah terdaftar di grup lain, hapus relasi lama terlebih dahulu
  if (oldGroup) {
    console.log('[handleGroupChange] Removing item from old group:', oldGroup.id)
    const updatedIds = (oldGroup.item_ids || []).map(String).filter((id: string) => id !== itemIdStr)
    try {
      const res = await updateGroupItems({ id: oldGroup.id, item_ids: updatedIds })
      if (!res.success) {
        console.warn('[handleGroupChange] Fail to remove from old group:', res.message)
      }
    } catch (e) {
      console.error('Gagal mengeluarkan dari grup lama:', e)
    }
  }
  
  // Hubungkan dengan grup baru (jika ada)
  if (newGroupId) {
    const newGroup = groups.value.find(g => String(g.id) === String(newGroupId))
    if (newGroup) {
      const updatedIds = [...(newGroup.item_ids || []).map(String), itemIdStr]
      console.log('[handleGroupChange] Adding item to new group:', newGroup.id, 'New IDs:', updatedIds)
      try {
        const res = await updateGroupItems({ id: newGroup.id, item_ids: updatedIds })
        if (res.success) {
          showToast(`Berhasil memindahkan ke grup "${newGroup.nama}"!`, 'success')
          fetchGroupsData()
        } else {
          showToast(`Gagal: ${res.message || 'Gagal menyimpan perubahan'}`, 'error')
          console.error('[handleGroupChange] Server error:', res.message)
        }
      } catch (e: any) {
        showToast('Gagal memindahkan ke grup baru (Network/Server Error)', 'error')
        console.error('[handleGroupChange] Network/Server error:', e)
      }
    } else {
      console.warn('[handleGroupChange] Target group not found in local groups list:', newGroupId)
    }
  } else {
    // Dipilih keluar grup (kosong)
    showToast('Berhasil mengeluarkan item dari grup!', 'success')
    fetchGroupsData()
  }
}

// Manage items inside Group (Open Modal)
const openManageGroup = (group: any) => {
  activeGroup.value = group
  sortedItems.value = group.item_ids
    .map((id: string) => gallery.value.find(item => String(item.id) === String(id)))
    .filter(Boolean)
}

// Reordering inside Group Manage Modal (Drag & Drop)
const onSortStart = (e: DragEvent, idx: number) => {
  dragIdx.value = idx
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

const onSortDrop = (_e: DragEvent, dropIdx: number) => {
  if (dragIdx.value === null || dragIdx.value === dropIdx) return
  const items = [...sortedItems.value]
  const draggedItem = items.splice(dragIdx.value, 1)[0]
  items.splice(dropIdx, 0, draggedItem)
  sortedItems.value = items
  dragIdx.value = null
}

const removeItemFromGroup = (idx: number) => {
  sortedItems.value.splice(idx, 1)
}

const saveGroupOrder = async () => {
  if (!activeGroup.value) return
  const newIds = sortedItems.value.map(item => item.id)
  try {
    const res = await updateGroupItems({ id: activeGroup.value.id, item_ids: newIds })
    if (res.success) {
      showToast('Urutan grup berhasil disimpan!', 'success')
      activeGroup.value = null
      fetchGroupsData()
    }
  } catch (e) {
    showToast('Gagal menyimpan urutan grup', 'error')
  }
}

onMounted(() => {
  const user = localStorage.getItem('admin_user')
  if (!user) router.push('/login')
  fetchGallery()
  fetchGroupsData()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
