# ✈️ TripFlow App - Travel Planner & Management Platform

**TripFlow App** adalah platform web modern untuk merencanakan, mengelola, dan melacak seluruh perjalanan (*trip*) Anda secara terorganisir, intuitif, dan interaktif. Mulai dari menentukan destinasi, mengatur jadwal kegiatan harian (*itinerary*), melacak anggaran & pengeluaran (*budgeting*), hingga mengelola daftar barang bawaan (*packing list*).

---

## 🌟 Fitur-Fitur Utama

### 📊 1. Dashboard & Ringkasan Perjalanan
* **Ringkasan Statistik**: Menampilkan total perjalanan, perjalanan mendatang (*upcoming*), perjalanan aktif (*ongoing*), serta total alokasi anggaran.
* **Manajemen Trip**: Buat, lihat, dan hapus rencana perjalanan dengan dukungan nama trip, destinasi, rentang tanggal, anggaran, deskripsi, dan foto sampul.

### 🗺️ 2. Trip Planner Interaktif
* **Jadwal Harian (Itinerary Builder)**: Susun aktivitas harian dengan jam, kategori kegiatan (*Transport, Food, Sightseeing, Hotel, Activity*), perkiraan biaya, dan catatan.
* **Manajemen Keuangan & Budgeting**: Monitor pengeluaran aktual berdasarkan kategori (*Accommodation, Transport, Food, Shopping*, dll.) dan pantau sisa budget secara *real-time*.
* **Daftar Perlengkapan (Packing List)**: Centang barang bawaan yang dikelompokkan berdasarkan kategori (*Dokumen, Pakaian, Elektronik, Obat-obatan*, dll.).

### 🧭 3. Eksplorasi Destinasi (Explore)
* Rekomendasi destinasi populer dunia lengkap dengan perkiraan durasi dan estimasi biaya.
* **Fitur 1-Klik Rencanakan**: Buat draf rencana trip baru secara otomatis dari destinasi yang Anda eksplorasi.

---

## 💻 Teknologi yang Digunakan (Tech Stack)

### **Frontend**
* **React 19** + **TypeScript**: Antarmuka pengguna modern dengan *type-safety*.
* **Vite**: Build tool super cepat untuk pengembangan web frontend.
* **Glassmorphism Dark UI**: Desain futuristik dengan efek kaca transparan, tema *dark mode*, dan animasi mikro yang responsif.

### **Backend & Database**
* **Node.js** + **Express.js** (TypeScript): RESTful API server.
* **Prisma ORM** + **SQLite**: Manajemen skema database dan penyimpanan data lokal yang cepat dan persisten.

---

## 📁 Struktur Proyek

```text
trip/
├── public/                # Asset publik (favicon, ikon)
├── server/                # Backend Express API & Prisma SQLite
│   ├── prisma/            # Skema database & migrasi
│   │   ├── schema.prisma  # Skema model Trip, Itinerary, Expense, PackingItem
│   │   └── dev.db         # Database SQLite lokal
│   └── src/               # Express server entry point & endpoints
├── src/                   # Frontend React Application
│   ├── assets/            # Gambar & aset statis
│   ├── components/        # Komponen UI (Dashboard, TripPlanner, Explore, Navbar)
│   ├── types/             # Definisi tipe TypeScript
│   ├── App.tsx            # Main App Component & Routing logic
│   └── index.css          # Design system & Glassmorphism styles
├── package.json           # Konfigurasi dependensi & npm scripts
└── README.md              # Dokumentasi proyek
```

---

## 🚀 Panduan Memulai (Getting Started)

### Prasyarat
* **Node.js**: versi 18.x atau lebih baru
* **npm**: versi 9.x atau lebih baru

### Langkah Instalasi & Menjalankan Aplikasi

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/aripngoding/trip-p.git
   cd trip-p
   ```

2. **Install Dependensi Frontend & Backend**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Konfigurasi Environment Backend**:
   Buat file `.env` di dalam folder `server/`:
   ```bash
   cp server/.env.example server/.env
   ```

4. **Jalankan Migrasi Database Prisma**:
   ```bash
   npx prisma migrate dev --prefix server
   ```

5. **Jalankan Aplikasi (Fullstack Mode)**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di:
   * **Frontend**: [http://localhost:5173](http://localhost:5173)
   * **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📜 Perintah npm yang Tersedia

* `npm run dev`: Menjalankan server frontend (Vite) dan backend (Express) secara bersamaan.
* `npm run dev:frontend`: Menjalankan server frontend Vite saja.
* `npm run dev:backend`: Menjalankan server backend Express saja.
* `npm run build`: Membangun bundle produksi untuk backend dan frontend.
* `npm run lint`: Memeriksa kualitas kode menggunakan Oxlint.

---

## 📄 Lisensi
Hak Cipta © 2026 **TripFlow App** oleh [@aripngoding](https://github.com/aripngoding). Hak Cipta Dilindungi Undang-Undang.

