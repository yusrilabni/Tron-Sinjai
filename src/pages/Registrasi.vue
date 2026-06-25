<template>
  <div class="min-h-screen bg-slate-50/50 pb-20 pt-10 px-4 md:px-6 relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-400/5 blur-[120px] pointer-events-none"></div>

    <div class="max-w-4xl mx-auto space-y-12 relative z-10 animate-fade-in">
      
      <!-- HEADER SECTION -->
      <div class="text-center space-y-4 max-w-2xl mx-auto">
        <div class="inline-flex px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50 shadow-sm">
          Pendaftaran Terpadu Portal Videotron
        </div>
        <h1 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
          Formulir <span class="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Tayang</span>
        </h1>
        <p class="text-sm font-bold text-slate-500 max-w-lg mx-auto">
          Pilih jenis layanan penayangan konten informasi atau promosi Anda di media Videotron Kabupaten Sinjai.
        </p>
      </div>

      <!-- STEP 1: CHOOSE MAIN CATEGORY -->
      <div v-if="viewMode === 'CHOOSE_CATEGORY'" class="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 max-w-3xl mx-auto animate-slide-up">
        <!-- Komersial Card -->
        <div 
          @click="showCommercialModal = true"
          class="group bg-white border-2 border-slate-100 hover:border-blue-600/30 rounded-3xl p-10 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
          <div class="space-y-6">
            <div class="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter">Usaha Komersial</h3>
              <p class="text-xs font-bold text-slate-400 leading-relaxed">
                Cocok untuk promosi iklan bisnis, komersial, F&B, jasa, dan UMKM dengan durasi tayang yang fleksibel.
              </p>
            </div>
          </div>
          <div class="pt-6 border-t border-slate-50 flex items-center justify-between text-blue-700 text-[10px] font-black uppercase tracking-wider">
            <span>Pilih Layanan</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        <!-- Internal OPD Card -->
        <div 
          @click="selectInternal"
          class="group bg-white border-2 border-slate-100 hover:border-amber-500/30 rounded-3xl p-10 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          <div class="space-y-6">
            <div class="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter">Internal Pemkab Sinjai</h3>
              <p class="text-xs font-bold text-slate-400 leading-relaxed">
                Khusus untuk OPD, Instansi vertikal, lembaga daerah, dan himbauan publik resmi dari Pemkab.
              </p>
            </div>
          </div>
          <div class="pt-6 border-t border-slate-50 flex items-center justify-between text-amber-600 text-[10px] font-black uppercase tracking-wider">
            <span>Pilih Layanan</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
      </div>

      <!-- STEP 1B: CHOOSE INTERNAL OPTION (ADMIN ONLY SELECTOR SCREEN) -->
      <div v-if="viewMode === 'CHOOSE_INTERNAL_TYPE'" class="space-y-8 max-w-3xl mx-auto animate-slide-up">
        <div class="flex items-center justify-between px-2">
          <button @click="viewMode = 'CHOOSE_CATEGORY'" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
            Kembali
          </button>
          <div class="px-3 py-1 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-wider rounded border border-amber-100">
            Menu Administrator
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Standard Public Card -->
          <div 
            @click="selectForm('FORM_STANDARD')"
            class="group bg-white border-2 border-slate-100 hover:border-amber-500 rounded-3xl p-8 cursor-pointer shadow-lg hover:shadow-xl transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div class="space-y-4">
              <h4 class="text-xl font-black text-slate-900 uppercase tracking-tight">1. Formulir Publik</h4>
              <p class="text-xs font-bold text-slate-400 leading-relaxed">
                Halaman registrasi umum untuk OPD/Instansi Pemkab Sinjai. Dibatasi otomatis maksimal 3 hari tayang.
              </p>
            </div>
            <div class="text-[10px] font-black text-amber-600 uppercase tracking-widest pt-4 flex items-center gap-2">
              <span>Buka Formulir</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>

          <!-- Special Private Card -->
          <div 
            class="group bg-white border-2 border-slate-100 hover:border-blue-600 rounded-3xl p-8 transition-all flex flex-col justify-between min-h-[220px] relative"
          >
            <div class="space-y-4" @click="selectForm('FORM_SPECIAL')">
              <div class="flex justify-between items-center">
                <h4 class="text-xl font-black text-slate-900 uppercase tracking-tight cursor-pointer">2. Formulir Khusus</h4>
                <span class="px-2 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-black uppercase tracking-widest rounded border border-blue-100">Private Link</span>
              </div>
              <p class="text-xs font-bold text-slate-400 leading-relaxed cursor-pointer">
                Diperuntukkan khusus bagi instansi tertentu. Memungkinkan pemilihan durasi bebas/kustom (lebih dari 3 hari).
              </p>
            </div>
            <div class="pt-6 flex flex-col gap-3">
              <button 
                @click="selectForm('FORM_SPECIAL')"
                class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Buka Formulir
              </button>
              <button 
                @click="copySpecialLink"
                class="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-blue-100"
              >
                🔗 Salin Link Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FORM CONTAINER (FORM_STANDARD OR FORM_SPECIAL) -->
      <div v-if="viewMode === 'FORM_STANDARD' || viewMode === 'FORM_SPECIAL'" class="space-y-6 animate-slide-up">
        
        <!-- Back navigation and title description -->
        <div class="flex items-center justify-between px-2">
          <button 
            @click="goBack" 
            class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Pilihan Kategori
          </button>
          
          <div 
            :class="viewMode === 'FORM_SPECIAL' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'"
            class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm"
          >
            {{ viewMode === 'FORM_SPECIAL' ? '📄 Formulir Khusus (Durasi Bebas)' : '📄 Formulir Publik (Max 3 Hari)' }}
          </div>
        </div>

        <form @submit.prevent="handlePreSubmit" autocomplete="off" class="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-4xl relative">
          <!-- Fake Inputs to stop browser autofill heuristics -->
          <input type="text" style="display:none" aria-hidden="true">
          <input type="password" style="display:none" aria-hidden="true">
          
          <!-- Progress Overlay -->
          <div v-if="isSubmitting" class="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12">
             <div class="w-full max-w-xs space-y-6 text-center animate-pulse">
                <div class="relative w-24 h-24 mx-auto">
                   <svg class="w-full h-full transform -rotate-90">
                     <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" class="text-slate-100" />
                     <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" :stroke-dasharray="251.2" :stroke-dashoffset="251.2 - (251.2 * uploadProgress) / 100" class="text-blue-700 transition-all duration-300" />
                   </svg>
                   <div class="absolute inset-0 flex items-center justify-center font-black text-blue-700 text-lg">
                      {{ uploadProgress }}%
                   </div>
                </div>
                <div class="space-y-1">
                   <p class="text-xs font-black uppercase tracking-[0.3em] text-slate-900">{{ statusLabel }}</p>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mohon jangan tutup halaman ini...</p>
                </div>
             </div>
          </div>

          <div class="p-8 md:p-16 space-y-16">
            
            <!-- 01: IDENTITY -->
            <div class="space-y-10">
              <div class="flex items-center gap-4">
                 <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">01</div>
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Identitas Pengaju (OPD/Instansi)</h4>
                 <div class="flex-grow h-px bg-slate-50"></div>
              </div>
              <div class="grid md:grid-cols-2 gap-10">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instansi / Nama Lembaga</label>
                  <input v-model="form.instansi" type="text" placeholder="Contoh: Dinas Kesehatan" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold" required />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama PIC (Penanggung Jawab)</label>
                  <input v-model="form.pic" type="text" placeholder="Nama Lengkap" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold" required />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp Aktif</label>
                  <input v-model="form.hp" type="tel" placeholder="Contoh: 08123456789" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold" required />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Resmi Instansi</label>
                  <input v-model="form.email" type="email" placeholder="Contoh: dinas@sinjaikab.go.id" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold" required />
                </div>
              </div>
            </div>

            <!-- 02: SCHEDULING (DURASI & RENTANG TANGGAL) -->
            <div class="space-y-10">
              <div class="flex items-center gap-4">
                 <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">02</div>
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Jadwal & Durasi Tayang</h4>
                 <div class="flex-grow h-px bg-slate-50"></div>
              </div>

              <!-- PILIHAN CARA INPUT DURASI (HANYA UNTUK FORM KHUSUS / BEBAS) -->
              <div v-if="viewMode === 'FORM_SPECIAL'" class="flex gap-3 p-1.5 bg-slate-100 rounded-2xl max-w-md">
                <button 
                  type="button" 
                  @click="caraDurasi = 'DURASI'"
                  :class="caraDurasi === 'DURASI' ? 'bg-white text-blue-700 shadow-md border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
                  class="flex-1 py-3.5 text-[9px] font-black uppercase tracking-wider rounded-xl border-2 transition-all cursor-pointer"
                >
                  🗓️ Tentukan Durasi
                </button>
                <button 
                  type="button" 
                  @click="caraDurasi = 'TANGGAL_AKHIR'"
                  :class="caraDurasi === 'TANGGAL_AKHIR' ? 'bg-white text-blue-700 shadow-md border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
                  class="flex-1 py-3.5 text-[9px] font-black uppercase tracking-wider rounded-xl border-2 transition-all cursor-pointer"
                >
                  🏁 Hingga Tanggal Akhir
                </button>
              </div>

              <div class="grid md:grid-cols-2 gap-10">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mulai Ditayangkan Pada</label>
                  <input v-model="form.tanggal_mulai" type="date" :min="todayDate" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900" required />
                </div>

                <!-- JIKA CARA DURASI = TANGGAL AKHIR (FORM KHUSUS ONLY) -->
                <div v-if="viewMode === 'FORM_SPECIAL' && caraDurasi === 'TANGGAL_AKHIR'" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selesai Ditayangkan Pada</label>
                    <span v-if="form.tanggal_mulai && tanggalAkhir && form.durasi > 0" class="text-[8px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded uppercase tracking-wider border border-blue-100">
                      {{ form.durasi }} Hari Tayang
                    </span>
                  </div>
                  <input v-model="tanggalAkhir" type="date" :min="form.tanggal_mulai || todayDate" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900" required />
                </div>

                <!-- DURASI BIASA (HARI / MINGGU / BULAN / TAHUN / SELAMANYA) -->
                <div v-else class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {{ viewMode === 'FORM_STANDARD' ? 'Durasi Penayangan (Maks 3 Hari)' : 'Durasi Penayangan' }}
                  </label>
                  <div class="flex gap-2">
                    <input 
                      v-model="form.durasi" 
                      type="number" 
                      min="1" 
                      :max="viewMode === 'FORM_STANDARD' ? 3 : 99" 
                      autocomplete="off" 
                      class="flex-grow px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900" 
                      required 
                    />
                    
                    <!-- Pilihan satuan durasi jika Form Khusus -->
                    <select v-if="viewMode === 'FORM_SPECIAL'" v-model="form.satuan" class="w-36 px-4 rounded-xl bg-blue-50 border-2 border-blue-100 font-black text-[9px] uppercase tracking-widest outline-none text-blue-800">
                      <option value="HARI">Hari</option>
                      <option value="MINGGU">Minggu</option>
                      <option value="BULAN">Bulan</option>
                      <option value="TAHUN">Tahun</option>
                      <option value="SELAMANYA">Selamanya</option>
                    </select>
                    <!-- Satuan terkunci "Hari" jika Form Standard -->
                    <div v-else class="px-6 py-4 rounded-xl bg-amber-50 border-2 border-amber-100 font-black text-[9px] uppercase tracking-widest flex items-center text-amber-800">
                      Hari
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 03: CONTENT DETAIL -->
            <div class="space-y-10">
              <div class="flex items-center gap-4">
                 <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">03</div>
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Materi & Berkas Penayangan</h4>
                 <div class="flex-grow h-px bg-slate-50"></div>
              </div>
              <div class="space-y-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul / Tema Publikasi</label>
                  <input v-model="form.judul" type="text" name="v_judul_iklan" placeholder="Contoh: Himbauan Jaga Kebersihan" autocomplete="new-password" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold" required />
                </div>
                <div class="grid md:grid-cols-2 gap-10">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Publikasi</label>
                    <select v-model="form.kategori" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold text-slate-900" required>
                      <option value="">Pilih Kategori...</option>
                      <option value="Pembangunan">Pembangunan Daerah</option>
                      <option value="Himbauan">Himbauan Masyarakat</option>
                      <option value="Pemerintahan">Info Pemerintahan</option>
                      <option value="Layanan Masyarakat">Layanan Masyarakat</option>
                      <option value="Agenda Pemkab">Agenda / Event Pemkab</option>
                      <option value="Peringatan Hari Besar">HUT / Peringatan Hari Besar</option>
                      <option value="Prestasi Daerah">Prestasi / Penghargaan</option>
                      <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                      <option value="Lainnya">Lainnya (Kustom)...</option>
                    </select>
                  </div>
                  
                  <div class="space-y-4">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Metode Pengiriman Berkas</label>
                    <div class="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                      <button 
                        type="button" 
                        @click="uploadType = 'FILE'" 
                        :class="uploadType === 'FILE' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'"
                        class="py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                      >
                        📁 Upload File
                      </button>
                      <button 
                        type="button" 
                        @click="uploadType = 'LINK'" 
                        :class="uploadType === 'LINK' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-900'"
                        class="py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all text-center cursor-pointer"
                      >
                        🔗 Link Drive
                      </button>
                    </div>

                    <!-- Input Upload File -->
                    <div v-if="uploadType === 'FILE'" class="space-y-2 animate-fade-in">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Pilih Berkas (Gambar/Video - Maks 100MB)</label>
                      <input type="file" @change="handleFileUpload" accept="image/*,video/*" class="w-full text-[10px] font-black text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-900 file:text-white hover:file:bg-blue-700 cursor-pointer" :required="uploadType === 'FILE'" />
                    </div>

                    <!-- Input Tautan Google Drive -->
                    <div v-else class="space-y-2 animate-fade-in">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Tautan Google Drive</label>
                      <input v-model="linkUrl" type="url" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="https://drive.google.com/file/d/.../view" :required="uploadType === 'LINK'" />
                      <p class="text-[8px] font-bold text-slate-400 uppercase leading-normal tracking-tight">
                        * Akses link harus disetel ke "Siapa saja yang memiliki link" dan opsi download diizinkan.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Custom Category Text Input -->
                <div v-if="form.kategori === 'Lainnya'" class="space-y-2 animate-fade-in">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Kustom Anda</label>
                  <input v-model="form.kategori_kustom" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold text-slate-900" placeholder="Ketik kategori kustom..." required />
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER / SUBMISSION ACTION -->
          <div class="bg-slate-50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-slate-100">
            <div class="flex items-center gap-3">
               <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></div>
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Memerlukan Verifikasi Manual Admin</p>
            </div>
            <button 
              type="submit" 
              :disabled="isSubmitting"
              :class="viewMode === 'FORM_SPECIAL' ? 'bg-gradient-to-r from-blue-700 to-indigo-700' : 'bg-gradient-to-r from-amber-500 to-orange-500'"
              class="w-full md:w-auto px-16 py-6 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 disabled:bg-slate-300"
            >
              Kirim Pengajuan
            </button>
          </div>
        </form>
      </div>

      <!-- COMMERCIAL UNDER DEVELOPMENT MODAL -->
      <transition name="page">
        <div v-if="showCommercialModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div class="bg-white max-w-md w-full rounded-3xl p-10 md:p-12 text-center space-y-8 relative overflow-hidden shadow-2xl border border-slate-100">
            <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            
            <div class="space-y-3">
              <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Fitur Komersial</h2>
              <div class="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-[8px] font-black uppercase tracking-widest rounded border border-blue-100">
                Dalam Pengembangan
              </div>
              <p class="text-xs font-bold text-slate-400 leading-relaxed max-w-sm mx-auto">
                Pendaftaran untuk Usaha Komersial (Iklan/Promosi Swasta) saat ini sedang ditangguhkan karena sedang dilakukan penyesuaian dan sinkronisasi dengan aturan/regulasi daerah yang berlaku serta integrasi sistem pembayaran elektronik.
              </p>
            </div>

            <div class="space-y-2 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <div class="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                <span>Progress Sinkronisasi & Integrasi</span>
                <span class="text-blue-700">85%</span>
              </div>
              <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-[85%] rounded-full"></div>
              </div>
            </div>

            <button 
              @click="showCommercialModal = false" 
              class="w-full py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all"
            >
              Mengerti
            </button>
          </div>
        </div>
      </transition>

      <!-- REGISTRATION SUCCESS MODAL -->
      <transition name="page">
        <div v-if="successData" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-6">
          <div class="bg-white max-w-xl w-full rounded-3xl p-10 md:p-16 text-center space-y-10 relative overflow-hidden shadow-2xl border border-slate-100">
            <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div class="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
            <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pengajuan <span class="text-green-600">Berhasil!</span></h2>
            
            <p class="text-xs font-bold text-slate-400 leading-relaxed max-w-sm mx-auto">
              Berkas Anda telah dicatat di database sistem. Simpan nomor registrasi di bawah untuk memeriksa status kelayakan tayang secara berkala.
            </p>

            <div class="bg-slate-50 p-8 rounded-2xl border-2 border-dashed border-slate-200 group relative">
               <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Simpan Nomor Registrasi:</span>
               <span class="text-3xl font-black text-slate-900 font-mono tracking-tighter">{{ successData.no_registrasi }}</span>
               <button @click="copyCode(successData.no_registrasi)" class="absolute top-3 right-3 p-2 bg-white rounded-lg shadow hover:text-blue-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
            </div>
            
            <button @click="resetView" class="w-full py-5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">Selesai & Kembali</button>
          </div>
        </div>
      </transition>

      <!-- WARNING PROCEDURE STATEMENT MODAL -->
      <transition name="page">
        <div v-if="showWarning" class="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6">
          <div class="bg-white max-w-xl w-full rounded-3xl p-10 md:p-16 space-y-10 border-t-8 border-amber-500 shadow-2xl">
            <div class="text-center space-y-4">
              <div class="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pernyataan Prosedur</h2>
              <p class="text-xs font-bold text-slate-500 leading-relaxed text-justify italic bg-slate-50 p-6 rounded-2xl border border-slate-100">
                "Pengajuan dilakukan di luar jam kerja atau mendesak. Saya memahami Admin hanya aktif pada hari/jam kerja resmi. Keterlambatan akibat unggahan mendadak adalah tanggung jawab pengaju sepenuhnya."
              </p>
            </div>
            <div class="space-y-4">
              <button @click="proceedWithSubmit" class="w-full py-5 bg-slate-950 hover:bg-slate-850 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all">Setuju & Kirim</button>
              <button @click="showWarning = false" class="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">Batalkan</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- TECHNICAL GUIDELINES MODAL -->
      <transition name="page">
        <div v-if="showGuidelineModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[250] flex items-center justify-center p-6">
          <div class="bg-white max-w-lg w-full rounded-3xl p-8 md:p-10 text-left space-y-6 relative overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col justify-between">
            <div class="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500"></div>
            
            <!-- Header -->
            <div class="space-y-1">
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter">Pedoman Teknis Materi</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harap perhatikan ketentuan ukuran dan format file</p>
            </div>

            <!-- Content Area (Scrollable if needed) -->
            <div class="space-y-5 overflow-y-auto pr-1 flex-1 text-xs text-slate-600 font-bold leading-relaxed">
              
              <!-- Peringatan Utama -->
              <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span class="text-[9px] font-black text-amber-700 uppercase tracking-tight leading-relaxed">
                  Penting: Admin tidak melayani pengeditan materi dalam bentuk apa pun. Konten yang dikirimkan harus berupa konten siap saji yang sudah jadi.
                </span>
              </div>

              <!-- Ketentuan Gambar -->
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h5 class="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">🖼️ FORMAT GAMBAR (.JPG / .PNG)</h5>
                <ul class="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                  <li>Ukuran file: Maksimal <span class="font-black text-slate-700">5MB</span> (Maksimal mutlak 10MB).</li>
                  <li>Rasio dimensi wajib: <span class="font-black text-slate-700">6 X 4 (Landscape)</span>.</li>
                  <li>Resolusi tidak harus sangat tinggi, yang terpenting konten terbaca dengan jelas dan proporsional.</li>
                </ul>
              </div>

              <!-- Ketentuan Video -->
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <h5 class="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">🎥 FORMAT VIDEO (.MP4 / DLL.)</h5>
                
                <!-- Video Standard -->
                <div class="space-y-1 border-b border-slate-200/50 pb-2">
                  <span class="text-[8px] font-black text-amber-600 uppercase tracking-widest">A. Formulir Publik (Standard)</span>
                  <ul class="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                    <li>Durasi video: <span class="font-black text-slate-700">Kurang dari 30 Detik</span> (Direkomendasikan: 15-30 detik).</li>
                    <li>Ukuran file: Maksimal <span class="font-black text-slate-700">30MB</span>.</li>
                  </ul>
                </div>

                <!-- Video Khusus -->
                <div class="space-y-1 pt-1">
                  <span class="text-[8px] font-black text-blue-600 uppercase tracking-widest">B. Formulir Khusus (Internal Prioritas)</span>
                  <ul class="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                    <li>Durasi video: Maksimal <span class="font-black text-slate-700">1 Menit (60 Detik)</span>.</li>
                    <li>Ukuran file: Maksimal <span class="font-black text-slate-700">50MB</span>.</li>
                  </ul>
                </div>
              </div>

            </div>

            <!-- Agreement Box -->
            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <label class="flex items-start gap-3 cursor-pointer">
                <input v-model="guidelineAgreed" type="checkbox" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 mt-0.5 cursor-pointer" />
                <span class="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-relaxed">
                  Saya menyatakan bahwa saya telah membaca, memahami, dan menyetujui seluruh ketentuan format materi di atas.
                </span>
              </label>
            </div>

            <!-- Action Button -->
            <button 
              @click="showGuidelineModal = false"
              :disabled="!guidelineAgreed"
              :class="guidelineAgreed ? 'bg-slate-900 hover:bg-slate-800 shadow-lg cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'"
              class="w-full py-5 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Saya Mengerti & Lanjutkan
            </button>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getSettings, post } from '../api'

