<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(ImageService $imageService): JsonResponse
    {
        $services = Service::orderBy('sort_order')->get()->map(fn($s) => array_merge($s->toArray(), [
            'image_url' => $imageService->url($s->image),
        ]));
        return response()->json($services);
    }

    public function store(Request $request, ImageService $imageService): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'image'       => 'nullable|image|max:5120',
            'icon'        => 'nullable|string|max:50',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $imageService->upload($request->file('image'), 'services', 800);
        }

        $service = Service::create($data);

        return response()->json(array_merge($service->toArray(), [
            'image_url' => $imageService->url($service->image),
        ]), 201);
    }

    public function update(Request $request, Service $service, ImageService $imageService): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|max:5120',
            'icon'        => 'nullable|string|max:50',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $imageService->delete($service->image);
            $data['image'] = $imageService->upload($request->file('image'), 'services', 800);
        } else {
            unset($data['image']);
        }

        $service->update($data);

        return response()->json(array_merge($service->toArray(), [
            'image_url' => $imageService->url($service->image),
        ]));
    }

    public function destroy(Service $service, ImageService $imageService): JsonResponse
    {
        $imageService->delete($service->image);
        $service->delete();
        return response()->json(['message' => 'Layanan dihapus.']);
    }
}
