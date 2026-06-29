# LAPORAN DETIL PROGRES & ATURAN PENGEMBANGAN SISTEM
**Portal Videotron Sinjai**

Dokumen ini adalah rekaman lengkap mengenai seluruh fitur, penyelarasan algoritma, perbaikan bug, dan spesifikasi arsitektur yang telah diterapkan pada sistem. Dokumen ini wajib dibaca sebelum melanjutkan pengerjaan proyek untuk mencegah terjadinya regresi atau kerusakan sistem.

---

## 1. Aturan Ketat & Batasan Sistem (Wajib Dipatuhi)

*   **Perintah Artisan yang DILARANG**:
    *   `php artisan optimize:clear`
    *   `php artisan optimize`
    *   `php artisan view:clear`
    *   *Catatan*: Menjalankan perintah-perintah di atas dapat merusak konfigurasi caching pada server lokal dan dilarang keras oleh pengguna.
*   **Bahasa Respon**: Seluruh penjelasan dan komunikasi dengan pengguna wajib menggunakan **Bahasa Indonesia**.
*   **Perbandingan Kode**: Setiap kali melakukan perubahan berkas, tampilkan kode lama (*Before*) dan kode baru (*After*) secara terperinci.
*   **Batas Payload File**: Maksimal **50MB** untuk semua berkas media.
*   **Sinkronisasi Git Otomatis**: Setiap kali agen menyelesaikan perubahan berkas atau memperbaiki bug, agen wajib menjalankan `git add .`, `git commit -m "[Deskripsi Perubahan]"` dan `git push` untuk menyelaraskan perubahan ke repositori Git jarak jauh (*remote*) secara langsung.
*   **Metode Upload**: Harus menggunakan **Three-Phase Async Process (Chunking)**:
    1.  *Phase 1*: Pemecahan berkas menjadi potongan 70KB (aman untuk `CacheService` GAS) di sisi client.
    2.  *Phase 2*: Pengunggahan berurutan dan perakitan di Google Apps Script menggunakan Array byte standar (bukan `Uint8Array` atau `.buffer`).
    3.  *Phase 3*: Penyimpanan URL Drive permanen hasil rakitan ke spreadsheet.

---

## 2. Arsitektur & Logika Fitur yang Diimplementasikan

### A. Transisi Otomatis & Manajemen Status (Tayang, Sesuai Jadwal, Expired)
*   **Masalah Sebelumnya**: Status `DISETUJUI` (Belum Tayang) sering kali tidak berubah menjadi `TAYANG` secara otomatis pada hari H karena kegagalan parsing format tanggal cell di Google Apps Script (menyebabkan eksekusi terhenti secara senyap di blok `try-catch`).
*   **Solusi Penerapan**:
    *   Dibuat fungsi helper `safeParseDate(val)` yang mendeteksi jenis masukan (objek `Date` asli, string `YYYY-MM-DD`, atau string lokal `DD/MM/YYYY` / `DD-MM-YYYY`).
    *   Penyelarasan zona waktu dilakukan secara dinamis menggunakan zona waktu Spreadsheet aktif (`SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone()`).
    *   Tanggal hari ini dan tanggal mulai dikonversi ke format string `"yyyy/MM/dd"` yang seragam kemudian dibuat menjadi objek `Date` berwaktu tengah malam (midnight) di zona waktu yang sama sebelum dibandingkan menggunakan `.getTime()`.
    *   Jika status = `DISETUJUI` dan `today >= start`, status diubah otomatis di sheet database menjadi `TAYANG`.
*   **Penanganan Status EXPIRED (Kedaluwarsa)**:
    *   Jika status `TAYANG` dan sisa hari tayang (dihitung dari tanggal mulai + durasi) $\le 0$, status berubah otomatis di database menjadi `EXPIRED`.
    *   Materi kedaluwarsa disembunyikan dari feed beranda publik 24 jam setelah masa aktifnya habis.
    *   Admin dapat menyetel status materi secara manual ke status `EXPIRED`. Kode backend disesuaikan agar item yang disetel `EXPIRED` secara manual langsung ditandai `isExpired = true` dan `sisaHari = 0` tanpa menunggu perhitungan durasi.

