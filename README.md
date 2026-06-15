# Amanah Trans Logistik — Website Laravel 12

Website company profile lengkap dengan admin panel untuk Amanah Trans Logistik.

## Requirement Server

- PHP >= 8.2 (ekstensi: BCMath, Ctype, cURL, DOM, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD)
- MySQL >= 5.7 / MariaDB >= 10.3
- Composer >= 2.x
- Node.js >= 18.x & npm >= 9.x (untuk build frontend, bisa dilakukan secara lokal)
- Web server: Apache/Nginx (Hostinger sudah include)

---

## Deploy ke Hostinger (Langkah demi Langkah)

### 1. Persiapan Database

Di panel Hostinger (hPanel):
1. Buka **Databases → MySQL Databases**
2. Buat database baru, catat: nama DB, username, password

### 2. Upload File

Upload semua isi folder ini ke server via **File Manager** atau **FTP**.

**Untuk shared hosting Hostinger**, arahkan Document Root ke folder `public/`. Caranya di hPanel:
- **Advanced → PHP Configuration** atau **Websites → Manage → File Manager**
- Upload ke `public_html/` lalu edit `.htaccess` di root untuk redirect ke `/public/`

Atau buat `.htaccess` di root folder:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

### 3. Konfigurasi .env

Copy `.env.example` menjadi `.env` dan isi nilai berikut:

```env
APP_NAME="Amanah Trans Logistik"
APP_ENV=production
APP_KEY=                              # diisi saat php artisan key:generate
APP_DEBUG=false
APP_URL=https://domainanda.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=username_db_anda
DB_PASSWORD=password_db_anda

SESSION_DRIVER=file                   # ganti ke 'file' jika tidak ada tabel sessions
```

### 4. Setup via SSH (Terminal Hostinger)

```bash
# Masuk ke folder project
cd ~/domains/domainanda.com/

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Generate app key
php artisan key:generate

# Buat symlink storage (agar gambar bisa diakses publik)
php artisan storage:link

# Jalankan migrasi database
php artisan migrate --force

# Seed data awal (termasuk akun admin & konten default)
php artisan db:seed --force

# Build frontend (jika ada Node.js di server)
npm install && npm run build

# Optimasi cache untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 5. Build Frontend Secara Lokal (Tanpa SSH)

Jika server tidak punya Node.js:
```bash
# Di komputer lokal Anda
npm install
npm run build
```
Lalu upload folder `public/build/` ke server.

---

## Akun Admin Default

Setelah `php artisan db:seed`, login dengan:

| Field | Value |
|-------|-------|
| **URL** | `https://domainanda.com/admin` |
| **Email** | `admin@amanahlogistik.id` |
| **Password** | `Admin@1234` |

> **PENTING:** Segera ganti password setelah login pertama!

--- admin@amanahlogistik.id / Admin@1234

## Menu Admin Panel

| Menu | Fungsi |
|------|--------|
| Pengaturan | Nama perusahaan, nomor WhatsApp, tagline, SEO |
| Homepage | Gambar hero, teks, CTA, statistik |
| Layanan | CRUD layanan + upload gambar (dikompres otomatis) |
| Tentang Kami | Profil, foto, bullet points, visi |
| Keunggulan | CRUD nilai & keunggulan perusahaan |
| Kontak | Nomor telepon, email, alamat, Google Maps embed |
| Pesan Masuk | Baca & balas pesan dari form kontak |

---

## Fitur Teknis

- **Kompresi Gambar Otomatis** — upload gambar dikonversi ke WebP & dikompres (Intervention Image v3)
- **WhatsApp Floating Button** — nomor & pesan awal diatur dari menu Pengaturan
- **Google Maps** — embed iframe, tidak butuh API key berbayar
- **Contact Form** — pesan tersimpan di DB, bisa dibalas langsung via WhatsApp dari admin
- **Sanctum Token Auth** — admin panel menggunakan Bearer token (aman untuk SPA)

---

## Troubleshooting

**Error 500:**
```bash
chmod -R 775 storage bootstrap/cache
tail -f storage/logs/laravel.log
```

**Gambar tidak tampil:**
```bash
php artisan storage:link
# Pastikan APP_URL di .env sesuai dengan domain Anda
```

**Admin tidak bisa login:**
- Coba ganti `SESSION_DRIVER=file` di `.env`
- Pastikan APP_KEY sudah terisi (jalankan `php artisan key:generate`)

**Error "Class not found":**
```bash
composer dump-autoload
php artisan clear-compiled
```
