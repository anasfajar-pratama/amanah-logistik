<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Homepage;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    public function show(ImageService $imageService): JsonResponse
    {
        $homepage = Homepage::firstOrNew([]);
        return response()->json(array_merge($homepage->toArray(), [
            'hero_image_url' => $imageService->url($homepage->hero_image),
            'hero_slides_url' => collect($homepage->hero_slides ?? [])
                ->map(fn($path) => $imageService->url($path))
                ->filter()
                ->values()
                ->all(),
        ]));
    }

    public function update(Request $request, ImageService $imageService): JsonResponse
    {
        $data = $request->validate([
            'hero_badge'          => 'nullable|string|max:255',
            'hero_title'          => 'nullable|string|max:255',
            'hero_highlight'      => 'nullable|string|max:255',
            'hero_description'    => 'nullable|string',
            'hero_cta_primary'    => 'nullable|string|max:100',
            'hero_cta_secondary'  => 'nullable|string|max:100',
            'hero_image'          => 'nullable|image|max:5120',
            'hero_slides'         => 'nullable|array',
            'hero_slides.*'       => 'nullable|image|max:5120',
            'remove_hero_slides'  => 'nullable|array',
            'stat_years'          => 'nullable|integer',
            'stat_clients'        => 'nullable|integer',
            'stat_provinces'      => 'nullable|integer',
            'stat_ontime'         => 'nullable|integer',
            'services_title'      => 'nullable|string|max:255',
            'services_description'=> 'nullable|string',
        ]);

        $homepage = Homepage::firstOrNew([]);

        if ($request->hasFile('hero_image')) {
            $imageService->delete($homepage->hero_image);
            $data['hero_image'] = $imageService->upload($request->file('hero_image'), 'homepage', 1920);
        } else {
            unset($data['hero_image']);
        }

        // Build/merge hero slides
        $slides = $homepage->hero_slides ?? [];
        $removeKeys = $request->input('remove_hero_slides', []);
        if (!empty($removeKeys)) {
            foreach ($removeKeys as $key) {
                if (isset($slides[$key])) {
                    $imageService->delete($slides[$key]);
                    unset($slides[$key]);
                }
            }
            $slides = array_values($slides);
        }

        if ($request->hasFile('hero_slides')) {
            foreach ($request->file('hero_slides') as $file) {
                $slides[] = $imageService->upload($file, 'homepage', 1920);
            }
        }

        $data['hero_slides'] = $slides;

        $homepage->fill($data)->save();

        return response()->json(array_merge($homepage->toArray(), [
            'hero_image_url' => $imageService->url($homepage->hero_image),
            'hero_slides_url' => collect($homepage->hero_slides ?? [])
                ->map(fn($path) => $imageService->url($path))
                ->filter()
                ->values()
                ->all(),
        ]));
    }
}
