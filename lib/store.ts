import {
  Product,
  users as defaultUsers,
  products as defaultProducts,
} from "./data";
import { User, Address } from "@/types/UserInterface";
import { genSalt, hash, compare } from "bcryptjs";

// ===== HELPERS =====
export function getData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData<T>(key: string, data: T): void {

  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== INIT (seed localStorage if empty) =====
export function initStore(): void {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("users")) {
    saveData("users", defaultUsers);
  }
  if (!localStorage.getItem("products")) {
    saveData("products", defaultProducts);
  }
}

// ===== USERS =====
export function getUsers(): User[] {
  return getData<User[]>("users", defaultUsers);
}

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveData("users", users);
}

// ===== AUTH =====
export function getCurrentUser(): User | null {
  return getData<User | null>("currentUser", null);
}

export function setCurrentUser(user: User): void {
  saveData("currentUser", user);
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("currentUser");
}

// ===== PRODUCTS =====
export function getProducts(): Product[] {
  return getData<Product[]>("products", defaultProducts);
}

// ===== CART =====
export interface CartItem extends Product {
  cartQuantity: number;
}

export function getCart(): CartItem[] {
  const user = getCurrentUser();
  if (!user) return [];
  return getData<CartItem[]>(`cart_${user.id}`, []);
}

export function saveCart(cart: CartItem[]): void {
  const user = getCurrentUser();
  if (!user) return;
  saveData(`cart_${user.id}`, cart);
}

export function addToCart(product: Product): void {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.cartQuantity += 1;
  } else {
    cart.push({ ...product, cartQuantity: 1 });
  }
  saveCart(cart);
}

export function removeFromCart(productId: number): void {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

export function updateCartQuantity(productId: number, quantity: number): void {
  const cart = getCart().map((item) =>
    item.id === productId ? { ...item, cartQuantity: quantity } : item,
  );
  saveCart(cart);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.cartQuantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );
}

// ===== ADDRESSES =====
export type { Address };
export function getAddresses(): Address[] {
  const user = getCurrentUser();
  return user?.addresses || [];
}

export function addAddress(address: Address): void {
  const user = getCurrentUser();
  if (!user) return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return;
  if (!users[idx].addresses) users[idx].addresses = [];
  users[idx].addresses.push(address);
  users[idx].selectedAddressIndex = users[idx].addresses.length - 1;
  saveData("users", users);
  setCurrentUser(users[idx]);
}

export function removeAddress(index: number): void {
  const user = getCurrentUser();
  if (!user) return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return;
  if (!users[idx].addresses) return;
  users[idx].addresses.splice(index, 1);
  if (users[idx].selectedAddressIndex === index) {
    users[idx].selectedAddressIndex =
      users[idx].addresses.length > 0 ? 0 : undefined;
  } else if (
    users[idx].selectedAddressIndex &&
    users[idx].selectedAddressIndex > index
  ) {
    users[idx].selectedAddressIndex -= 1;
  }
  saveData("users", users);
  setCurrentUser(users[idx]);
}

export function updateAddress(index: number, address: Address): void {
  const user = getCurrentUser();
  if (!user) return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return;
  if (!users[idx].addresses || !users[idx].addresses[index]) return;
  users[idx].addresses[index] = address;
  saveData("users", users);
  setCurrentUser(users[idx]);
}

export function selectAddress(index: number): void {
  const user = getCurrentUser();
  if (!user) return;
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return;
  users[idx].selectedAddressIndex = index;
  saveData("users", users);
  setCurrentUser(users[idx]);
}

export function getSelectedAddress(): Address | null {
  const user = getCurrentUser();
  if (!user || !user.addresses || user.selectedAddressIndex === undefined)
    return null;
  return user.addresses[user.selectedAddressIndex] || null;
}

// ===== PASSWORD HASHING =====
export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(10);
  return await hash(password, salt);


  // const msgBuffer = new TextEncoder().encode(password);
  // const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  // const hashArray = Array.from(new Uint8Array(hashBuffer));
  // return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
export async function comparePassword(password: string,userPassword:string): Promise<boolean> {

  return await compare(password, userPassword);

  // const msgBuffer = new TextEncoder().encode(password);
  // const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  // const hashArray = Array.from(new Uint8Array(hashBuffer));
  // return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
