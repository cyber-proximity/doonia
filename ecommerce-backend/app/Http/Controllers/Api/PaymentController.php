<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Mail\OrderConfirmedMail;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    public function verify(string $reference): JsonResponse
    {
        $order = Order::with(['items.product', 'payment'])
            ->where('paystack_reference', $reference)
            ->firstOrFail();

        // Already verified
        if ($order->payment_status === 'paid') {
            return response()->json([
                'status' => 'success',
                'data'   => new OrderResource($order),
            ]);
        }

        // Verify with Paystack
        $psResponse = Http::withToken(config('services.paystack.secret_key'))
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if (! $psResponse->successful()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Could not verify payment. Please contact support.',
            ], 502);
        }

        $psData = $psResponse->json('data');

        if ($psData['status'] === 'success') {
            $this->confirmPayment($order, $psData);
        } elseif (in_array($psData['status'], ['failed', 'abandoned'])) {
            $order->update(['payment_status' => 'failed']);
            $order->payment?->update(['status' => 'failed', 'paystack_response' => $psData]);
        }

        $order->load(['items.product', 'payment']);

        return response()->json([
            'status' => 'success',
            'data'   => new OrderResource($order),
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        // Verify Paystack HMAC signature
        $signature = hash_hmac('sha512', $request->getContent(), config('services.paystack.secret_key'));

        if ($signature !== $request->header('X-Paystack-Signature')) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $event = $request->input('event');
        $data  = $request->input('data');

        if ($event === 'charge.success') {
            $order = Order::with(['items.product', 'payment'])
                ->where('paystack_reference', $data['reference'])
                ->first();

            if ($order && $order->payment_status !== 'paid') {
                $this->confirmPayment($order, $data);
            }
        }

        return response()->json(['status' => 'received']);
    }

    private function confirmPayment(Order $order, array $psData): void
    {
        $order->update([
            'payment_status' => 'paid',
            'order_status'   => 'processing',
        ]);

        $order->payment?->update([
            'status'             => 'success',
            'payment_method'     => $psData['channel'] ?? null,
            'paystack_response'  => $psData,
        ]);

        // Decrement stock on confirmed payment
        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->decrement('stock_quantity', $item->quantity);
            }
        }

        Mail::to($order->customer_email)->queue(new OrderConfirmedMail($order));

        Log::info("Payment confirmed for order {$order->order_number}");
    }
}
