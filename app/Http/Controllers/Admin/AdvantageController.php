<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advantage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdvantageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Advantage::orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'icon'        => 'nullable|string|max:50',
            'color'       => 'nullable|string|max:30',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);
        return response()->json(Advantage::create($data), 201);
    }

    public function update(Request $request, Advantage $advantage): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'color'       => 'nullable|string|max:30',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);
        $advantage->update($data);
        return response()->json($advantage);
    }

    public function destroy(Advantage $advantage): JsonResponse
    {
        $advantage->delete();
        return response()->json(['message' => 'Keunggulan dihapus.']);
    }
}
