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

            <!-- 02: DETAIL MATERI & PUBLIKASI -->
            <div class="space-y-10">
              <div class="flex items-center gap-4">
                 <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">02</div>
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Detail Publikasi & Tema</h4>
                 <div class="flex-grow h-px bg-slate-50"></div>
              </div>
              <div class="grid md:grid-cols-2 gap-10">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul / Tema Publikasi</label>
                  <input v-model="form.judul" type="text" name="v_judul_iklan" placeholder="Contoh: Himbauan Jaga Kebersihan" autocomplete="new-password" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold" required />
                </div>
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
              </div>
              
              <!-- Custom Category Text Input -->
              <div v-if="form.kategori === 'Lainnya'" class="space-y-2 animate-fade-in">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Kustom Anda</label>
                <input v-model="form.kategori_kustom" type="text" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-bold text-slate-900" placeholder="Ketik kategori kustom..." required />
              </div>
            </div>

            <!-- 03: JADWAL & DURASI TAYANG -->
            <div class="space-y-10">
              <div class="flex items-center gap-4">
                 <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">03</div>
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Jadwal & Durasi Tayang</h4>
                 <div class="flex-grow h-px bg-slate-50"></div>
              </div>

              <!-- Pilihan Metode Jadwal (Tab Premium) -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Metode Penentuan Jadwal Tayang</label>
                <div class="flex flex-col sm:flex-row gap-3 p-1.5 bg-slate-100 rounded-2xl max-w-xl">
                  <button 
                    type="button" 
                    @click="metodeJadwal = 'MANUAL'"
                    :class="metodeJadwal === 'MANUAL' ? 'bg-white text-blue-700 shadow-md border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
                    class="flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl border-2 transition-all cursor-pointer text-center"
                  >
                    🗓️ Atur Durasi Biasa
                  </button>
                  <button 
                    type="button" 
                    @click="metodeJadwal = 'ACARA'"
                    :class="metodeJadwal === 'ACARA' ? 'bg-white text-blue-700 shadow-md border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
                    class="flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl border-2 transition-all cursor-pointer text-center"
                  >
                    🏆 Berdasarkan Hari Puncak Acara
                  </button>
                </div>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-normal leading-relaxed ml-1">
                  {{ metodeJadwal === 'MANUAL' ? '* Anda menentukan tanggal mulai tayang dan durasi hari tayang secara manual.' : '* Sistem akan otomatis menjadwalkan tayang mulai H-2 sebelum puncak acara hingga hari H acara selesai.' }}
                </p>
              </div>

              <!-- PILIHAN CARA INPUT DURASI (HANYA MUNCUL DI METODE MANUAL & HANYA UNTUK FORM KHUSUS) -->
              <div v-if="metodeJadwal === 'MANUAL' && viewMode === 'FORM_SPECIAL'" class="flex gap-3 p-1.5 bg-slate-100 rounded-2xl max-w-md">
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

              <!-- JIKA METODE JADWAL = MANUAL -->
              <div v-if="metodeJadwal === 'MANUAL'" class="grid md:grid-cols-2 gap-10 animate-fade-in">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mulai Ditayangkan Pada</label>
                  <input v-model="form.tanggal_mulai" type="date" :min="todayDate" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900" required />
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-normal leading-snug mt-1.5 ml-1">
                    * Pengajuan konten wajib diajukan minimal H-7 (7 hari sebelum) tanggal mulai tayang.
                  </p>
                  
                  <!-- Consequence warning for FORM_STANDARD -->
                  <div v-if="viewMode === 'FORM_STANDARD' && form.tanggal_mulai" class="mt-2 p-3 rounded-xl border text-[9px] font-black uppercase tracking-wider leading-relaxed" :class="maxDurasiStandard >= 3 ? 'bg-blue-50/50 border-blue-100 text-blue-700' : 'bg-red-50 border-red-100 text-red-600 animate-pulse'">
                    <span v-if="maxDurasiStandard >= 3">
                      ✓ Pengajuan tepat waktu (>= 3 hari sebelum tayang). Durasi maksimal 3 hari diperbolehkan.
                    </span>
                    <span v-else-if="maxDurasiStandard === 2">
                      ⚠️ KONSEKUENSI PENGAJUAN H-2: Karena pengajuan mendesak, durasi tayang dibatasi maksimal 2 hari.
                    </span>
                    <span v-else>
                      ⚠️ KONSEKUENSI PENGAJUAN H-1/HARI-H: Karena pengajuan sangat mendesak, durasi tayang dibatasi maksimal 1 hari.
                    </span>
                  </div>
                </div>

                <!-- JIKA CARA DURASI = TANGGAL AKHIR (FORM KHUSUS ONLY) -->
                <div v-if="viewMode === 'FORM_SPECIAL' && caraDurasi === 'TANGGAL_AKHIR'" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selesai Ditayangkan Pada</label>
                    <span v-if="form.tanggal_mulai && tanggalAkhir && form.durasi > 0" class="text-[8px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded uppercase tracking-wider border border-blue-100">
                      {{ form.durasi }} Hari Tayang
                    </span>
                    <span v-if="!form.tanggal_mulai" class="text-[8px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded uppercase tracking-wider border border-amber-100 animate-pulse">
                      ⚠️ Pilih tanggal mulai dahulu
                    </span>
                  </div>
                  <input v-model="tanggalAkhir" type="date" :min="form.tanggal_mulai || todayDate" :max="maxTanggalAkhir" :disabled="!form.tanggal_mulai" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed" required />
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-normal leading-snug mt-1.5">
                    * Pilihan tanggal akhir otomatis dibatasi maksimal 30 hari dari tanggal mulai.
                  </p>
                </div>

                <!-- DURASI BIASA -->
                <div v-else class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {{ viewMode === 'FORM_STANDARD' ? 'Durasi Penayangan (Maks 3 Hari)' : 'Durasi Penayangan (Maks 30 Hari)' }}
                  </label>
                  <div class="flex gap-2">
                    <input 
                      v-model="form.durasi" 
                      type="number" 
                      min="1" 
                      :max="viewMode === 'FORM_STANDARD' ? 3 : 30" 
                      autocomplete="off" 
                      class="flex-grow px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900" 
                      required 
                    />
                    
                    <!-- Satuan terkunci "Hari" -->
                    <div 
                      :class="viewMode === 'FORM_SPECIAL' ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-amber-50 border-amber-100 text-amber-800'"
                      class="px-6 py-4 rounded-xl border-2 font-black text-[9px] uppercase tracking-widest flex items-center"
                    >
                      Hari
                    </div>
                  </div>
                </div>
              </div>

              <!-- JIKA METODE JADWAL = ACARA -->
              <div v-else class="grid md:grid-cols-2 gap-10 animate-fade-in">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Puncak Acara / Event</label>
                  <input v-model="tanggalAcara" type="date" :min="todayDate" autocomplete="off" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 focus:bg-white outline-none transition-all font-black text-slate-900" required />
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-normal leading-snug mt-1.5 ml-1">
                    * Pengajuan konten wajib diajukan minimal H-7 (7 hari sebelum) tanggal puncak acara.
                  </p>
                </div>
                
                <div class="space-y-2 flex flex-col justify-end">
                  <div v-if="tanggalAcara && form.durasi > 0" class="p-4 bg-emerald-50 border-2 border-emerald-100/50 rounded-2xl space-y-1">
                    <span class="text-[9px] font-black text-emerald-700 uppercase tracking-widest block">📅 RENCANA JADWAL TAYANG OTOMATIS:</span>
                    <p class="text-xs font-bold text-slate-800 leading-normal">
                      Mulai: <span class="text-blue-700">{{ form.tanggal_mulai }}</span> s.d. Selesai: <span class="text-blue-700">{{ tanggalAkhir }}</span>
                    </p>
                    <span class="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">
                      Total: {{ form.durasi }} Hari Tayang (H-2 s.d. Hari-H Acara)
                    </span>
                    <span v-if="viewMode === 'FORM_STANDARD' && form.durasi < 3" class="text-[9px] font-black text-rose-600 uppercase tracking-wider block animate-pulse mt-1">
                      ⚠️ KONSEKUENSI PENGAJUAN MENDESAK: Durasi tayang dipotong menjadi {{ form.durasi }} hari.
                    </span>
                  </div>
                  <div v-else class="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center min-h-[70px]">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Tentukan tanggal puncak acara untuk menghitung jadwal</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 04: PENGIRIMAN BERKAS & MEDIA -->
            <div class="space-y-10">
              <div class="flex items-center gap-4">
                 <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">04</div>
                 <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Unggah Berkas / Media Materi</h4>
                 <div class="flex-grow h-px bg-slate-50"></div>
              </div>
              
              <div class="space-y-8 max-w-xl">
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
      <teleport to="body">
        <transition name="page">
          <div v-if="showCommercialModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-6">
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
      </teleport>

      <!-- REGISTRATION SUCCESS MODAL -->
      <teleport to="body">
        <transition name="page">
          <div v-if="successData" class="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[9999] flex items-center justify-center p-6">
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
      </teleport>

      <!-- WARNING PROCEDURE STATEMENT MODAL -->
      <teleport to="body">
        <transition name="page">
          <div v-if="showWarning" class="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[9999] flex items-center justify-center p-6">
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
      </teleport>

      <!-- TECHNICAL GUIDELINES MODAL -->
      <teleport to="body">
        <transition name="page">
          <div v-if="showGuidelineModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-6">
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
                <div class="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-2.5 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span class="text-xs font-black text-red-600 uppercase tracking-tight leading-relaxed">
                    Penting: Admin tidak melayani pengeditan materi dalam bentuk apa pun. Konten yang dikirimkan harus berupa konten siap saji yang sudah jadi.
                  </span>
                </div>

                <!-- Ketentuan Waktu Pengajuan (H-7) -->
                <div class="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                  <h5 class="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">📅 WAKTU PENGAJUAN WAJIB (H-7)</h5>
                  <p class="text-slate-700 font-semibold leading-relaxed">
                    Pengajuan konten wajib dikirimkan minimal <span class="font-black text-amber-700">H-7 (7 hari sebelum)</span> rencana tanggal materi Anda akan mulai ditayangkan.
                  </p>
                  <p class="text-[10px] font-bold text-amber-600 leading-normal">
                    * Catatan: Aturan ini berlaku untuk memberikan waktu bagi Admin dalam memverifikasi materi secara teknis serta menjadwalkan antrean videotron.
                  </p>
                </div>

                <!-- Ketentuan Gambar -->
                <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <h5 class="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">🖼️ FORMAT GAMBAR (.JPG / .PNG)</h5>
                  <ul class="list-disc pl-4 space-y-1 text-slate-500 font-medium">
                    <li>Ukuran file: Maksimal <span class="font-black text-slate-700">5MB</span> (Maksimal mutlak 10MB).</li>
                    <li>Rasio dimensi wajib: <span class="font-black text-slate-700">6 X 4 (Landscape)</span>.</li>
                    <li>Resolusi tidak harus sangat tinggi, yang terpenting konten terbaca dengan jelas and proporsional.</li>
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
      </teleport>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSettings, post } from '../api'

