<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutUs;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AboutUsController extends Controller
{
    public function show(ImageService $imageService): JsonResponse
    {
        $about = AboutUs::firstOrNew([]);
        return response()->json(array_merge($about->toArray(), [
            'image_url' => $imageService->url($about->image),
        ]));
    }

    public function update(Request $request, ImageService $imageService): JsonResponse
    {
        $data = $request->validate([
            'title'         => 'nullable|string|max:255',
            'description_1' => 'nullable|string',
            'description_2' => 'nullable|string',
            'image'         => 'nullable|image|max:5120',
            'highlights'    => 'nullable|string', // JSON string from FormData
            'vision'        => 'nullable|string',
        ]);

        $about = AboutUs::firstOrNew([]);

        if ($request->hasFile('image')) {
            $imageService->delete($about->image);
            $data['image'] = $imageService->upload($request->file('image'), 'about', 1200);
        } else {
            unset($data['image']);
        }

        if (isset($data['highlights']) && is_string($data['highlights'])) {
            $data['highlights'] = json_decode($data['highlights'], true);
        }

        $about->fill($data)->save();

        return response()->json(array_merge($about->toArray(), [
            'image_url' => $imageService->url($about->image),
        ]));
    }
}
