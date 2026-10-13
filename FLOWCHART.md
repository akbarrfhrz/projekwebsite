# Flowchart logika website reseller

```mermaid
flowchart TD
    A([Mulai]) --> B[Tampilkan landing page]
    B --> C[Ambil katalog dari API Python]
    C --> D{API tersedia?}
    D -- Ya --> E[Gunakan data produk API]
    D -- Tidak --> F[Gunakan katalog cadangan]
    E --> G[Tampilkan produk]
    F --> G
    G --> H{Aksi pengguna}
    H -- Filter / cari --> I[Perbarui produk yang terlihat]
    I --> G
    H -- Tambah produk --> J{Produk valid?}
    J -- Tidak --> K[Tampilkan pesan]
    J -- Ya --> L[Perbarui list keranjang]
    L --> M[Hitung jumlah dan total]
    M --> N[Tampilkan tas belanja]
    H -- Checkout --> O{Keranjang kosong?}
    O -- Ya --> K
    O -- Tidak --> P[Buat ringkasan pesanan]
    P --> Q[Buka WhatsApp untuk konfirmasi]
    Q --> R([Selesai])
```

## Algoritma checkout

1. Mulai.
2. Periksa apakah list keranjang memiliki item.
3. Jika kosong, tampilkan pesan dan hentikan proses.
4. Jika ada item, lakukan looping untuk membentuk ringkasan setiap produk.
5. Hitung total = jumlah harga tiap produk dikali kuantitasnya.
6. Susun pesan pesanan dan buka WhatsApp.
7. Selesai.