const viewMode = ref<'CHOOSE_CATEGORY' | 'CHOOSE_INTERNAL_TYPE' | 'FORM_STANDARD' | 'FORM_SPECIAL'>('CHOOSE_CATEGORY')
const showCommercialModal = ref(false)
const isAdmin = ref(false)

const router = useRouter()
const route = useRoute()

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

const metodeJadwal = ref<'MANUAL' | 'ACARA'>('MANUAL')
const tanggalAcara = ref('')

const form = reactive({
  jenis: 'OPD', instansi: '', pic: '', hp: '', email: '', judul: '', kategori: '', kategori_kustom: '',
  durasi: 1, satuan: 'HARI', tanggal_mulai: '', fileName: '', mimeType: '',
  fileObject: null as File | null
})

const caraDurasi = ref('DURASI') // 'DURASI' or 'TANGGAL_AKHIR'

const getDiffDaysFromToday = (dateStr: string): number => {
  if (!dateStr) return 0
  const today = new Date()
  const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  
  const parts = dateStr.split('-')
  const targetDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
  
  const diffTime = targetDate.getTime() - todayZero.getTime()
  return Math.round(diffTime / (1000 * 3600 * 24))
}

const maxDurasiStandard = computed(() => {
  if (viewMode.value !== 'FORM_STANDARD') return 30
  if (!form.tanggal_mulai) return 3
  const diff = getDiffDaysFromToday(form.tanggal_mulai)
  if (diff >= 3) return 3
  if (diff === 2) return 2
  return 1 // diff <= 1
})

