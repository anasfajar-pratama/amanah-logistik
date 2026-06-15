<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Setting::orderBy('group')->orderBy('id')->get();
        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate(['settings' => 'required|array']);

        foreach ($data['settings'] as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan.']);
    }
}
