<?php

namespace App\Observers;

use App\Mail\OrderDeliveredMail;
use App\Mail\OrderShippedMail;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;

class OrderObserver
{
    public function updating(Order $order): void
    {
        if (! $order->isDirty('order_status')) {
            return;
        }

        $order->loadMissing('items');

        match ($order->order_status) {
            'shipped'   => Mail::to($order->customer_email)->queue(new OrderShippedMail($order)),
            'delivered' => Mail::to($order->customer_email)->queue(new OrderDeliveredMail($order)),
            default     => null,
        };
    }
}