const viewMode = ref<'CHOOSE_CATEGORY' | 'CHOOSE_INTERNAL_TYPE' | 'FORM_STANDARD' | 'FORM_SPECIAL'>('CHOOSE_CATEGORY')
const showCommercialModal = ref(false)
const isAdmin = ref(false)

const showGuidelineModal = ref(false)
const guidelineAgreed = ref(false)

watch(viewMode, (newMode) => {
  if (newMode === 'FORM_STANDARD' || newMode === 'FORM_SPECIAL') {
    showGuidelineModal.value = true
    guidelineAgreed.value = false
  }
})

const isSubmitting = ref(false)
const uploadProgress = ref(0)
const statusLabel = ref('Mengunggah Berkas')
const showWarning = ref(false)
const successData = ref<any>(null)
const settings = ref<any>(null)
const todayDate = new Date().toISOString().split('T')[0]
const uploadType = ref('FILE')
const linkUrl = ref('')

const form = reactive({
  jenis: 'OPD', instansi: '', pic: '', hp: '', email: '', judul: '', kategori: '', kategori_kustom: '',
  durasi: 1, satuan: 'HARI', tanggal_mulai: '', fileName: '', mimeType: '',
  fileObject: null as File | null
})

const caraDurasi = ref('DURASI') // 'DURASI' or 'TANGGAL_AKHIR'
const tanggalAkhir = ref('')

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