watch(maxDurasiStandard, (newMax) => {
  if (viewMode.value === 'FORM_STANDARD' && form.durasi > newMax) {
    form.durasi = newMax
  }
})
const tanggalAkhir = ref('')

const addDaysLocal = (dateStr: string, days: number): string => {
  const parts = dateStr.split('-')
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // 0-indexed
  const day = parseInt(parts[2], 10)
  
  const date = new Date(year, month, day)
  date.setDate(date.getDate() + days)
  
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const maxTanggalAkhir = computed(() => {
  if (!form.tanggal_mulai) return ''
  return addDaysLocal(form.tanggal_mulai, 30)
})

const calculateDurationFromDates = () => {
  if (caraDurasi.value === 'TANGGAL_AKHIR' && form.tanggal_mulai && tanggalAkhir.value) {
    const parseLocalDate = (dateStr: string) => {
      const parts = dateStr.split('-')
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    }
    const start = parseLocalDate(form.tanggal_mulai)
    const end = parseLocalDate(tanggalAkhir.value)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24))
    
    if (diffDays > 30) {
      alert('⚠️ Durasi penayangan Formulir Khusus maksimal 30 hari!')
      tanggalAkhir.value = addDaysLocal(form.tanggal_mulai, 30)
      form.durasi = 30
      form.satuan = 'HARI'
    } else if (diffDays > 0) {
      form.durasi = diffDays
      form.satuan = 'HARI'
    } else {
      form.durasi = 0
    }
  }
}

