export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface ProductImage {
  id: number;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stockQuantity: number;
  status: "active" | "inactive";
  featured: boolean;
  category: Category;
  images: ProductImage[];
  avgRating: number | null;
  reviewCount: number;
}

export interface Review {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  user: { id: number; name: string };
  createdAt: string;
}

export interface ReviewSummary {
  avgRating: number | null;
  total: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string | null;
  isDefault: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  region?: string;
}

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paystackReference: string | null;
  createdAt: string;
  items: OrderItem[];
  payment: { status: string; paymentMethod: string | null } | null;
}
