<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(CreateOrderRequest $request): JsonResponse
    {
        // --- 1. Validate products and calculate totals ---
        $cartLines = [];
        $subtotal  = 0.0;

        foreach ($request->items as $item) {
            $product = Product::where('id', $item['product_id'])
                ->where('status', 'active')
                ->first();

            if (! $product) {
                throw ValidationException::withMessages([
                    'items' => "A product in your cart is no longer available.",
                ]);
            }

            if ($product->stock_quantity < $item['quantity']) {
                throw ValidationException::withMessages([
                    'items' => "Only {$product->stock_quantity} unit(s) of \"{$product->name}\" available.",
                ]);
            }

            $lineTotal = (float) $product->price * (int) $item['quantity'];
            $subtotal += $lineTotal;

            $cartLines[] = [
                'product'    => $product,
                'quantity'   => (int) $item['quantity'],
                'unit_price' => (float) $product->price,
                'total_price'=> $lineTotal,
            ];
        }

        $shippingFee     = 0.0;
        $total           = $subtotal + $shippingFee;
        $orderNumber     = 'DOO-' . strtoupper(Str::random(8));
        $paystackRef     = $orderNumber . '-' . time();

        // Resolve payment currency (GHS default; NGN or USD for international)
        $paymentCurrency = strtoupper($request->input('payment_currency', 'GHS'));
        if (! in_array($paymentCurrency, ['GHS', 'NGN', 'USD'])) {
            $paymentCurrency = 'GHS';
        }

        $paymentTotal = match ($paymentCurrency) {
            'NGN'   => $total * (float) (Setting::get('ghs_to_ngn') ?? 15.38),
            'USD'   => $total * (float) (Setting::get('ghs_to_usd') ?? 0.063),
            default => $total,
        };

        // --- 2. Persist order in a DB transaction ---
        $order = DB::transaction(function () use ($request, $cartLines, $subtotal, $shippingFee, $total, $orderNumber, $paystackRef, $paymentCurrency) {
            $order = Order::create([
                'order_number'      => $orderNumber,
                'user_id'           => auth()->id(),
                'customer_name'     => $request->customer_name,
                'customer_email'    => $request->customer_email,
                'customer_phone'    => $request->customer_phone,
                'shipping_address'  => $request->shipping_address,
                'subtotal'          => $subtotal,
                'shipping_fee'      => $shippingFee,
                'discount_amount'   => 0,
                'tax_amount'        => 0,
                'total'             => $total,
                'payment_status'    => 'pending',
                'order_status'      => 'pending',
                'paystack_reference'=> $paystackRef,
            ]);

            foreach ($cartLines as $line) {
                $order->items()->create([
                    'product_id'   => $line['product']->id,
                    'product_name' => $line['product']->name,
                    'product_sku'  => $line['product']->sku,
                    'quantity'     => $line['quantity'],
                    'unit_price'   => $line['unit_price'],
                    'total_price'  => $line['total_price'],
                ]);
            }

            Payment::create([
                'order_id'           => $order->id,
                'paystack_reference' => $paystackRef,
                'amount'             => $total,
                'currency'           => $paymentCurrency,
                'status'             => 'pending',
            ]);

            return $order;
        });

        // --- 3. Initialize Paystack payment ---
        $callbackUrl = rtrim(config('app.frontend_url', 'http://localhost:3001'), '/') . '/checkout/success?reference=' . $paystackRef;

        $psResponse = Http::withToken(config('services.paystack.secret_key'))
            ->post('https://api.paystack.co/transaction/initialize', [
                'email'        => $order->customer_email,
                'amount'       => (int) round($paymentTotal * 100), // smallest unit
                'reference'    => $paystackRef,
                'callback_url' => $callbackUrl,
                'currency'     => $paymentCurrency,
                'metadata'     => [
                    'order_number'  => $orderNumber,
                    'custom_fields' => [[
                        'display_name'  => 'Order Number',
                        'variable_name' => 'order_number',
                        'value'         => $orderNumber,
                    ]],
                ],
            ]);

        if (! $psResponse->successful()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Payment initialization failed. Please try again.',
            ], 502);
        }

        $paymentUrl = $psResponse->json('data.authorization_url');

        return response()->json([
            'status'  => 'success',
            'message' => 'Order created.',
            'data'    => [
                'order_number' => $orderNumber,
                'payment_url'  => $paymentUrl,
                'reference'    => $paystackRef,
            ],
        ], 201);
    }

    public function index(): JsonResponse
    {
        $orders = Order::with(['items', 'payment'])
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => 'success',
            'data'   => OrderResource::collection($orders),
            'meta'   => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::with(['items.product', 'payment'])
            ->where('order_number', $orderNumber)
            ->where(function ($q) {
                $q->where('user_id', auth()->id())
                  ->orWhereNull('user_id'); // guest orders found by reference only
            })
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data'   => new OrderResource($order),
        ]);
    }
}
