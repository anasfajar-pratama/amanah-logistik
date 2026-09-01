<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutUs;
use App\Models\Advantage;
use App\Models\ContactInfo;
use App\Models\ContactSubmission;
use App\Models\Homepage;
use App\Models\Gallery;
use App\Models\Service;
use App\Models\Setting;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PublicController extends Controller
{
    public function siteData(ImageService $imageService): JsonResponse
    {
        $homepage = Homepage::first();
        $services = Service::where('is_active', true)->orderBy('sort_order')->get();
        $about = AboutUs::first();
        $advantages = Advantage::where('is_active', true)->orderBy('sort_order')->get();
        $galleries = Gallery::where('is_active', true)->orderBy('sort_order')->get();
        $contact = ContactInfo::first();

        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'settings' => array_merge($settings->toArray(), [
                'favicon_url' => $imageService->url($settings->get('favicon')),
            ]),
            'homepage' => $homepage ? array_merge($homepage->toArray(), [
                'hero_image_url' => $imageService->url($homepage->hero_image),
            ]) : null,
            'services' => $services->map(fn($s) => array_merge($s->toArray(), [
                'image_url' => $imageService->url($s->image),
            ])),
            'about' => $about ? array_merge($about->toArray(), [
                'image_url' => $imageService->url($about->image),
            ]) : null,
            'advantages' => $advantages,
            'galleries' => $galleries->map(fn($g) => array_merge($g->toArray(), [
                'file_url' => $g->type === 'photo' ? $imageService->url($g->file) : null,
            ])),
            'contact' => $contact,
        ]);
    }

    public function galleries(ImageService $imageService): JsonResponse
    {
        $items = Gallery::where('is_active', true)->orderBy('sort_order')->get()->map(fn($g) => array_merge($g->toArray(), [
            'file_url' => $g->type === 'photo' ? $imageService->url($g->file) : null,
        ]));
        return response()->json($items);
    }

    public function submitContact(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:50',
            'email'   => 'nullable|email|max:255',
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        ContactSubmission::create($validator->validated());

        return response()->json(['message' => 'Pesan berhasil dikirim.']);
    }
}
