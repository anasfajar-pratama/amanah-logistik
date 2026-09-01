<?php

namespace Database\Seeders;

use App\Models\AboutUs;
use App\Models\Advantage;
use App\Models\ContactInfo;
use App\Models\Homepage;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::firstOrCreate(
            ['email' => 'admin@amanahlogistik.id'],
            [
                'name'     => 'Administrator',
                'password' => Hash::make('Admin@1234'),
            ]
        );

        // Settings
        $settings = [
            ['key' => 'company_name',   'value' => 'Amanah Trans Logistik', 'type' => 'text',     'group' => 'general', 'label' => 'Nama Perusahaan'],
            ['key' => 'tagline',        'value' => 'Mitra Logistik Terpercaya Anda', 'type' => 'text', 'group' => 'general', 'label' => 'Tagline'],
            ['key' => 'footer_desc',    'value' => 'Kami berkomitmen menghadirkan solusi logistik terbaik untuk kebutuhan bisnis Anda di seluruh Indonesia.', 'type' => 'textarea', 'group' => 'general', 'label' => 'Deskripsi Footer'],
            ['key' => 'whatsapp_number','value' => '6226773051340', 'type' => 'text', 'group' => 'social', 'label' => 'Nomor WhatsApp (format: 628xxx)'],
            ['key' => 'whatsapp_greeting','value' => 'Halo, saya ingin bertanya tentang layanan pengiriman Amanah Trans Logistik.', 'type' => 'textarea', 'group' => 'social', 'label' => 'Pesan Awal WhatsApp'],
            ['key' => 'meta_title',     'value' => 'Amanah Trans Logistik - Pengiriman Cepat, Aman, Tepat Waktu', 'type' => 'text', 'group' => 'seo', 'label' => 'Meta Title'],
            ['key' => 'meta_description','value' => 'Mitra logistik terpercaya yang menghadirkan solusi pengiriman tepat waktu dan bernilai tambah di seluruh Indonesia.', 'type' => 'textarea', 'group' => 'seo', 'label' => 'Meta Description'],
            ['key' => 'site_title',     'value' => 'Amanah Trans Logistik', 'type' => 'text', 'group' => 'branding', 'label' => 'Judul Website'],
            ['key' => 'favicon',        'value' => null, 'type' => 'image', 'group' => 'branding', 'label' => 'Favicon (ikon browser)'],
        ];

        foreach ($settings as $s) {
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        // Homepage
        Homepage::firstOrCreate(
            ['id' => 1],
            [
                'hero_badge'          => 'Cepat, Aman, dan Tepat Waktu',
                'hero_title'          => 'Mitra Logistik',
                'hero_highlight'      => 'Terpercaya',
                'hero_description'    => 'Kami adalah solusi pengiriman kargo darat dan udara ke seluruh Indonesia. Memastikan setiap barang Anda tiba dengan aman dan tepat waktu.',
                'hero_cta_primary'    => 'Kirim Barang Sekarang',
                'hero_cta_secondary'  => 'Pelajari Layanan Kami',
                'hero_image'          => 'homepage/hero.png',
                'stat_years'          => 10,
                'stat_clients'        => 500,
                'stat_provinces'      => 34,
                'stat_ontime'         => 99,
                'services_title'      => 'Layanan Utama Kami',
                'services_description'=> 'Kami menyediakan solusi pengiriman komprehensif untuk memastikan barang Anda sampai ke tujuan dengan aman dan efisien.',
            ]
        );

        // Services
        $services = [
            [
                'title'       => 'Pengiriman Darat',
                'description' => 'Armada truk modern yang siap mengirimkan kargo Anda melalui jalur darat dengan aman. Cocok untuk pengiriman antar kota dan pulau yang terhubung.',
                'icon'        => 'Truck',
                'sort_order'  => 1,
                'is_active'   => true,
                'image'       => 'services/truck.png',
            ],
            [
                'title'       => 'Pengiriman Udara',
                'description' => 'Layanan kargo udara cepat untuk pengiriman mendesak ke seluruh Indonesia. Prioritas kecepatan dengan tetap menjaga keamanan barang.',
                'icon'        => 'Plane',
                'sort_order'  => 2,
                'is_active'   => true,
                'image'       => 'services/plane.png',
            ],
            [
                'title'       => 'Pengiriman Nasional',
                'description' => 'Jangkauan ke 34 provinsi di seluruh Indonesia dengan tarif kompetitif. Solusi distribusi terpadu dari Sabang sampai Merauke.',
                'icon'        => 'Globe2',
                'sort_order'  => 3,
                'is_active'   => true,
                'image'       => null,
            ],
        ];

        foreach ($services as $s) {
            Service::firstOrCreate(['title' => $s['title']], $s);
        }

        // About Us
        AboutUs::firstOrCreate(
            ['id' => 1],
            [
                'title'         => 'Membangun Koneksi Melalui Logistik yang Handal',
                'description_1' => 'Didirikan oleh para profesional berpengalaman di bidang logistik, Amanah Trans Logistik hadir untuk menjawab tantangan distribusi di Indonesia. Kami melayani berbagai perusahaan BUMN dan swasta dengan dedikasi penuh.',
                'description_2' => 'Visi kami adalah menjadi partner logistik nomor satu di Indonesia yang memberikan solusi komprehensif, menghubungkan setiap titik nusantara dengan layanan yang amanah dan transparan.',
                'image'         => 'about/warehouse.png',
                'highlights'    => [
                    'Jaringan distribusi nasional yang luas',
                    'Tim profesional dan berpengalaman',
                    'Layanan pelanggan responsif 24/7',
                    'Sistem pelacakan pengiriman terintegrasi',
                ],
                'vision'        => 'Menjadi mitra logistik terpercaya yang menghadirkan solusi pengiriman tepat waktu dan bernilai tambah di seluruh Indonesia.',
            ]
        );

        // Advantages
        $advantages = [
            ['title' => 'Amanah',      'description' => 'Kami menjunjung tinggi nilai kepercayaan dalam setiap aspek layanan. Nama kami adalah janji kami kepada setiap pelanggan.',        'icon' => 'ShieldCheck', 'color' => 'orange', 'sort_order' => 1],
            ['title' => 'Cepat',       'description' => 'Pengiriman tepat waktu dengan armada modern dan rute distribusi yang telah dioptimalkan untuk efisiensi maksimal.',                 'icon' => 'Clock',       'color' => 'blue',   'sort_order' => 2],
            ['title' => 'Aman',        'description' => 'Setiap paket ditangani dengan standar keamanan tinggi. Kami memastikan setiap barang sampai dalam kondisi sempurna.',             'icon' => 'Award',       'color' => 'green',  'sort_order' => 3],
            ['title' => 'Terpercaya',  'description' => 'Lebih dari 500 klien dari BUMN dan swasta telah mempercayakan pengiriman bisnis mereka kepada Amanah Trans Logistik.',            'icon' => 'Star',        'color' => 'purple', 'sort_order' => 4],
        ];

        foreach ($advantages as $a) {
            Advantage::firstOrCreate(['title' => $a['title']], array_merge($a, ['is_active' => true]));
        }

        // Contact Info
        ContactInfo::firstOrCreate(
            ['id' => 1],
            [
                'phone'          => '+62 267 7305 134',
                'email'          => 'marketing@amanahlogistik.id',
                'address'        => 'Jl. Raya Purwakarta, Kabupaten Purwakarta, Jawa Barat, Indonesia',
                'maps_embed_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126747.69482041682!2d107.37494564335937!3d-6.556079999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68d7cbb7cc0239%3A0x5027a76e3559800!2sPurwakarta%2C%20Kabupaten%20Purwakarta%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
                'office_hours'   => 'Senin - Sabtu: 08.00 - 17.00 WIB',
            ]
        );
    }
}
