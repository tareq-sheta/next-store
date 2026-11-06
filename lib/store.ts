import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, PublicProductDTO, UserDTO } from "@/types";

interface AuthState {
  currentUser: UserDTO | null;
  isHydrated: boolean;
  setCurrentUser: (user: UserDTO | null) => void;
  updateCurrentUser: (user: Partial<UserDTO>) => void;
  logout: () => void;
  setHydrated: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      isHydrated: false,
      setHydrated: (val: boolean) => set({ isHydrated: val }),
      setCurrentUser: (user: UserDTO | null) => set({ currentUser: user }),
      updateCurrentUser: (user: Partial<UserDTO>) =>
        set((state) => ({
          currentUser: { ...(state.currentUser || {}), ...user } as UserDTO,
        })),
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

interface CartState {
  items: CartItem[];
  total: number;
  addToCart: (item: CartItem | PublicProductDTO) => void;
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
            "id" in item
              ? { ...item, quantity: item.quantity ?? 1 }
              : {
                  id: item._id,
                  name: item.name,
                  price: item.price,
                  quantity: 1,
                  image: item.image,
                  category: item.category,
                };
          const existing = state.items.find(
            (i) => i.id.toString() === cartItem.id.toString(),
          );
          const updatedItems = existing
            ? state.items.map((i) =>
                i.id.toString() === cartItem.id.toString()
                  ? { ...i, quantity: i.quantity + cartItem.quantity }
                  : i,
              )
            : [...state.items, { ...cartItem, quantity: cartItem.quantity }];
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
            (i) => i.id.toString() !== productId.toString(),
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
          // Clamp to at least 1 — an unguarded value let quantity go to 0
          // or negative, producing a cart line with a negative total.
          const safeQuantity = Math.max(1, quantity);
          const updatedItems = state.items.map((i) =>
            i.id.toString() === productId.toString()
              ? { ...i, quantity: safeQuantity }
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