watch([() => form.tanggal_mulai, tanggalAkhir, caraDurasi], () => {
  if (caraDurasi.value === 'TANGGAL_AKHIR' && metodeJadwal.value === 'MANUAL') {
    calculateDurationFromDates()
  }
})

const calculateScheduleFromEvent = () => {
  if (metodeJadwal.value === 'ACARA' && tanggalAcara.value) {
    const todayStr = todayDate
    
    // Parse tanggal acara secara lokal
    const parts = tanggalAcara.value.split('-')
    const eventYear = parseInt(parts[0], 10)
    const eventMonth = parseInt(parts[1], 10) - 1
    const eventDay = parseInt(parts[2], 10)
    
    // Hitung lead time: eventDate - today
    const eventDate = new Date(eventYear, eventMonth, eventDay)
    const today = new Date()
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const leadTimeDays = Math.round((eventDate.getTime() - todayZero.getTime()) / (1000 * 3600 * 24))
    
    // Sesuai aturan konsekuensi untuk FORM_STANDARD:
    // Jika lead time acara >= 4 hari: mulai H-2 (durasi 3 hari)
    // Jika lead time acara === 3 hari: mulai H-1 (durasi 2 hari)
    // Jika lead time acara === 2 hari: mulai H-0 (durasi 1 hari)
    // Jika lead time acara === 1 hari: mulai H-0 (durasi 1 hari)
    // Jika lead time acara === 0 hari: mulai H-0 (durasi 1 hari)
    let offsetDays = 2 // default H-2
    let maxDur = 3
    
    if (viewMode.value === 'FORM_STANDARD') {
      if (leadTimeDays >= 4) {
        offsetDays = 2
        maxDur = 3
      } else if (leadTimeDays === 3) {
        offsetDays = 1
        maxDur = 2
      } else {
        // leadTimeDays <= 2
        offsetDays = 0
        maxDur = 1
      }
    }
    
    const idealStart = new Date(eventYear, eventMonth, eventDay)
    idealStart.setDate(idealStart.getDate() - offsetDays)
    
    const y = idealStart.getFullYear()
    const m = String(idealStart.getMonth() + 1).padStart(2, '0')
    const d = String(idealStart.getDate()).padStart(2, '0')
    const idealStartStr = `${y}-${m}-${d}`
    
    // Bandingkan dengan hari ini
    if (idealStartStr >= todayStr) {
      form.tanggal_mulai = idealStartStr
    } else {
      form.tanggal_mulai = todayStr
    }
    
    // Tanggal akhir adalah hari puncak acara
    tanggalAkhir.value = tanggalAcara.value
    
    // Hitung durasi tayang (selisih hari + 1)
    const startParts = form.tanggal_mulai.split('-')
    const start = new Date(parseInt(startParts[0], 10), parseInt(startParts[1], 10) - 1, parseInt(startParts[2], 10))
    const end = new Date(eventYear, eventMonth, eventDay)
    
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24))
    
    if (diffDays >= 0) {
      let computedDurasi = diffDays + 1
      if (viewMode.value === 'FORM_STANDARD' && computedDurasi > maxDur) {
        computedDurasi = maxDur
      }
      form.durasi = computedDurasi
      form.satuan = 'HARI'
    } else {
      form.durasi = 0
    }
  }
}

