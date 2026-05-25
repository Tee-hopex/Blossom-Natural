import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { CheckoutFormData, OrderConfirmation, ApiResponse, CartItem } from '@/types';

interface PlaceOrderPayload extends CheckoutFormData {
  items: { product: string; quantity: number }[];
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: async (payload: PlaceOrderPayload) => {
      const { data } = await api.post<ApiResponse<OrderConfirmation>>('/orders', payload);
      return data.data!;
    },
  });
}

export function buildOrderPayload(
  formData: CheckoutFormData,
  cartItems: CartItem[]
): PlaceOrderPayload {
  return {
    ...formData,
    items: cartItems.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    })),
  };
}