// Mengubah tipe durasi dan reset
const selectInternal = () => {
  form.jenis = 'OPD'
  if (isAdmin.value) {
    viewMode.value = 'CHOOSE_INTERNAL_TYPE'
  } else {
    // Jika bukan admin, bypass ke form standard
    viewMode.value = 'FORM_STANDARD'
  }
}

const selectForm = (mode: 'FORM_STANDARD' | 'FORM_SPECIAL') => {
  viewMode.value = mode
  form.durasi = 1
  form.satuan = 'HARI'
  caraDurasi.value = 'DURASI'
  tanggalAkhir.value = ''
}

const goBack = () => {
  if (isAdmin.value && (viewMode.value === 'FORM_STANDARD' || viewMode.value === 'FORM_SPECIAL')) {
    viewMode.value = 'CHOOSE_INTERNAL_TYPE'
  } else {
    viewMode.value = 'CHOOSE_CATEGORY'
  }
}

const copySpecialLink = () => {
  const link = `${window.location.origin}/registrasi?special=1`
  navigator.clipboard.writeText(link)
  alert('🔗 Link khusus berhasil disalin! Bagikan link ini ke instansi yang membutuhkan agar dapat mendaftar dengan durasi bebas.')
}

watch(() => form.durasi, (newVal) => {
  // Hanya kunci 3 hari jika di FORM_STANDARD (publik)
  if (viewMode.value === 'FORM_STANDARD' && newVal && Number(newVal) > 3) {
    form.durasi = 3
  }
})