watch([tanggalAcara, metodeJadwal], () => {
  if (metodeJadwal.value === 'ACARA') {
    calculateScheduleFromEvent()
  }
})

watch(() => form.kategori, (newKategori) => {
  if (newKategori === 'Agenda Pemkab' || newKategori === 'Peringatan Hari Besar') {
    metodeJadwal.value = 'ACARA'
  }
})

watch(metodeJadwal, (newMetode) => {
  if (newMetode === 'MANUAL') {
    form.tanggal_mulai = ''
    form.durasi = 1
    tanggalAkhir.value = ''
    tanggalAcara.value = ''
  }
})

// Mengubah tipe durasi dan reset
const selectInternal = () => {
  form.jenis = 'OPD'
  if (isAdmin.value) {
    viewMode.value = 'CHOOSE_INTERNAL_TYPE'
  } else {
    // Jika bukan admin, bypass ke form standar dengan rute yang benar
    router.push('/registrasi-standar')
  }
}

const selectForm = (mode: 'FORM_STANDARD' | 'FORM_SPECIAL') => {
  viewMode.value = mode
  form.durasi = 1
  form.satuan = 'HARI'
  caraDurasi.value = 'DURASI'
  tanggalAkhir.value = ''
  
  if (mode === 'FORM_SPECIAL') {
    router.push('/registrasi-internal')
  } else {
    router.push('/registrasi-standar')
  }
}

const goBack = () => {
  router.push('/registrasi')
  if (isAdmin.value && (viewMode.value === 'FORM_STANDARD' || viewMode.value === 'FORM_SPECIAL')) {
    viewMode.value = 'CHOOSE_INTERNAL_TYPE'
  } else {
    viewMode.value = 'CHOOSE_CATEGORY'
  }
}

const copySpecialLink = () => {
  const link = `${window.location.origin}/registrasi-internal`
  navigator.clipboard.writeText(link)
  alert('🔗 Link khusus berhasil disalin! Bagikan link ini ke instansi yang membutuhkan agar dapat mendaftar dengan durasi maksimal 30 hari.')
}

