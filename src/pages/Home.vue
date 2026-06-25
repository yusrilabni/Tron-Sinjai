<template>
  <div class="space-y-0">
    <!-- Hero Section -->
    <section class="relative bg-slate-50 overflow-hidden border-b-2 border-slate-100 font-sans">
      <div class="max-w-7xl mx-auto px-6 py-24 md:py-32 grid lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-10 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100">
            Official Media Portal
          </div>
          <h1 class="text-6xl md:text-8xl font-black tracking-[calc(-0.04em)] text-slate-900 leading-[0.95]">
            PORTAL <br/>
            <span class="text-blue-700 uppercase">Videotron</span>
          </h1>
          <p class="text-xl text-slate-500 max-w-lg leading-relaxed font-bold tracking-tight">
            Satu pintu pengelolaan media informasi luar ruang digital Kabupaten Sinjai.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 pt-4">
            <router-link to="/registrasi" class="px-10 py-5 bg-blue-700 text-white rounded font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all text-center shadow-2xl shadow-blue-700/30">
              Mulai Pendaftaran
            </router-link>
            <router-link to="/status" class="px-10 py-5 bg-white text-slate-900 border-2 border-slate-900 rounded font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all text-center">
              Pantau Status
            </router-link>
          </div>
        </div>
        
        <!-- Videotron Visual -->
        <div class="relative">
          <div class="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-lg blur-2xl opacity-20 animate-pulse"></div>
          <div class="relative bg-slate-900 p-4 rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.3)] border-8 border-slate-800 transform rotate-2 hover:rotate-0 transition-transform duration-700">
            <div class="aspect-[3/2] bg-black overflow-hidden rounded-sm relative">
              <!-- DYNAMIC MOCKUP: IMAGE OR VIDEO -->
              <template v-if="mockupContent.isVideo">
                <iframe 
                  :key="mockupContent.url"
                  :src="getIframeUrl(mockupContent.url)" 
                  class="w-full h-full border-none transition-all duration-1000"
                  allow="autoplay; encrypted-media"
                ></iframe>
              </template>
              <img 
                v-else
                :key="mockupContent.url"
                :src="mockupContent.url" 
                class="w-full h-full object-cover transition-all duration-1000" 
                :class="mockupContent.isDefault ? 'opacity-40 grayscale' : 'opacity-100'"
                alt="Sinjai Digital" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                 <div class="text-white">
                   <div class="text-[8px] font-black uppercase opacity-60">Now Airing</div>
                   <div class="text-sm font-black uppercase tracking-tight line-clamp-1 max-w-[200px]">{{ mockupContent.judul }}</div>
                 </div>
                 <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-ping">
                   <div class="w-3 h-3 bg-white rounded-full"></div>
                 </div>
              </div>
            </div>
            <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 w-4 h-12 bg-slate-800"></div>
          </div>
          <div class="absolute -bottom-20 -right-10 text-[120px] font-black text-slate-100 -z-10 select-none">TRON</div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="bg-white py-32">
      <div class="max-w-7xl mx-auto px-6 space-y-20">
        
        <!-- Pustaka Informasi / Grup Konten - Unified into unifiedItems below -->

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div class="space-y-6">
            <h2 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">Arsip <span class="text-blue-700">Tayang</span></h2>
            <div class="w-20 h-2 bg-amber-500"></div>
            <p class="text-lg text-slate-500 font-bold max-w-xl">Materi edukasi, sosialisasi, dan komersial yang dipublikasikan secara resmi.</p>
          </div>
          <div class="flex gap-4">
            <button @click="scrollGallery(-1)" class="w-14 h-14 flex items-center justify-center bg-slate-100 rounded text-slate-900 hover:bg-blue-700 hover:text-white transition-all shadow-lg active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button @click="scrollGallery(1)" class="w-14 h-14 flex items-center justify-center bg-slate-100 rounded text-slate-900 hover:bg-blue-700 hover:text-white transition-all shadow-lg active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div v-for="i in 3" :key="i" class="space-y-6">
            <div class="aspect-[3/2] bg-slate-100 animate-pulse rounded-2xl"></div>
            <div class="h-4 bg-slate-100 animate-pulse w-3/4 rounded"></div>
          </div>
        </div>

        <!-- Gallery Slider & Grid -->
        <div v-else-if="individualItemsOnly.length > 0 || groupCardsOnly.length > 0" class="space-y-16">
          
          <!-- Individual Items Horizontal Slider -->
          <div v-if="individualItemsOnly.length > 0" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Materi Mandiri</h3>
              <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border px-3 py-1 rounded-full">
                ↔️ Geser untuk melihat ({{ individualItemsOnly.length }} item)
              </span>
            </div>
            <div class="relative">
              <div 
                id="individual-slider" 
                class="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-6"
                style="scrollbar-width: none; -ms-overflow-style: none;"
              >
                <div 
                  v-for="item in individualItemsOnly" 
                  :key="'i-' + item.id" 
                  class="w-[290px] sm:w-[340px] md:w-[380px] shrink-0 snap-start group relative"
                >
                  <!-- Folder Album Stack Effect (renders if item has multiple images) -->
                  <template v-if="item.url && item.url.includes('|')">
                     <div class="absolute inset-0 bg-slate-200/80 rounded-2xl transform translate-x-2.5 translate-y-2.5 transition-transform duration-500 shadow-sm border border-slate-300/30"></div>
                     <div class="absolute inset-0 bg-slate-100 rounded-2xl transform translate-x-1.5 translate-y-1.5 transition-transform duration-500 shadow border border-slate-200/40"></div>
                  </template>

                  <!-- Main Card Container -->
                  <div class="relative overflow-hidden bg-slate-50 rounded-2xl aspect-[3/2] shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 border border-slate-100 z-10">
                    
                    <!-- Loader -->
                    <div class="absolute inset-0 flex items-center justify-center bg-slate-100 z-0">
                       <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
                    </div>

                    <!-- Media Logic -->
                    <template v-if="item.tipe === 'VIDEO'">
                      <!-- Video Player -->
                      <video 
                        :key="item.url"
                        :src="getStreamUrl(item.url)" 
                        class="relative z-20 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700"
                        muted 
                        loop 
                        autoplay
                        playsinline
                        @playing="onVideoLoad"
                        @loadeddata="onVideoLoad"
                        @error="handleVideoError"
                      ></video>
                      <!-- Video Thumbnail Fallback -->
                      <img 
                        :src="getPreviewUrl(item.url)" 
                        class="absolute inset-0 z-10 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        @load="onImageLoad"
                        @error="handleImageError"
                      />
                    </template>
                    <img 
                      v-else
                      :src="getPreviewUrl(item.url && item.url.includes('|') ? item.url.split('|')[0] : item.url)" 
                      class="relative z-10 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                      @error="handleImageError"
                      @load="onImageLoad"
                    />
                    
                    <!-- MAIN STATUS LABELS (FORCED VISIBILITY) -->
                    <div class="absolute top-4 left-4 z-50 flex flex-col gap-2">
                       <div v-if="item.is_expired || item.status === 'EXPIRED'" class="px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl border-2 border-red-500/50">
                          KADALUARSA
                       </div>
                       <div v-else-if="item.status === 'DISETUJUI'" class="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl border-2 border-blue-500/50 italic">
                          DISETUJUI (BELUM TAYANG)
                       </div>
                       <div v-else-if="item.sisa_hari === 0" class="px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl border-2 border-red-400/50 animate-pulse">
                          HARI TERAKHIR
                       </div>
                       <div v-else-if="item.sisa_hari !== 999 && item.sisa_hari !== 99999" class="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl border-2 border-emerald-500/50 italic animate-pulse">
                          TAYANG (SISA {{ item.sisa_hari }} HARI)
                       </div>
                       <div v-else class="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl border-2 border-emerald-500/50 italic">
                          TAYANG
                       </div>

                       <!-- Album indicator badge -->
                       <div v-if="item.url && item.url.includes('|')" class="px-3 py-1.5 bg-slate-950/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 7v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                          📁 {{ item.url.split('|').length }} FOTO
                       </div>
                    </div>

                    <!-- Content Overlay -->
                    <div class="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent p-6 flex flex-col justify-end transition-transform duration-500">
                      <div class="space-y-3">
                        <div class="flex justify-between items-end">
                          <div class="space-y-1">
                            <div class="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">{{ item.url && item.url.includes('|') ? 'ALBUM' : item.tipe }}</div>
                            <h3 class="text-xl font-black text-white leading-tight uppercase tracking-tighter line-clamp-2">{{ item.judul }}</h3>
                          </div>
                          <button @click.stop="downloadFile(item.url)" class="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-700 hover:border-blue-600 transition-all shadow-xl group/btn"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover/btn:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></button>
                        </div>
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 pt-3">
                           <span>Mulai Tayang: {{ formatDate(item.tanggal_mulai || item.tanggal) }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button @click="openAlbum(item)" class="absolute inset-0 z-30 w-full h-full text-left bg-transparent border-0 cursor-pointer"></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Group Items Grid -->
          <div v-if="groupCardsOnly.length > 0" class="space-y-8 pt-8 border-t border-slate-100">
            <div class="space-y-1">
              <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Koleksi Album & Grup</h3>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Materi penayangan yang dikelompokkan dalam album khusus</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div 
                v-for="item in groupCardsOnly" 
                :key="'g-' + item.id" 
                :class="item.items.length === 1 
                  ? 'col-span-1' 
                  : (item.items.length === 2 
                      ? 'col-span-1 md:col-span-2' 
                      : 'col-span-1 md:col-span-2 lg:col-span-3')"
                class="bg-slate-50/50 backdrop-blur-sm border-2 border-dashed border-slate-200/80 rounded-[32px] p-6 md:p-8 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-200 hover:bg-slate-50/70 transition-all duration-500 relative overflow-hidden"
              >
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
                         🗂️ {{ item.items.length }} Materi
                      </span>
                   </div>
                </div>

                <!-- Compact Sub-Grid of Cards -->
                <div :class="item.items.length === 1 
                  ? 'grid grid-cols-1 gap-6 pt-6' 
                  : (item.items.length === 2 
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6' 
                      : (item.items.length === 3
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6'
                          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6'))">
                  <div v-for="child in item.items" :key="child.id" class="group/card relative space-y-4">
                    <!-- Folder Album Stack Effect (renders if item has multiple images) -->
                    <template v-if="child.url && child.url.includes('|')">
                       <div class="absolute inset-0 bg-slate-200/80 rounded-xl transform translate-x-1.5 translate-y-1.5 transition-transform duration-500 shadow-sm border border-slate-300/30"></div>
                       <div class="absolute inset-0 bg-slate-100 rounded-xl transform translate-x-1 translate-y-1 transition-transform duration-500 shadow border border-slate-200/40"></div>
                    </template>

                    <!-- Main Card Container -->
                    <div class="relative overflow-hidden bg-slate-50 rounded-xl aspect-[3/2] shadow-md transition-transform duration-500 group-hover/card:-translate-y-1 border border-slate-100 z-10">
                      
                      <!-- Loader -->
                      <div class="absolute inset-0 flex items-center justify-center bg-slate-100 z-0">
                         <div class="w-6 h-6 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
                      </div>

                      <!-- Media Logic -->
                      <template v-if="child.tipe === 'VIDEO'">
                        <!-- Video Player -->
                        <video 
                          :key="child.url"
                          :src="getStreamUrl(child.url)" 
                          class="relative z-20 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-all duration-700"
                          muted 
                          loop 
                          autoplay
                          playsinline
                          @playing="onVideoLoad"
                          @loadeddata="onVideoLoad"
                          @error="handleVideoError"
                        ></video>
                        <!-- Video Thumbnail Fallback -->
                        <img 
                          :src="getPreviewUrl(child.url)" 
                          class="absolute inset-0 z-10 w-full h-full object-cover grayscale opacity-60 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700"
                          @load="onImageLoad"
                          @error="handleImageError"
                        />
                      </template>
                      <img 
                        v-else
                        :src="getPreviewUrl(child.url && child.url.includes('|') ? child.url.split('|')[0] : child.url)" 
                        class="relative z-10 w-full h-full object-cover grayscale opacity-60 group-hover/card:grayscale-0 group-hover/card:opacity-100 transition-all duration-700" 
                        @error="handleImageError"
                        @load="onImageLoad"
                      />
                      
                      <!-- STATUS LABELS -->
                      <div class="absolute top-3 left-3 z-50 flex flex-col gap-1.5">
                         <div v-if="child.is_expired || child.status === 'EXPIRED'" class="px-2 py-1 bg-red-600 text-white text-[7px] font-black uppercase tracking-widest rounded shadow">
                            KADALUARSA
                         </div>
                         <div v-else-if="child.status === 'DISETUJUI'" class="px-2 py-1 bg-blue-600 text-white text-[7px] font-black uppercase tracking-widest rounded shadow italic">
                            DISETUJUI
                         </div>
                         <div v-else-if="child.sisa_hari === 0" class="px-2 py-1 bg-red-500 text-white text-[7px] font-black uppercase tracking-widest rounded shadow animate-pulse">
                            HARI TERAKHIR
                         </div>
                         <div v-else-if="child.sisa_hari !== 999 && child.sisa_hari !== 99999" class="px-2 py-1 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-widest rounded shadow italic animate-pulse">
                            TAYANG (SISA {{ child.sisa_hari }} HARI)
                         </div>
                         <div v-else class="px-2 py-1 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-widest rounded shadow italic">
                            TAYANG
                         </div>
                      </div>

                      <!-- Content Overlay -->
                      <div class="absolute inset-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent p-4 flex flex-col justify-end">
                        <div class="space-y-2">
                          <div class="flex justify-between items-end">
                            <div class="space-y-0.5">
                              <div class="text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">{{ child.url && child.url.includes('|') ? 'ALBUM' : child.tipe }}</div>
                              <h3 class="text-xs font-black text-white leading-tight uppercase tracking-tight line-clamp-2">{{ child.judul }}</h3>
                            </div>
                            <button @click.stop="downloadFile(child.url)" class="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-blue-700 hover:border-blue-600 transition-all shadow-lg group/btn shrink-0 ml-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></button>
                          </div>
                          <div class="text-[8px] font-bold text-slate-400 uppercase tracking-widest border-t border-white/10 pt-2 flex justify-between">
                             <span>Mulai: {{ formatDate(child.tanggal_mulai || child.tanggal) }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button @click="openAlbum(child)" class="absolute inset-0 z-30 w-full h-full text-left bg-transparent border-0 cursor-pointer"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="text-center py-32 border border-dashed border-slate-200 rounded-[40px]">
           <p class="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Arsip Masih Kosong</p>
        </div>
      </div>
    </section>

    <!-- Lightbox Album Modal -->
    <teleport to="body">
      <transition name="page">
        <div v-if="activeAlbum" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
          <!-- Close Button -->
          <button @click="activeAlbum = null" class="absolute top-6 right-6 text-white/70 hover:text-white p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
  
          <div class="w-full max-w-5xl space-y-6 flex flex-col items-center">
             <!-- Header / Title -->
             <div class="text-center space-y-1">
                <span class="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Album Galeri</span>
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
    </teleport>

    <!-- Stats/Info -->
    <section class="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-20 border-t-2 border-slate-100">
       <div v-for="info in infoCards" :key="info.title" class="space-y-8 group">
          <div class="w-16 h-2 bg-blue-700 group-hover:w-full transition-all duration-500"></div>
          <h3 class="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">{{ info.title }}</h3>
          <p class="text-lg text-slate-500 font-bold leading-relaxed">{{ info.desc }}</p>
       </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getGallery, getGroups } from '../api'

const galleryItems = ref<any[]>([])
const groupsList = ref<any[]>([])
const loading = ref(true)
const currentMockupIndex = ref(0)
let slideshowTimeout: any = null

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

const activeGroups = computed(() => {
  return groupsList.value.filter(g => g.status === 'ACTIVE')
})

const getGroupLatestDate = (group: any) => {
  if (!group.item_ids || group.item_ids.length === 0) return 0
  let latest = 0
  group.item_ids.forEach((id: string) => {
    const item = galleryItems.value.find(g => g.id === id)
    if (item) {
      const dateVal = new Date(item.tanggal_mulai || item.tanggal).getTime()
      if (dateVal > latest) latest = dateVal
    }
  })
  return latest
}

const individualItemsOnly = computed(() => {
  const activeG = activeGroups.value
  const groupedIds = new Set(
    activeG.flatMap(g => (g.item_ids || []).map(String))
  )

  const individualItems = galleryItems.value.filter(item => !groupedIds.has(String(item.id)))

  return individualItems
    .map(item => ({ ...item, is_group: false }))
    .sort((a, b) => {
      const dateA = new Date(a.tanggal_mulai || a.tanggal).getTime()
      const dateB = new Date(b.tanggal_mulai || b.tanggal).getTime()
      return dateB - dateA
    })
})

const groupCardsOnly = computed(() => {
  const activeG = activeGroups.value
  const groupCards = activeG.map(group => {
    const childItems = (group.item_ids || []).map((id: string) => {
      return galleryItems.value.find(item => String(item.id) === String(id))
    }).filter(Boolean)
    return {
      ...group,
      is_group: true,
      items: childItems
    }
  }).filter(g => g.items.length > 0)

  return groupCards.sort((a, b) => {
    const dateA = getGroupLatestDate(a)
    const dateB = getGroupLatestDate(b)
    return dateB - dateA
  })
})



const activeGalleryItems = computed(() => {
  return galleryItems.value.filter(item => !item.is_expired && item.status !== 'EXPIRED' && item.url)
})

const mockupContent = computed(() => {
  const items = activeGalleryItems.value
  if (items.length > 0) {
     const idx = currentMockupIndex.value % items.length
     const item = items[idx]
     const isVideo = item.tipe === 'VIDEO'
     return {
        url: isVideo ? getStreamUrl(item.url) : getPreviewUrl(item.url),
        judul: item.judul,
        isVideo: isVideo,
        isDefault: false
     }
  }
  return {
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2070',
    judul: 'Info Layanan Publik',
    isVideo: false,
    isDefault: true
  }
})

const advanceSlideshow = () => {
  if (slideshowTimeout) clearTimeout(slideshowTimeout)
  if (activeGalleryItems.value.length <= 1) return

  const items = activeGalleryItems.value
  const nextIdx = (currentMockupIndex.value + 1) % items.length
  currentMockupIndex.value = nextIdx

  setupNextSlideshowTimer()
}

const setupNextSlideshowTimer = () => {
  if (slideshowTimeout) clearTimeout(slideshowTimeout)
  if (activeGalleryItems.value.length <= 1) return

  const items = activeGalleryItems.value
  const currentItem = items[currentMockupIndex.value % items.length]

  if (currentItem && currentItem.tipe === 'VIDEO') {
    // Safety fallback: 30s timeout for videos to avoid getting stuck if video fails to play/load
    slideshowTimeout = setTimeout(advanceSlideshow, 30000)
  } else {
    // Images stay for 5 seconds
    slideshowTimeout = setTimeout(advanceSlideshow, 5000)
  }
}

const startSlideshow = () => {
  setupNextSlideshowTimer()
}

const infoCards = [
  { title: 'Verifikasi Tepat', desc: 'Proses validasi konten yang terukur dan profesional oleh tim ahli kami.' },
  { title: 'Pantau Publikasi', desc: 'Sistem pelacakan real-time untuk menjamin kepastian penayangan materi Anda.' },
  { title: 'Sinergi Daerah', desc: 'Mendukung visualisasi program strategis pemerintah Kabupaten Sinjai.' }
]

const scrollGallery = (dir: number) => {
  const container = document.getElementById('individual-slider')
  if (container) {
    const cardWidth = container.firstElementChild ? container.firstElementChild.clientWidth : 380
    container.scrollBy({ left: dir * (cardWidth + 32), behavior: 'smooth' })
  }
}

const getStreamUrl = (url: string) => {
  if (!url) return ''
  if (url.includes('drive.google.com')) {
    let id = ''
    if (url.includes('id=')) id = url.split('id=')[1].split('&')[0]
    else if (url.includes('/d/')) id = url.split('/d/')[1].split('/')[0]
    return `https://drive.google.com/uc?id=${id}&export=download`
  }
  return url
}

const getIframeUrl = (url: string) => {
  if (!url) return ''
  if (url.includes('drive.google.com')) {
    let id = ''
    if (url.includes('id=')) id = url.split('id=')[1].split('&')[0]
    else if (url.includes('/d/')) id = url.split('/d/')[1].split('/')[0]
    if (id) return `https://drive.google.com/file/d/${id}/preview?autoplay=1`
  }
  return url
}

const getPreviewUrl = (url: string) => {
  if (!url) return ''
  let fileId = ''
  if (url.includes('id=')) fileId = url.split('id=')[1].split('&')[0]
  else if (url.includes('/d/')) fileId = url.split('/d/')[1].split('/')[0]
  if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  return url
}

const downloadFile = (url: string) => {
  if (!url) return
  const targetUrl = url.includes('|') ? url.split('|')[0] : url
  let downloadUrl = targetUrl
  if (targetUrl.includes('drive.google.com')) {
    let fileId = ''
    if (targetUrl.includes('id=')) fileId = targetUrl.split('id=')[1].split('&')[0]
    else if (targetUrl.includes('/d/')) fileId = targetUrl.split('/d/')[1].split('/')[0]
    if (fileId) downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
  }
  window.open(downloadUrl, '_blank')
}

const handleImageError = (e: any) => {
  e.target.style.opacity = '0'
  if (e.target.previousElementSibling) e.target.previousElementSibling.style.display = 'none'
}

const onImageLoad = (e: any) => {
  if (e.target.previousElementSibling) e.target.previousElementSibling.style.display = 'none'
}

const onVideoLoad = (e: any) => {
  if (e.target.previousElementSibling) e.target.previousElementSibling.style.display = 'none'
}

const handleVideoError = (e: any) => {
  e.target.style.opacity = '0'
  if (e.target.previousElementSibling) e.target.previousElementSibling.style.display = 'none'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

onMounted(async () => {
  try {
    const [galleryRes, groupsRes] = await Promise.all([getGallery(), getGroups()])
    if (galleryRes.success) {
      galleryItems.value = galleryRes.data
      startSlideshow()
    }
    if (groupsRes.success) {
      groupsList.value = groupsRes.data
    }
  } catch (error) { console.error('Error:', error) }
  finally { loading.value = false }
})

onUnmounted(() => {
  if (slideshowTimeout) clearTimeout(slideshowTimeout)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