### B. Upload Bukti Penayangan (Inline di Baris Tabel)
*   **Tujuan**: Memudahkan admin mengunggah bukti dokumentasi tayang (foto/video saat materi tampil di videotron) langsung dari baris tabel data submissions tanpa membuka dialog kelola utama.
*   **Mekanisme**:
    *   Jika status materi sudah `TAYANG` namun kolom `url_dokumentasi` (kolom 17) kosong, sistem memunculkan indikator peringatan kedip merah bertuliskan **"Belum Selesai (Belum Upload Bukti!)"** dan tombol **"Upload Bukti"**.
    *   Mengklik tombol tersebut membuka file dialog. Pemilihan berkas langsung memicu fungsi `uploadProofInline($event, sub)`.
    *   Proses pengunggahan berjalan secara *chunked* (pecahan 70KB) dengan indikator persentase langsung pada baris data terkait (`rowProgress[sub.no_registrasi]`).
    *   Setelah perakitan file di Drive selesai, tautan hasil rakitan langsung dikirim ke backend lewat parameter `docUrlDirect` untuk disimpan ke spreadsheet tanpa memicu re-upload manual.
    *   Jika berkas bukti sudah ada, muncul keterangan sukses berwarna hijau **"Selesai (Bukti Terunggah)"** bersandingan dengan tombol **"Lihat Bukti"** dan opsi **"Ganti Bukti"**.

### C. Manual Multi-Photo Upload (Folder / Galeri)
*   **Tujuan**: Mengizinkan Admin mengunggah beberapa berkas foto sekaligus dalam satu kali pengisian formulir, yang nantinya ditampilkan di halaman depan beranda seperti galeri folder/album.
*   **Penerapan Form Upload Manual (`Gallery.vue`)**:
    *   Input berkas ditambahkan atribut `multiple`.
    *   Menambahkan input pendukung: `Nama Instansi / Usaha`, pilihan `Sub Kategori` dinamis (UMKM, Pemerintahan, Himbauan, dll. sesuai jenis OPD/Usaha Komersial), pilihan status publikasi (**Tayang Sekarang** vs **Sesuai Jadwal**), pemilih `Tanggal Mulai Tayang`, serta input `Durasi Penayangan`.
*   **Algoritma Upload Multi-File**:
    *   Ketika disubmit, `handleUpload` melakukan perulangan `for...of` untuk memproses unggahan chunked berkas satu demi satu.
    *   Label status diperbarui secara *real-time* ("Mengunggah file 1 dari 3...", "Mengunggah file 2 dari 3...").
    *   Masing-masing berkas dirakit di Drive dan tautan URL-nya dikumpulkan ke dalam array.
    *   Setelah semua file selesai diunggah, seluruh tautan digabungkan menggunakan pembatas pipa (`url1|url2|url3`) dan dikirim sebagai satu parameter `fileUrl` ke sheet pendaftaran (`submitPengajuan`). Hal ini membuat upload manual terintegrasi penuh dengan seluruh logika kalkulasi durasi, expired, dan transisi jadwal.
*   **Visualisasi Kartu Stack & Lightbox Slider**:
    *   Di halaman beranda (`Home.vue`) dan galeri admin (`Gallery.vue`), data dengan URL mengandung karakter pipa (`|`) dideteksi sebagai **ALBUM**.
    *   Tampilan card otomatis ditambahkan efek tumpukan kartu (*Card Stack Effect*) menggunakan elemen bayangan bertingkat absolute dan badge penunjuk jumlah foto (contoh: **"📁 3 FOTO"**).
    *   Materi album memicu pembukaan **Lightbox Modal Slider** saat diklik. Slider ini memiliki tombol navigasi panah kiri/kanan, indikator halaman ("Foto 1 dari 3"), dan tombol untuk mengunduh/membuka berkas asli yang sedang aktif.

### D. Optimasi Pendaftaran & Registrasi
*   **Satuan TAHUN**: Pendaftaran mendukung durasi tahunan (multiplier harga = 365 hari). Aturan ini diselaraskan di kalkulator frontend dan backend Apps Script.
*   **Pembatasan OPD**: Untuk jenis pendaftaran Internal Pemkab (`OPD`), durasi pendaftaran dipaksa maksimal 3 hari saja.

