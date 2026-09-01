<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <title>{{ $settings['meta_title'] ?? $settings['site_title'] ?? 'Amanah Trans Logistik' }}</title>
    <meta name="description" content="{{ $settings['meta_description'] ?? 'Mitra logistik terpercaya yang menghadirkan solusi pengiriman tepat waktu dan bernilai tambah di seluruh Indonesia.' }}" />
    <link rel="icon" href="{{ $settings['favicon'] ? '/storage/' . ltrim($settings['favicon'], '/') : '/favicon.ico' }}" type="image/x-icon" />
    <link rel="apple-touch-icon" href="{{ $settings['favicon'] ? '/storage/' . ltrim($settings['favicon'], '/') : '/favicon.ico' }}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    @viteReactRefresh
    @vite(['resources/js/landing/main.tsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
