// ── API Response shapes ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Domain Types ───────────────────────────────────────────────────────────
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  description: string;
  benefits: string[];
  ingredients: string[];
  suitableFor?: string[];
  freeFrom?: string[];
  warning?: string;
  faqs?: { question: string; answer: string }[];
  usage?: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  category: Category | string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  consultationRequest: boolean;
  createdAt: string;
}

// ── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ── Checkout Form ──────────────────────────────────────────────────────────
export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
  consultationRequest: boolean;
}

// ── Order Confirmation ────────────────────────────────────────────────────
export interface OrderConfirmation {
  orderNumber: string;
  total: number;
  deliveryFee: number;
  subtotal: number;
  status: string;
  paymentInstructions: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    amount: number;
    reference: string;
  };
}
