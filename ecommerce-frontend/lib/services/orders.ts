import api from "@/lib/api";
import { Order, ShippingAddress } from "@/types";

type RawOrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image: string | null;
};

type RawOrder = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total: number;
  payment_status: Order["paymentStatus"];
  order_status: Order["orderStatus"];
  paystack_reference: string | null;
  created_at: string;
  items: RawOrderItem[];
  payment: { status: string; payment_method: string | null } | null;
};

function toOrder(raw: RawOrder): Order {
  return {
    id: raw.id,
    orderNumber: raw.order_number,
    customerName: raw.customer_name,
    customerEmail: raw.customer_email,
    customerPhone: raw.customer_phone,
    shippingAddress: raw.shipping_address,
    subtotal: raw.subtotal,
    shippingFee: raw.shipping_fee,
    discountAmount: raw.discount_amount,
    total: raw.total,
    paymentStatus: raw.payment_status,
    orderStatus: raw.order_status,
    paystackReference: raw.paystack_reference,
    createdAt: raw.created_at,
    items: (raw.items ?? []).map((i) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      productSku: i.product_sku,
      quantity: i.quantity,
      unitPrice: i.unit_price,
      totalPrice: i.total_price,
      productImage: i.product_image,
    })),
    payment: raw.payment
      ? { status: raw.payment.status, paymentMethod: raw.payment.payment_method }
      : null,
  };
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  items: { productId: number; quantity: number }[];
}

export interface CreateOrderResult {
  orderNumber: string;
  paymentUrl: string;
  reference: string;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResult> {
  const { data } = await api.post("/v1/orders", {
    customer_name: payload.customerName,
    customer_email: payload.customerEmail,
    customer_phone: payload.customerPhone,
    shipping_address: payload.shippingAddress,
    items: payload.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    })),
  });

  return {
    orderNumber: data.data.order_number,
    paymentUrl: data.data.payment_url,
    reference: data.data.reference,
  };
}

export async function verifyPayment(reference: string): Promise<Order> {
  const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api";
  const res = await fetch(`${BASE}/v1/payments/verify/${reference}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Verification failed");
  const { data } = await res.json();
  return toOrder(data as RawOrder);
}

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get("/v1/orders");
  return (data.data as RawOrder[]).map(toOrder);
}
