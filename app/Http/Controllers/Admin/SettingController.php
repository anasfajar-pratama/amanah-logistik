<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(ImageService $imageService): JsonResponse
    {
        $settings = Setting::orderBy('group')->orderBy('id')->get();

        $data = $settings->map(fn($s) => array_merge($s->toArray(), [
            'url' => $s->type === 'image' ? $imageService->url($s->value) : null,
        ]));

        return response()->json($data);
    }

    public function update(Request $request, ImageService $imageService): JsonResponse
    {
        $data = $request->validate(['settings' => 'required|array']);

        foreach ($data['settings'] as $key => $value) {
            if ($key !== 'favicon') {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        if ($request->hasFile('favicon')) {
            $request->validate(['favicon' => 'nullable|image|max:5120']);

            $old = Setting::get('favicon');
            if ($old) {
                $imageService->delete($old);
            }

            $path = $imageService->upload($request->file('favicon'), 'favicon', 512);
            Setting::set('favicon', $path);
        } elseif ($request->boolean('remove_favicon')) {
            $old = Setting::get('favicon');
            if ($old) {
                $imageService->delete($old);
            }
            Setting::set('favicon', null);
        }

        return response()->json([
            'message' => 'Pengaturan berhasil disimpan.',
            'favicon_url' => $imageService->url(Setting::get('favicon')),
        ]);
    }
}