watch(() => form.durasi, (newVal) => {
  // Hanya kunci sesuai maxDurasiStandard jika di FORM_STANDARD (publik)
  if (viewMode.value === 'FORM_STANDARD' && newVal) {
    const limit = maxDurasiStandard.value
    if (Number(newVal) > limit) {
      form.durasi = limit
    }
  }
  // Kunci 30 hari jika di FORM_SPECIAL (khusus)
  if (viewMode.value === 'FORM_SPECIAL' && newVal && Number(newVal) > 30) {
    form.durasi = 30
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
  if (metodeJadwal.value === 'ACARA') {
    if (!tanggalAcara.value) return alert('Pilih tanggal puncak acara.')
    calculateScheduleFromEvent()
    if (form.durasi <= 0) return alert('⚠️ Tanggal puncak acara tidak boleh sebelum hari ini!')
    if (viewMode.value === 'FORM_STANDARD' && form.durasi > 3) {
      return alert('⚠️ Total durasi tayang untuk Formulir Publik tidak boleh lebih dari 3 hari!')
    }
  } else {
    if (!form.tanggal_mulai) return alert('Pilih tanggal mulai tayang.')
    if (viewMode.value === 'FORM_SPECIAL') {
      if (caraDurasi.value === 'TANGGAL_AKHIR') {
        if (!tanggalAkhir.value) return alert('Pilih tanggal akhir tayang.')
        calculateDurationFromDates()
      }
      if (form.durasi > 30) {
        return alert('⚠️ Durasi penayangan Formulir Khusus maksimal 30 hari!')
      }
      if (form.durasi <= 0) {
        return alert('⚠️ Durasi penayangan tidak valid (harus minimal 1 hari).')
      }
    } else if (viewMode.value === 'FORM_STANDARD') {
      if (form.durasi > 3) {
        return alert('⚠️ Durasi penayangan Formulir Standard maksimal 3 hari!')
      }
      if (form.durasi <= 0) {
        return alert('⚠️ Durasi penayangan tidak valid (harus minimal 1 hari).')
      }
    }
  }
  const today = new Date(); const start = new Date(form.tanggal_mulai)
  const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 3600 * 24))
  if (diffDays < 3 || today.getDay() === 0 || today.getDay() === 6) showWarning.value = true
  else proceedWithSubmit()
}

const proceedWithSubmit = async () => {
  showWarning.value = false
  if (isSubmitting.value) return
  
  if (viewMode.value === 'FORM_STANDARD' && form.durasi > 3) {
    return alert('⚠️ Total durasi tayang untuk Formulir Publik tidak boleh lebih dari 3 hari!')
  }
  
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
      formMode: viewMode.value,
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

const checkRoutePath = (path: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  if (
    path === '/registrasi-internal' ||
    path.endsWith('/registrasi-internal') ||
    urlParams.get('special') === '1' ||
    urlParams.get('type') === 'internal-special'
  ) {
    viewMode.value = 'FORM_SPECIAL'
    showGuidelineModal.value = true
    guidelineAgreed.value = false
  } else if (
    path === '/registrasi-standar' ||
    path.endsWith('/registrasi-standar')
  ) {
    viewMode.value = 'FORM_STANDARD'
    showGuidelineModal.value = true
    guidelineAgreed.value = false
  } else {
    if (viewMode.value === 'FORM_SPECIAL' || viewMode.value === 'FORM_STANDARD') {
      viewMode.value = isAdmin.value ? 'CHOOSE_INTERNAL_TYPE' : 'CHOOSE_CATEGORY'
    }
  }
}

watch(() => route.path, (newPath) => {
  checkRoutePath(newPath)
})

onMounted(() => {
  isAdmin.value = !!localStorage.getItem('admin_user')
  if (isAdmin.value) {
    fetchInitialData()
  }
  checkRoutePath(window.location.pathname)
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
