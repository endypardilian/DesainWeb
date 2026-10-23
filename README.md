# EnDesert
Nama: Endy Pardilian
NIM: 2511531017
Kelas: A

## Tema
Situs resep dessert dengan 20 resep, masing-masing lengkap dengan bahan dan langkah. Tiga andalannya: Burnt Cheesecake, Sando Buah, dan Choco Chip Cookies. Warna utama krem dan cokelat.

## Cara menjalankan
1. Buka folder ini di VS Code
2. klik kanan index.html
3. pilih Open with Live Server.

## Struktur
- index.html, resep.html, kontak.html, offline.html
- css/style.css
- js/main.js
- data.json
- manifest.json, sw.js
- images/ (hero dan ilustrasi 20 resep), icons/

## Fitur yang berhasil
- Tiga halaman dengan satu menu navigasi dan elemen semantik
- Tabel jadwal kelas dan form kontak
- Tata letak Flexbox dan Grid, media query, terbaca di lebar 360 px
- Menu buka-tutup di layar kecil dan tombol tema terang/gelap
- Validasi form dengan pesan error di dekat isian
- 20 resep diambil dari data.json memakai fetch, lengkap dengan gambar, pencarian, dan filter kategori
- Manifest, service worker dengan pre-cache, dan halaman offline.html

## Yang belum
- Form kontak belum terhubung ke server, pesan hanya ditampilkan di halaman
