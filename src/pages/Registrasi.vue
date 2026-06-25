<template>
  <div class="max-w-4xl mx-auto space-y-12 pb-20 pt-10">
    <div class="text-center space-y-4 px-4">
      <div class="inline-flex px-4 py-2 bg-blue-50 text-blue-700 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">
        Pendaftaran Terpadu
      </div>
      <h1 class="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">Formulir <span class="text-blue-700">Tayang</span></h1>
      <p class="text-lg text-slate-500 font-bold max-w-2xl mx-auto">Silakan pilih kategori layanan dan tentukan jadwal penayangan Anda.</p>
      <div class="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-xl mx-auto flex items-start gap-3 text-left">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         <p class="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-tight">
            Tip: Jika pengajuan ditolak karena kesalahan format, Admin dapat memberikan akses <span class="font-black underline">Perbaikan Data</span>. Anda dapat mengedit materi melalui menu Cek Status nantinya.
         </p>
      </div>
    </div>

    <!-- Step 1: Selection -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
      <button 
        @click="selectJenis('BERBAYAR')"
        :class="form.jenis === 'BERBAYAR' ? 'border-blue-600 ring-4 ring-blue-50 bg-blue-50/20' : 'border-slate-100 hover:border-blue-200'"
        class="group p-10 border-2 rounded-2xl transition-all text-left space-y-6 relative overflow-hidden"
      >
        <div class="w-14 h-14 bg-blue-700 text-white rounded-lg flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter">Usaha Komersial</h3>
          <p class="text-sm font-bold text-slate-500 leading-relaxed">Fleksibel: Harian, Mingguan, atau Bulanan. Cocok untuk promosi bisnis dan event UMKM.</p>
        </div>
        <div v-if="form.jenis === 'BERBAYAR'" class="absolute top-4 right-4"><div class="w-3 h-3 bg-blue-600 rounded-full animate-ping"></div></div>
      </button>

      <button 
        @click="selectJenis('OPD')"
        :class="form.jenis === 'OPD' ? 'border-amber-500 ring-4 ring-amber-50 bg-amber-50/20' : 'border-slate-100 hover:border-amber-200'"
        class="group p-10 border-2 rounded-2xl transition-all text-left space-y-6 relative overflow-hidden"
      >
        <div class="w-14 h-14 bg-amber-500 text-white rounded-lg flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tighter">Internal Pemkab</h3>
          <p class="text-sm font-bold text-slate-500 leading-relaxed">Maksimal 3 hari. Khusus konten resmi OPD, pembangunan daerah, dan himbauan publik.</p>
        </div>
        <div v-if="form.jenis === 'OPD'" class="absolute top-4 right-4"><div class="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div></div>
      </button>
    </div>

    <!-- Form Container -->
    <form @submit.prevent="handlePreSubmit" autocomplete="off" class="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-4xl relative">
      <!-- Fake Inputs to stop browser autofill heuristics -->
      <input type="text" style="display:none" aria-hidden="true">
      <input type="password" style="display:none" aria-hidden="true">
      
      <!-- Progress Overlay -->
      <div v-if="isSubmitting" class="absolute inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12">
         <div class="w-full max-w-xs space-y-6 text-center">
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
        <!-- 01: Identity -->
        <div class="space-y-10">
          <div class="flex items-center gap-4">
             <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">01</div>
             <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Identitas Pengaju</h4>
             <div class="flex-grow h-px bg-slate-50"></div>
          </div>
          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Instansi / Nama Usaha</label>
              <input v-model="form.instansi" type="text" placeholder="..." autocomplete="off" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama PIC (Penanggung Jawab)</label>
              <input v-model="form.pic" type="text" placeholder="..." autocomplete="off" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Aktif</label>
              <input v-model="form.hp" type="tel" placeholder="08..." autocomplete="off" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input v-model="form.email" type="email" placeholder="@..." autocomplete="off" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
            </div>
          </div>
        </div>

        <!-- 02: Scheduling -->
        <div class="space-y-10">
          <div class="flex items-center gap-4">
             <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">02</div>
             <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Jadwal & Durasi</h4>
             <div class="flex-grow h-px bg-slate-50"></div>
          </div>
          <!-- Pilihan Metode Durasi (Hanya untuk Komersial/Berbayar) -->
          <div v-if="form.jenis === 'BERBAYAR'" class="flex gap-3 p-1.5 bg-slate-100 rounded-xl max-w-md">
            <button 
              type="button" 
              @click="caraDurasi = 'DURASI'"
              :class="caraDurasi === 'DURASI' ? 'bg-white text-blue-700 shadow-md border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
              class="flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 transition-all cursor-pointer"
            >
              🗓️ Tentukan Durasi
            </button>
            <button 
              type="button" 
              @click="caraDurasi = 'TANGGAL_AKHIR'"
              :class="caraDurasi === 'TANGGAL_AKHIR' ? 'bg-white text-blue-700 shadow-md border-blue-100' : 'text-slate-500 hover:text-slate-900 border-transparent'"
              class="flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-lg border-2 transition-all cursor-pointer"
            >
              🏁 Hingga Tanggal Akhir
            </button>
          </div>

          <div class="grid md:grid-cols-2 gap-10">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Mulai Tayang</label>
              <input v-model="form.tanggal_mulai" type="date" :min="todayDate" autocomplete="off" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-black text-slate-900" required />
            </div>

            <!-- Jika metode durasi: Tanggal Akhir -->
            <div v-if="form.jenis === 'BERBAYAR' && caraDurasi === 'TANGGAL_AKHIR'" class="space-y-2">
              <div class="flex justify-between items-center">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Akhir Tayang</label>
                <span v-if="form.tanggal_mulai && tanggalAkhir && form.durasi > 0" class="text-[9px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {{ form.durasi }} Hari Penayangan
                </span>
              </div>
              <input v-model="tanggalAkhir" type="date" :min="form.tanggal_mulai || todayDate" autocomplete="off" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-black text-slate-900" required />
            </div>

            <!-- Jika metode durasi: Durasi Biasa atau jenis === OPD -->
            <div v-else class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                {{ form.jenis === 'OPD' ? 'Durasi Tayang (Maks 3 Hari)' : 'Durasi Penayangan' }}
              </label>
              <div class="flex gap-2">
                <input v-model="form.durasi" type="number" min="1" :max="form.jenis === 'OPD' ? 3 : 99" autocomplete="off" class="flex-grow px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-black text-slate-900" required />
                <select v-if="form.jenis === 'BERBAYAR'" v-model="form.satuan" class="w-32 px-4 rounded bg-blue-50 border-2 border-blue-100 font-black text-[10px] uppercase tracking-widest outline-none">
                  <option value="HARI">Hari</option>
                  <option value="MINGGU">Minggu</option>
                  <option value="BULAN">Bulan</option>
                  <option value="TAHUN">Tahun</option>
                </select>
                <div v-else class="px-6 py-4 rounded bg-amber-50 border-2 border-amber-100 font-black text-[10px] uppercase tracking-widest flex items-center">Hari</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 03: Content Detail -->
        <div class="space-y-10">
          <div class="flex items-center gap-4">
             <div class="px-3 py-1 bg-slate-900 text-white text-[10px] font-black italic">03</div>
             <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Materi Visual</h4>
             <div class="flex-grow h-px bg-slate-50"></div>
          </div>
          <div class="space-y-8">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul / Tema Iklan</label>
              <input v-model="form.judul" type="text" name="v_judul_iklan" placeholder="..." autocomplete="new-password" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold" required />
            </div>
            <div class="grid md:grid-cols-2 gap-10">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Konten</label>
                <select v-model="form.kategori" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" required>
                  <option value="">Pilih...</option>
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
                <div v-if="uploadType === 'FILE'" class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Pilih Berkas (Maks 100MB)</label>
                  <input type="file" @change="handleFileUpload" accept="image/*,video/*" class="w-full text-[10px] font-black text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-slate-900 file:text-white hover:file:bg-blue-700 cursor-pointer" :required="uploadType === 'FILE'" />
                </div>

                <!-- Input Tautan Google Drive -->
                <div v-else class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Tautan Google Drive</label>
                  <input v-model="linkUrl" type="url" class="w-full px-6 py-4 rounded-xl bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" placeholder="https://drive.google.com/file/d/.../view" :required="uploadType === 'LINK'" />
                  <p class="text-[9px] font-bold text-slate-400 uppercase ml-1">
                    * Akses link harus disetel ke "Siapa saja yang memiliki link" dan opsi download diizinkan.
                  </p>
                </div>
              </div>
            </div>

            <!-- Custom Category Text Input -->
            <div v-if="form.kategori === 'Lainnya'" class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Masukkan Kategori Kustom</label>
              <input v-model="form.kategori_kustom" type="text" class="w-full px-6 py-4 rounded bg-slate-50 border-2 border-slate-50 focus:border-blue-700 outline-none transition-all font-bold text-slate-900" placeholder="Ketik kategori kustom..." required />
            </div>
          </div>
        </div>

        <div v-if="form.jenis === 'BERBAYAR' && form.durasi" class="p-8 bg-blue-900 text-white rounded-xl space-y-6 shadow-2xl">
           <div class="flex justify-between items-end border-b border-white/10 pb-4">
              <div class="space-y-1">
                 <h5 class="text-[10px] font-black uppercase tracking-widest text-blue-300">Total Tagihan</h5>
                 <p class="text-3xl font-black tracking-tighter">Rp{{ calculateTotal().toLocaleString('id-ID') }}</p>
              </div>
              <div class="text-right text-[10px] font-black uppercase opacity-60">{{ form.durasi }} {{ form.satuan }}</div>
           </div>
        </div>
      </div>

      <div class="bg-slate-50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-slate-100">
        <div class="flex items-center gap-3">
           <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Single Action Verification</p>
        </div>
        <button 
          type="submit" 
          :disabled="isSubmitting"
          :class="form.jenis === 'OPD' ? 'bg-amber-500' : 'bg-blue-700'"
          class="w-full md:w-auto px-16 py-6 text-white rounded font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:bg-slate-300 hover:brightness-110"
        >
          Kirim Pengajuan
        </button>
      </div>
    </form>

    <!-- Success Modal -->
    <transition name="page">
      <div v-if="successData" class="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[200] flex items-center justify-center p-6">
        <div class="bg-white max-w-xl w-full rounded-2xl p-10 md:p-16 text-center space-y-10 relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-2 bg-blue-700"></div>
          <div class="w-20 h-20 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
          <h2 class="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pengajuan <span class="text-blue-700">Berhasil!</span></h2>
          <div class="bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-200 group relative">
             <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Simpan Nomor Registrasi:</span>
             <span class="text-2xl font-black text-slate-900 font-mono tracking-tighter">{{ successData.no_registrasi }}</span>
             <button @click="copyCode(successData.no_registrasi)" class="absolute top-2 right-2 p-2 bg-white rounded shadow-sm text-slate-400 hover:text-blue-700"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
          </div>
          <button @click="resetView" class="w-full py-6 bg-slate-900 text-white rounded font-black text-xs uppercase tracking-[0.3em]">Selesai</button>
        </div>
      </div>
    </transition>

    <!-- Warning Modal -->
    <transition name="page">
      <div v-if="showWarning" class="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[300] flex items-center justify-center p-6">
        <div class="bg-white max-w-xl w-full rounded-2xl p-10 md:p-16 space-y-10 border-t-8 border-amber-500 shadow-2xl">
          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
            <h2 class="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pernyataan Prosedur</h2>
            <p class="text-sm font-bold text-slate-500 leading-relaxed text-justify italic bg-slate-50 p-6 rounded-xl border border-slate-100">
              "Pengajuan dilakukan di luar jam kerja atau mendesak. Saya memahami Admin hanya aktif pada hari/jam kerja resmi. Keterlambatan akibat unggahan mendadak adalah tanggung jawab pengaju sepenuhnya."
            </p>
          </div>
          <div class="space-y-4">
            <button @click="proceedWithSubmit" class="w-full py-6 bg-slate-950 text-white rounded font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-700 transition-all">Setuju & Kirim</button>
            <button @click="showWarning = false" class="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900">Batalkan</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getSettings, post } from '../api'

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
  jenis: 'BERBAYAR', instansi: '', pic: '', hp: '', email: '', judul: '', kategori: '', kategori_kustom: '',
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

const selectJenis = (j: string) => { 
  form.jenis = j 
  form.durasi = 1 
  form.satuan = 'HARI' 
  caraDurasi.value = 'DURASI'
  tanggalAkhir.value = ''
}

watch(() => form.durasi, (newVal) => {
  if (form.jenis === 'OPD' && newVal && Number(newVal) > 3) {
    form.durasi = 3
  }
})

const fetchInitialData = async () => {
  try {
    const res = await getSettings()
    if (res.success) settings.value = res.data
  } catch (e) { console.error('Fetch Error:', e) }
}

const calculateTotal = () => {
  const price = parseInt(settings.value?.PRICE_PER_DAY || 0)
  let mult = 1
  if (form.satuan === 'MINGGU') mult = 7
  if (form.satuan === 'BULAN') mult = 30
  if (form.satuan === 'TAHUN') mult = 365
  return (form.durasi || 0) * mult * price
}

const handleFileUpload = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 100 * 1024 * 1024) {
    alert('File terlalu besar! Maksimal 100MB.')
    e.target.value = ''
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
  if (form.jenis === 'BERBAYAR' && caraDurasi.value === 'TANGGAL_AKHIR') {
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
onMounted(fetchInitialData)
</script>
