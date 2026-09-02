"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore, useCartStore } from "@/lib/store";
import useIsLogged from "@/hooks/useIsLogged";
import { useSession } from "next-auth/react";
import { CurrentUser } from "@/types";
import { useEffect } from "react";
import { FaCartShopping } from "react-icons/fa6";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as CurrentUser | undefined;
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const cartTotal = useCartStore((state) => state.cartTotal());
  const tax = Math.round(cartTotal * 0.14);
  const total = cartTotal + tax;

  // if (!currentUser) return null;
  useEffect(() => {
    if (!user && !status) {
      router.push("/login");
    }
  }, [user, status, router]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6 text-center flex justify-center">
          <FaCartShopping />
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Your cart is empty
        </h2>
        <Link
          href="/products"
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            // console.log(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 items-center"
              >
                <div className="relative w-20 h-20 shrink-0 bg-gray-150 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 capitalize">
                    {item.category}
                  </p>
                  <p className="text-base font-bold text-gray-900 mt-1">
                    ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, item.quantity - 1)
                        : removeFromCart(item.id)
                    }
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    ${item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span>${cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (14%)</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-900">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Proceed to Checkout
          </button>
          <Link
            href="/products"
            className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
