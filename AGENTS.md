# PANDUAN ARSITEKTUR & ATURAN PENGEMBANGAN (KAVIO SMART LEARNING)

File ini adalah acuan mutlak pengembangan materi pembelajaran. Dilarang menyimpang dari aturan arsitektur, UI/UX, dan data engine berikut.

## 1. DILARANG KERAS (ANTI-AI SLOP & DESIGN RULES)
- DILARANG menggunakan outline stroke atau border pada kontainer materi (hindari class `border`, `border-slate-800` pada card/panel materi).
- DILARANG membuat nested box (kotak di dalam kotak).
- DILARANG menggunakan emoji ponsel dan icon bintang/sparkles buatan AI.
- DILARANG menampilkan perubahan kata kerja secara statis dengan panah teks horizontal di dalam sebuah kotak (misal: "look -> looked -> looked").
- DILARANG melakukan layout shifting secara instan/teleportasi (setiap pergeseran posisi wajib menggunakan transisi layout halus min. 700ms).

## 2. STANDAR LAYOUT 3-TIER (100dvh)
- **Top Header:** Fixed/Sticky, berisi tombol kembali minimalis (icon-only) dan counter: `Slide X dari Y • Langkah A dari B`.
- **Main Scroll Safe Area:** Wajib membungkus konten dengan:
  `min-h-full w-full flex flex-col items-center justify-center p-6 md:p-10 text-center`
  agar materi pendek otomatis berada tepat di tengah vertikal dan horizontal pandangan layar tanpa terpotong.
- **Sticky Footer:** Navigasi tombol panah kiri-kanan dan indikator titik progres.

## 3. SISTEM NAVIGASI & PERSISTENT HEADER
- **Granularitas Sub-Step:** Tombol Keyboard (Panah Kiri, Panah Kanan, Space) serta tombol navigasi footer WAJIB memajukan/memundurkan **1 sub-step (langkah mikro)** via array `flatSteps`, BUKAN melompati 1 slide penuh.
- **Persistent Header:** Judul utama slide (`slideTitle`) wajib berada di luar `AnimatePresence`. Header tidak boleh berkedip, re-render, atau bergeser saat navigasi sub-step berlangsung di slide yang sama.

## 4. WAJIB REUSE 3 TEMPLATE UTAMA DARI A1
Jangan pernah membuat komponen visual dari nol. Seluruh materi wajib dipetakan ke dalam 3 template baku yang sudah teruji di modul A1:

1. **Template 1: VerbMorphStep (Morfologi Kata & Huruf)**
   - Referensi kode: `src/components/materials/PresentTenseLesson.jsx`
   - Pola: Kategori kecil di atas -> Breadcrumb progress pill -> Kata raksasa di tengah (`text-6xl md:text-7xl`) dengan highlight huruf dinamis -> Teks penjelasan flat 1 baris di bawah.
2. **Template 2: StepSentenceConstruction (Konstruksi Kalimat)**
   - Referensi kode: `src/components/materials/HelperBeLesson.jsx`
   - Pola: Kalimat Indonesia di atas -> Kalimat Inggris besar (`text-4xl md:text-5xl`) yang bertransformasi per langkah (slot -> helper -> Verb-3 -> negasi -> tanya) -> Keterangan gramatikal di bawah.
3. **Template 3: InteractiveExampleList (Daftar Baris Bertingkat)**
   - Referensi kode: `src/components/materials/HelperDoLesson.jsx`
   - Pola: Baris flat terbuka dengan pembatas tipis -> Status pill bulat di sebelah kanan (titik abu-abu netral, `+` biru, `-` merah, `?` oranye) yang terbuka secara berurutan.

## 5. ALUR KERJA PEMBUATAN MATERI
1. Siapkan struktur materi murni sebagai konfigurasi objek JavaScript `slidesData` (terdiri atas `type: 'statement' | 'morph' | 'construction' | 'interactive-list'`).
2. Masukkan array data tersebut ke engine renderer tanpa menambahkan elemen dekoratif yang dilarang.
