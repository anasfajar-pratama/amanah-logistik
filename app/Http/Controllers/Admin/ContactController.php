<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInfo;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(ContactInfo::firstOrNew([]));
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'phone'          => 'nullable|string|max:50',
            'email'          => 'nullable|email|max:255',
            'address'        => 'nullable|string',
            'maps_embed_url' => 'nullable|string',
            'office_hours'   => 'nullable|string|max:255',
        ]);

        $contact = ContactInfo::firstOrNew([]);
        $contact->fill($data)->save();

        return response()->json($contact);
    }

    public function submissions(Request $request): JsonResponse
    {
        $submissions = ContactSubmission::orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));
        return response()->json($submissions);
    }

    public function markRead(ContactSubmission $submission): JsonResponse
    {
        $submission->update(['is_read' => true]);
        return response()->json($submission);
    }

    public function destroySubmission(ContactSubmission $submission): JsonResponse
    {
        $submission->delete();
        return response()->json(['message' => 'Pesan dihapus.']);
    }
}
