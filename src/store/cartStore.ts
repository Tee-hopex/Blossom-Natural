import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            const newQty = existing.quantity + quantity;
            if (newQty > product.stock) {
              toast.error(`Only ${product.stock} units available.`);
              return state;
            }
            toast.success(`Updated quantity in cart!`);
            return {
              items: state.items.map((i) =>
                i.product._id === product._id ? { ...i, quantity: newQty } : i
              ),
            };
          }
          if (quantity > product.stock) {
            toast.error(`Only ${product.stock} units available.`);
            return state;
          }
          toast.success(`${product.name} added to cart!`);
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product._id !== productId),
        }));
        toast.success('Item removed from cart.');
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product._id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.salePrice ?? i.product.price;
          return sum + price * i.quantity;
        }, 0),
    }),
    {
      name: 'blossom-cart', // localStorage key
    }
  )
);