### E. Pengaturan Tray & Penggantian Grup di Admin Galeri (`/admin/gallery`)
*   **Tray Grup Baru**: Mengelompokkan item dalam kontainer berbentuk nampan (recessed tray) berwarna `bg-slate-50/50` dengan border putus-putus dan bayangan dalam agar secara visual berbeda dari kartu biasa. Card anak di dalam grup disetel lebih kecil (grid 4 kolom).
*   **Toast Notifikasi**: Menghapus `alert()` peramban yang mengharuskan aksi klik OK, diganti dengan toast notifikasi non-blocking (`showToast`) yang melayang secara modern di sudut kanan bawah.
*   **Manajemen Grup Langsung**:
    *   Setiap kartu memiliki tombol icon eject (keluar dari grup) untuk memisahkan item dari grupnya.
    *   Setiap kartu juga memiliki dropdown "Pindah" untuk memindahkan item langsung ke grup aktif lainnya tanpa eject manual terlebih dahulu.

### F. Dinamisasi Form Upload Manual & Opsi Grup
*   **Opsi Pemilih Grup**: Dropdown pemilih grup target (`target_group_id`) disembunyikan dari form jika tidak ada grup yang tersedia (`groups.length === 0`).
*   **Pilihan Durasi & Rentang Tanggal Tanpa Batas untuk Admin**:
    *   Admin sekarang dapat memilih durasi tahun, bulan, hari, atau *Selamanya* secara bebas untuk Internal Pemkab (OPD) saat upload manual di halaman admin.
    *   Pilihan rentang tanggal (pilih tanggal mulai dan tanggal akhir) juga diaktifkan untuk Internal Pemkab (OPD) pada form upload manual admin.
    *   Validasi pendaftaran publik (`Registrasi.vue`) tetap terkunci paten maksimal 3 hari untuk OPD.

---

## 3. Detail Modifikasi Berkas Proyek

### 1. `google-apps-script.js`
*   **Fungsi `safeParseDate(val)`**: Helper baru yang ditambahkan di akhir berkas untuk memastikan parsing tanggal dari Google Sheets bebas dari *Invalid Date*.
*   **Fungsi `getAllSubmissionData()`**:
    *   Perbandingan tanggal hari ini vs tanggal mulai diselaraskan menggunakan string `"yyyy-MM-dd"` berdasarkan zona waktu Spreadsheet dan diuji lewat format tengah malam.
    *   Menambahkan penanganan status `EXPIRED` manual:
        ```javascript
        if (status === 'EXPIRED') {
          isExpired = true;
          sisaHari = 0;
          if (diffTime < -24 * 60 * 60 * 1000) {
            shouldHideFromPublic = true;
          }
        }
        ```
*   **Fungsi `handleUpdateStatus()`**:
    *   Ditambahkan penanganan penyimpanan tautan dokumentasi langsung:
        ```javascript
        if (payload.docUrlDirect) {
          sheet.getRange(target._rowIdx, 17).setValue(payload.docUrlDirect);
        }
        ```
*   **Fungsi `handlePengajuan()`**:
    *   Ditambahkan dukungan set status default dari payload (`payload.status || 'MENUNGGU_VERIFIKASI'`) dan pengisian default data administratif (`pic`, `hp`, `email`) jika diisi manual oleh Admin.

### 2. `src/pages/Home.vue`
*   **Grid loop**: Card arsip tayang ditambahkan elemen stack bayangan (`absolute translate-x-x`) jika file mengandung `|`.
*   **Badge**: Ditambahkan badge jumlah foto (`📁 X FOTO`) jika berkas bertipe album.
*   **Active Album Slider**: Ditambahkan modal transisi `activeAlbum` beserta fungsi navigasi slider di bagian bawah template.
*   **Mockup Slideshow**: `activeGalleryItems` diperbarui agar menyaring keluar materi yang berstatus `EXPIRED` (`item.status !== 'EXPIRED'`).
*   **Label Mulai**: Mengubah teks penayangan approved dari `"Mulai: [Date]"` menjadi `"Ditayangkan Pada: [Date]"`.

