/**
 * Zustand stores for the next-store application.
 *
 * useAuthStore — manages current authenticated user
 * useCartStore — manages shopping cart state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, User } from "@/types";

// ─── Auth Store ──────────────────────────────────────────────────────────────

interface AuthState {
  currentUser: User | null;
  isHydrated: boolean;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  setHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),
      setCurrentUser: (user: User | null) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

// ─── Cart Store ───────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  total: number;
  addToCart: (item: CartItem | Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addToCart: (item) =>
        set((state) => {
          const cartItem: CartItem =
            "cartQuantity" in item
              ? item
              : {
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity: item.quantity ?? 1,
                  cartQuantity: item.quantity ?? 1,
                  image: item.image,
                  category: item.category,
                };

          const existing = state.items.find((i) => i.id === cartItem.id);

          const updatedItems = existing
            ? state.items.map((i) =>
                i.id === cartItem.id
                  ? {
                      ...i,
                      quantity: i.quantity + 1,
                      cartQuantity: i.cartQuantity + 1,
                    }
                  : i,
              )
            : [...state.items, { ...cartItem, quantity: 1, cartQuantity: 1 }];

          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            ),
          };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (i) => i.id.toString() !== productId,
          );
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            ),
          };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id.toString() === productId
              ? { ...i, quantity, cartQuantity: quantity }
              : i,
          );
          return {
            items: updatedItems,
            total: updatedItems.reduce(
              (sum, i) => sum + i.price * i.quantity,
              0,
            ),
          };
        }),

      clearCart: () => set({ items: [], total: 0 }),

      cartCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      cartTotal: () => get().total,
    }),
    { name: "cart-storage" },
  ),
);
