<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ImageService
{
    public function upload(UploadedFile $file, string $folder = 'images', int $maxWidth = 1920, int $quality = 80): string
    {
        $filename = Str::uuid() . '.webp';
        $path = $folder . '/' . $filename;

        $image = Image::read($file);

        if ($image->width() > $maxWidth) {
            $image->scaleDown(width: $maxWidth);
        }

        $encoded = $image->toWebp($quality);

        Storage::disk('public')->put($path, $encoded);

        return $path;
    }

    public function uploadFavicon(UploadedFile $file, int $size = 512, int $quality = 90): string
    {
        $filename = Str::uuid() . '.webp';
        $path = 'favicon/' . $filename;

        $image = Image::read($file)
            ->contain($size, $size, 'transparent', 'center');

        $encoded = $image->toWebp($quality);

        Storage::disk('public')->put($path, $encoded);

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    public function url(?string $path): ?string
    {
        if (!$path) return null;
        return '/storage/' . ltrim($path, '/');
    }
}