### 3. `src/pages/admin/Submissions.vue`
*   **Card Statistik**: Diperluas menjadi 6 kolom untuk menampung counter kategori **Kadaluarsa** (`status === 'EXPIRED'`).
*   **Tabel Data & Tata Letak**:
    *   Tabel dipecah secara rapi menjadi 5 kolom terstruktur: `ID & Tanggal`, `Instansi & Materi` (menampilkan judul `sub.judul` dan instansi), `Status & Jadwal` (menampilkan status, tanggal mulai, durasi, dan sisa hari), `Bukti Tayang`, dan `Aksi`.
    *   Teks peringatan berkedip merah **"Belum Selesai (Belum Upload Bukti!)"** dan tombol inline **"Upload Bukti"** kini muncul untuk semua pengajuan berstatus `DISETUJUI`, `TAYANG`, dan `EXPIRED` yang belum mengunggah bukti.
    *   Pesan sukses berwarna hijau **"Selesai (Bukti Terunggah)"** bersandingan dengan tautan **"Lihat Bukti"** dan **"Ganti Bukti"** muncul jika bukti tayang sudah ada.
    *   Tombol status **"Kelola"** di dalam modal tidak lagi mewajibkan unggah bukti saat menyimpan pembaruan status ke `TAYANG` (karena admin bisa mengunggahnya secara inline melalui baris tabel utama sewaktu-waktu).
    *   Aksi visual tombol melihat materi asli otomatis dipecah menjadi beberapa tombol `Materi 1`, `Materi 2`, dst. jika `sub.url` mengandung beberapa berkas foto sekaligus (pemisah karakter pipa `|`).
*   **Fungsi `uploadProofInline()`**: Mengunggah berkas bukti penayangan secara chunked dan memanggil `updateSubmissionStatus` dengan data `docUrlDirect`.

### 4. `src/pages/admin/Gallery.vue`
*   **State Form**: Diubah menampung array `fileObjects` dan `fileNameSummary` serta variabel reactive status, tanggal mulai, durasi, dan instansi.
*   **Metode `onFileChange`**: Mengambil file kolektif dan membatasi ukuran maksimal 50MB per file.
*   **Metode `handleUpload`**: Ditransisikan dari `uploadGallery` (sheet Gallery biasa) menjadi perulangan unggah chunked sekuensial dan menyimpannya langsung ke sheet submissions (`submitPengajuan`) agar terintegrasi penuh dengan penjadwalan.
*   **Card List & Modal**: Diselaraskan agar memiliki efek kartu bertumpuk dan modal Lightbox album yang sama persis seperti halaman beranda publik.
*   **Bug Fix**: Mendefinisikan variabel reactive `updating` yang sebelumnya tidak ada dan memicu crash saat admin menyimpan status.
*   **Tray & Manajemen Grup**: Menambahkan kontainer recessed tray dengan grid 4 kolom untuk grup, menambahkan tombol eject, dropdown pemindahan langsung ke grup lain, serta dropdown pemilihan grup pada kartu individu.
*   **Pilihan Durasi & Tanggal Akhir**: Menampilkan dropdown satuan durasi (`form.satuan`) secara universal untuk semua kategori konten, serta membuka pilihan metode rentang tanggal (`caraDurasi` dan `tanggalAkhir`) untuk jenis Internal Pemkab (OPD) pada upload manual admin.
*   **Toast Notification**: Mengintegrasikan element toast mengambang (`toastMessage`, `toastType`, `showToast`) dan menggantikan semua dialog `alert()` pada fungsi manipulasi grup.

### 5. `src/pages/Status.vue`
*   Ditambahkan warna kelas `bg-amber-50 text-amber-700 border-amber-200` pada computed `statusColorClass` jika berkas pemohon terdeteksi berstatus `EXPIRED`.

