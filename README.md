# Fitara — Website Reseller Fashion

Landing page responsif dengan katalog produk, filter kategori, pencarian, keranjang belanja, perhitungan total, dan checkout ringkasan via WhatsApp. Frontend HTML/CSS/JavaScript, API katalog Python untuk Vercel Functions.

## Jalankan di komputer

1. Ekstrak ZIP.
2. Buka folder di VS Code.
3. Untuk tampilan dasar, jalankan `index.html` dengan ekstensi Live Server.
4. Untuk menguji API Python secara lokal, instal Vercel CLI dan jalankan `vercel dev` dari terminal pada folder proyek. API `/api/products` memerlukan runtime Vercel; bila tidak tersedia, katalog cadangan di `script.js` tetap menampilkan produk.

## Deploy melalui GitHub ke Vercel

1. Buat repository baru di GitHub, misalnya `fitara-reseller`.
2. Upload seluruh isi folder ini ke root repository (pastikan `index.html`, `script.js`, `style.css`, `vercel.json`, dan folder `api/` terlihat di root).
3. Buka https://vercel.com lalu login menggunakan GitHub.
4. Pilih **Add New → Project**, lalu impor repository `fitara-reseller`.
5. Framework Preset: **Other**. Biarkan Build Command dan Output Directory kosong/default; tidak perlu build command untuk file statis ini.
6. Klik **Deploy**. Setelah selesai, Vercel memberikan URL website.
7. Setiap push/commit baru ke branch yang terhubung akan memicu deployment baru.

## Personalisasi wajib

- **Nomor WhatsApp:** buka `script.js`, cari `const adminWhatsApp = "6281234567890";`, ganti dengan nomor admin toko. Gunakan kode negara, tanpa `+`, spasi, atau tanda hubung.
- **Produk:** edit array `PRODUCTS` pada `api/index.py` dan `FALLBACK_PRODUCTS` pada `script.js` agar katalog tetap sama saat API tidak tersedia. Setiap produk mempunyai `id`, `name`, `category`, `price`, `tag`, `rating`, `image`, dan `description`.
- **Foto:** ubah properti `image` ke URL gambar yang bisa diakses publik (HTTPS). Foto dari komputer lokal tidak otomatis tampil di website online; unggah foto ke folder `assets/` dalam repo lalu gunakan path seperti `assets/kaos.jpg` pada kedua daftar produk.
- **Brand:** cari kata `Fitara` di `index.html`, `api/index.py`, dan metadata.
- **Harga:** isi angka rupiah tanpa titik, contoh `89000`.

## Penerapan materi Python

| Materi | Implementasi |
|---|---|
| Algoritma dan pemrograman | Alur pilih produk → tambah ke tas → hitung total → checkout |
| Kondisi logika | Validasi endpoint dan produk, filter kategori, cek keranjang kosong |
| Flowchart | Lihat `FLOWCHART.md` untuk diagram alur |
| List dan array | `PRODUCTS`, `FALLBACK_PRODUCTS`, `state.cart` |
| Variabel, tipe data, operasi | `price` integer, nama string, quantity integer, total harga |
| Function | `loadProducts()`, `renderProducts()`, `addToCart()`, `renderCart()` dan function Python |
| Looping | `map()`, `filter()`, `reduce()`, `for` / list comprehension di Python |

## Batasan demo

- Keranjang disimpan di memori browser; bila halaman dimuat ulang, keranjang kembali kosong.
- Checkout membuka WhatsApp; belum ada pembayaran online, akun pengguna, database, atau sistem stok sungguhan.
- Form newsletter adalah demo front-end dan tidak mengirim email ke server.
- Harga, nama, dan gambar adalah data contoh. Pastikan hak penggunaan gambar dan data produk sebelum dipakai secara komersial.
