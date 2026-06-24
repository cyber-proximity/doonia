<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $addresses = $request->user()->addresses()->orderByDesc('is_default')->get();

        return response()->json([
            'status' => 'success',
            'data'   => $addresses->map(fn ($a) => $this->transform($a)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'label'       => ['nullable', 'string', 'max:50'],
            'street'      => ['required', 'string', 'max:200'],
            'city'        => ['required', 'string', 'max:100'],
            'state'       => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'is_default'  => ['boolean'],
        ]);

        if (! empty($data['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }

        $address = $request->user()->addresses()->create(array_merge(
            $data,
            ['country' => 'Ghana', 'label' => $data['label'] ?? 'Home']
        ));

        return response()->json([
            'status' => 'success',
            'data'   => $this->transform($address),
        ], 201);
    }

    public function update(Request $request, Address $address): JsonResponse
    {
        abort_if($address->user_id !== $request->user()->id, 403);

        $data = $request->validate([
            'label'       => ['nullable', 'string', 'max:50'],
            'street'      => ['required', 'string', 'max:200'],
            'city'        => ['required', 'string', 'max:100'],
            'state'       => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'is_default'  => ['boolean'],
        ]);

        if (! empty($data['is_default'])) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($data);

        return response()->json([
            'status' => 'success',
            'data'   => $this->transform($address->fresh()),
        ]);
    }

    public function destroy(Request $request, Address $address): JsonResponse
    {
        abort_if($address->user_id !== $request->user()->id, 403);
        $address->delete();

        return response()->json(['status' => 'success', 'message' => 'Address deleted.']);
    }

    private function transform(Address $a): array
    {
        return [
            'id'          => $a->id,
            'label'       => $a->label,
            'street'      => $a->street,
            'city'        => $a->city,
            'state'       => $a->state,
            'country'     => $a->country,
            'postal_code' => $a->postal_code,
            'is_default'  => $a->is_default,
        ];
    }
}