### 6. `google-apps-script.js` (Pembaruan Tambahan)
*   **Optimasi Simpan Dokumen**: Fungsi `handleUpdateStatus` disempurnakan agar dapat memproses dan mengunggah berkas `docBase64` untuk status apa pun (tidak hanya terbatas pada status `TAYANG` saja), sehingga admin dapat menyematkan bukti saat status disetel sebagai `EXPIRED` atau `DISETUJUI` lewat modal utama.

### 7. Pengamanan & Otentikasi Sesi (Security Fixes)
*   **`src/router/index.ts`**: Menambahkan global route guard `router.beforeEach` untuk memproteksi semua rute `/admin` sehingga pengguna tanpa otentikasi otomatis diarahkan kembali ke `/login`.
*   **`google-apps-script.js`**:
    *   Fungsi `handleLogin` diperbarui agar menghasilkan *session token* unik menggunakan `Utilities.getUuid()`, menyimpannya ke `CacheService.getScriptCache()` dengan masa berlaku 6 jam, lalu mengirimkannya ke client.
    *   Menambahkan fungsi helper `validateAdminToken(token)` untuk memvalidasi keberadaan token di dalam cache.
    *   Memperbarui fungsi `doPost` dan `doGet` untuk mengamankan seluruh endpoint administratif (seperti hapus data, ubah status, kelola galeri, dsb) agar mengembalikan status error/ditolak jika parameter `admin_token` tidak disertakan atau telah kedaluwarsa.
*   **`src/api/index.ts`**: Memperbarui wrapper fungsi `post` dan fungsi GET administratif (`getSubmissions`, `getSettings`, `getLogs`) agar menyertakan `admin_token` dari `localStorage` di setiap permintaan.
*   **`src/pages/Login.vue`**: Menyimpan data token ke `localStorage` dengan kunci `admin_token` saat login berhasil.
*   **`src/layouts/PublicLayout.vue`**: Menambahkan fungsi penghapusan `admin_token` dari `localStorage` saat admin menekan tombol logout.

### 8. Ekspansi Sub Kategori & Opsi Kustom (Lainnya)
*   **`src/pages/Registrasi.vue`**:
    *   Memperluas pilihan dropdown sub-kategori untuk jenis `OPD` (Pembangunan, Himbauan, Pemerintahan, Layanan Masyarakat, Agenda Pemkab, Peringatan Hari Besar, Prestasi Daerah, Pengumuman Resmi, Lainnya) dan jenis `BERBAYAR` (UMKM, Komersial, Event, F&B/Kuliner, Jasa/Layanan, Fashion/Lifestyle, Kesehatan/Kecantikan, Wisata/Rekreasi, Pendidikan/Les, Lowongan Kerja, Lainnya).
    *   Menambahkan input teks dinamis `kategori_kustom` yang muncul secara kondisional saat opsi "Lainnya" dipilih.
    *   Menyesuaikan fungsi submit `proceedWithSubmit` agar memvalidasi serta mengirimkan nilai input kustom tersebut ke API.
*   **`src/pages/admin/Gallery.vue`**:
    *   Menerapkan pembaruan dropdown sub-kategori dan kolom input kustom kondisional yang sama persis dengan formulir registrasi klien untuk upload manual admin.
    *   Menyesuaikan fungsi `handleUpload` untuk memvalidasi dan mengirimkan data kategori kustom saat admin mempublikasikan materi secara manual.

### 9. Optimalisasi Pemutar Video Mockup Videotron di Beranda (`src/pages/Home.vue`)
*   **Pembalikan ke Mode Iframe**: Setelah pengujian dengan elemen `<video>` native terbentur oleh batasan kuota unduhan (*download quota limit*) Google Drive yang memicu *infinite loading* (layar hitam) pada browser, sistem dikembalikan ke penggunaan pemutar berbasis `iframe` (`getIframeUrl` yang menghasilkan `/preview`).
*   **Parameter default mute & autoplay**: Menyematkan parameter `autoplay=1&mute=1&muted=1&volume=0` ke URL preview Drive guna memberi instruksi bisu (muted) default pada player internal.
*   **HUD Kontrol Terpadu**: Mempertahankan panel HUD kontrol interaktif melayang yang mendukung play/pause transisi, penyesuaian rasio aspek display (fit vs cover scale), dan navigasi slide secara manual.
*   **Pembersihan TypeScript**: Menghapus variabel dan watcher tak terpakai (`mockupVideoRef`, `mockupVideoLoaded`, watcher URL) untuk memenuhi linting `noUnusedLocals` compiler Vue-TSC.

