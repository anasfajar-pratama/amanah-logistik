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

        $homepage->fill($data)->save();

        return response()->json(array_merge($homepage->toArray(), [
            'hero_image_url' => $imageService->url($homepage->hero_image),
        ]));
    }
}