const fetchInitialData = async () => {
  try {
    const res = await getSettings()
    if (res.success) settings.value = res.data
  } catch (e) { console.error('Fetch Error:', e) }
}

const handleFileUpload = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')
  
  let maxSizeBytes = 100 * 1024 * 1024 // 100MB fallback
  let errorMsg = ''
  
  if (viewMode.value === 'FORM_SPECIAL') {
    if (isImage) {
      maxSizeBytes = 10 * 1024 * 1024 // 10MB
      errorMsg = 'Untuk formulir khusus, ukuran file gambar maksimal 10MB (Rasio 6x4).'
    } else if (isVideo) {
      maxSizeBytes = 50 * 1024 * 1024 // 50MB
      errorMsg = 'Untuk formulir khusus, ukuran file video maksimal 50MB (Durasi maksimal 1 menit).'
    }
  } else {
    // FORM_STANDARD
    if (isImage) {
      maxSizeBytes = 10 * 1024 * 1024 // 10MB max limit
      errorMsg = 'Ukuran file gambar maksimal 10MB (Rekomendasi di bawah 5MB, Rasio 6x4).'
    } else if (isVideo) {
      maxSizeBytes = 30 * 1024 * 1024 // 30MB
      errorMsg = 'Ukuran file video maksimal 30MB (Durasi maksimal 30 detik).'
    }
  }

  if (file.size > maxSizeBytes) {
    alert(`⚠️ Berkas Terlalu Besar!\n${errorMsg}\n\nUkuran berkas Anda: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    e.target.value = ''
    form.fileObject = null
    form.fileName = ''
    form.mimeType = ''
    return
  }

  form.fileObject = file
  form.fileName = file.name
  form.mimeType = file.type
}

const uploadInChunks = async (file: File, onProgress: (pct: number) => void): Promise<{ uploadId: string, totalChunks: number }> => {
  const CHUNK_SIZE = 60 * 1024 
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  const uploadId = 'up_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)

  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    const chunkBase64 = await new Promise<string>((resolve) => {
      const r = new FileReader(); r.onload = () => resolve(r.result as string); r.readAsDataURL(chunk)
    })

    const res = await post('uploadChunk', { uploadId, chunkIndex: i, chunkData: chunkBase64 })
    if (!res.success) throw new Error(res.message)
    
    if (i % 10 === 0 || i === totalChunks - 1) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100))
    }
  }
  return { uploadId, totalChunks }
}

const handlePreSubmit = () => {
  if (!form.tanggal_mulai) return alert('Pilih tanggal mulai tayang.')
  if (viewMode.value === 'FORM_SPECIAL' && caraDurasi.value === 'TANGGAL_AKHIR') {
    if (!tanggalAkhir.value) return alert('Pilih tanggal akhir tayang.')
    if (form.durasi <= 0) return alert('Tanggal akhir tayang harus setelah tanggal mulai tayang.')
  }
  const today = new Date(); const start = new Date(form.tanggal_mulai)
  const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 3600 * 24))
  if (diffDays < 3 || today.getDay() === 0 || today.getDay() === 6) showWarning.value = true
  else proceedWithSubmit()
}

const proceedWithSubmit = async () => {
  showWarning.value = false
  if (isSubmitting.value) return
  
  if (uploadType.value === 'FILE') {
    if (!form.fileObject) return alert('Unggah berkas materi.')
  } else {
    if (!linkUrl.value) return alert('Masukkan link Google Drive.')
    if (!linkUrl.value.includes('drive.google.com') && !linkUrl.value.includes('docs.google.com')) {
      return alert('Harap masukkan link Google Drive yang valid.')
    }
  }
  
  if (form.kategori === 'Lainnya' && !form.kategori_kustom) return alert('Masukkan nama kategori kustom Anda.')

  isSubmitting.value = true
  uploadProgress.value = 0
  
  try {
    let finalFileUrl = ''
    let finalFileName = ''
    let finalMimeType = ''
    
    if (uploadType.value === 'FILE' && form.fileObject) {
      statusLabel.value = 'Mengunggah Berkas...'
      const chunkInfo = await uploadInChunks(form.fileObject, (pct) => { uploadProgress.value = pct })
      
      const sanitizedTitle = form.judul.substring(0, 20).replace(/[^a-z0-9]/gi, '-');
      const extension = form.fileName.split('.').pop();
      finalFileName = `REG_${sanitizedTitle}_${Math.random().toString(36).substr(2, 5).toUpperCase()}_${Date.now()}.${extension}`;

      statusLabel.value = 'Menyusun File...'
      uploadProgress.value = 99
      const assembleRes = await post('assembleChunkFile', {
         uploadId: chunkInfo.uploadId, totalChunks: chunkInfo.totalChunks,
         fileName: finalFileName, mimeType: form.mimeType
       })

      if (!assembleRes.success) throw new Error(assembleRes.message)
      finalFileUrl = assembleRes.fileUrl
      finalMimeType = form.mimeType
    } else {
      statusLabel.value = 'Memvalidasi Link Google Drive...'
      uploadProgress.value = 50
      finalFileUrl = linkUrl.value
      finalFileName = 'Google Drive Link'
    }

    statusLabel.value = 'Mencatat Data...'
    uploadProgress.value = 90
    const res = await post('submitPengajuan', { 
      ...form, 
      kategori: form.kategori === 'Lainnya' ? form.kategori_kustom : form.kategori,
      fileUrl: finalFileUrl, 
      fileName: finalFileName,
      mimeType: finalMimeType,
      isLinkSubmission: uploadType.value === 'LINK'
    })

    if (res.success) successData.value = { no_registrasi: res.no_registrasi, biaya: res.total_biaya }
    else alert('Gagal: ' + res.message)
  } catch (error: any) {
    console.error('Submit Error:', error);
    const errMsg = error.response?.data?.message || error.message || 'Kesalahan koneksi.';
    alert('Gagal mengirim pengajuan: ' + errMsg);
  } finally {
    isSubmitting.value = false
  }
}

const copyCode = (code: string) => { navigator.clipboard.writeText(code); alert('Disalin!') }
const resetView = () => window.location.href = '/'

onMounted(() => {
  isAdmin.value = !!localStorage.getItem('admin_user')
  if (isAdmin.value) {
    fetchInitialData()
  }
  
  // Cek query parameter "special" atau "type"
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('special') === '1' || urlParams.get('type') === 'internal-special') {
    viewMode.value = 'FORM_SPECIAL'
    showGuidelineModal.value = true
    guidelineAgreed.value = false
  }
})
</script>

<style scoped>
/* Custom animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Vue transition styles */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