### 10. Fitur Pengeditan Durasi & Rentang Tanggal Tayang Khusus Konten Galeri Admin (`src/pages/admin/Gallery.vue`)
*   **Pembedaan Jelas Tombol Aksi**:
    *   **"Urutkan / Kelola Grup"**: Tombol putih khusus pada kartu grup untuk mengatur urutan dan isi anggota koleksi grup.
    *   **"✏️ Edit"**: Tombol biru khusus yang tersedia pada setiap kartu materi media untuk membuka formulir pengeditan jadwal dan durasi tayang.
*   **Modal Form "Edit Jadwal & Durasi Tayang Konten"**:
    *   Pengeditan durasi dan rentang tanggal tayang difokuskan secara eksplisit pada halaman [Gallery.vue](file:///C:/laragon/www/videotron-sinjai-portal/src/pages/admin/Gallery.vue).
    *   Menyediakan pilihan metode pengeditan *Durasi Hari* (angka durasi + satuan waktu) dan *Rentang Tanggal Mulai - Akhir* dengan kalkulasi selisih hari otomatis.
*   **Kalkulasi Tanggal Akhir Inklusif (Perbaikan Bug Kadaluarsa)**:
    *   Memperbaiki kalkulasi selisih hari dari rentang tanggal (`tanggal_mulai` dan `tanggal_akhir`) menggunakan logika inklusif `(end - start) + 1`. Jika admin memilih tanggal 25 s/d 27, total durasi adalah 3 hari penuh, sehingga materi **tetap tayang pada tanggal 27** dan baru menjadi kedaluwarsa pada **tanggal 28 (H+1)**.
*   **Sinkronisasi Backend Apps Script (`google-apps-script.js`)**:
    *   Fungsi `handleUpdateStatus` menyimpan perubahan `durasi` (Kolom 13) dan `satuan` (Kolom 14) ke spreadsheet.
    *   Fungsi `handleGetGallery` mengembalikan data `durasi`, `satuan`, dan `catatan` pada setiap objek balasan.

---

## 4. Integrasi Git & Sinkronisasi Ulang (CLASP)
Untuk mempermudah sinkronisasi skrip Google Apps Script (GAS) dengan Git tanpa mengotori Spreadsheet dengan file frontend (Vue/Vite/Tailwind), proyek ini telah dikonfigurasi menggunakan **Google CLASP**.

### A. Berkas Konfigurasi:
*   `.clasp.json` (lokal): Menyambungkan direktori lokal ke skrip Apps Script tujuan (`1W0nYOB4tbbJH_OLbrAgzIbqpxplaRBoQGtZWbEUi2wTxcJZmjfKcAJvm`).
*   `.claspignore` (lokal): Berisi aturan untuk mengabaikan seluruh kode frontend Vue/Vite/Tailwind dan hanya mengizinkan berkas `google-apps-script.js` dan `appsscript.json` untuk diunggah.

### B. Cara Push Skrip (Backend):
1.  Pastikan Anda sudah login ke clasp:
    ```bash
    clasp login
    ```
2.  Lakukan push perubahan lokal `google-apps-script.js` ke skrip Apps Script:
    ```bash
    clasp push
    ```
3.  **Deploy Perubahan**: Anda bisa langsung menerapkan (deploy) versi terbaru tersebut ke deployment Web App aktif Anda tanpa perlu membuka browser dengan perintah:
    ```bash
    clasp deploy -i AKfycbz2xMjXWGVa-KUQX19P5FmJASFwfzWlV88YkhPaKvKwYkC5esf12EOZYuZtd9tLWZllpA -d "Keterangan deployment"
    ```
    Hal ini akan memperbarui deployment aktif ke versi terbaru (misalnya versi `@50`), sementara tautan `API_URL` Anda di `src/api/index.ts` akan tetap sama dan aktif sempurna.
