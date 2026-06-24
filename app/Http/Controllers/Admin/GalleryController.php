<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(ImageService $imageService): JsonResponse
    {
        $items = Gallery::orderBy('sort_order')->get()->map(fn($g) => array_merge($g->toArray(), [
            'file_url' => $g->type === 'photo' ? $imageService->url($g->file) : null,
        ]));
        return response()->json($items);
    }

    public function store(Request $request, ImageService $imageService): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'required|in:photo,video',
            'file'        => 'nullable|required_if:type,photo|image|max:10240',
            'video_url'   => 'nullable|required_if:type,video|string|max:500',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            $data['file'] = $imageService->upload($request->file('file'), 'galleries', 1200);
        }

        $item = Gallery::create($data);

        return response()->json(array_merge($item->toArray(), [
            'file_url' => $imageService->url($item->file),
        ]), 201);
    }

    public function update(Request $request, Gallery $gallery, ImageService $imageService): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'type'        => 'nullable|in:photo,video',
            'file'        => 'nullable|image|max:10240',
            'video_url'   => 'nullable|string|max:500',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($request->hasFile('file')) {
            $imageService->delete($gallery->file);
            $data['file'] = $imageService->upload($request->file('file'), 'galleries', 1200);
        } else {
            unset($data['file']);
        }

        $gallery->update($data);

        return response()->json(array_merge($gallery->toArray(), [
            'file_url' => $imageService->url($gallery->file),
        ]));
    }

    public function destroy(Gallery $gallery, ImageService $imageService): JsonResponse
    {
        $imageService->delete($gallery->file);
        $gallery->delete();
        return response()->json(['message' => 'Galeri dihapus.']);
    }
}
