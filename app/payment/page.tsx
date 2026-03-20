"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore, useCartStore } from "@/lib/store";
import useIsLogged from "@/hooks/useIsLogged";

export default function PaymentPage() {
  useIsLogged();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { items, clearCart } = useCartStore();
  const cartTotal = useCartStore((state) => state.cartTotal());
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const tax = Math.round(cartTotal * 0.14);
  const total = cartTotal + tax;

  const selectedAddress = currentUser?.addresses?.[
    currentUser?.selectedAddressIndex ?? -1
  ];

  const handlePlaceOrder = () => {
    clearCart();
    router.push("/?order=success");
  };

  if (!currentUser) return null;

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  if (!selectedAddress) {
    router.replace("/checkout");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Step 1</div>
              <div className="font-semibold text-sm">Address</div>
            </div>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4" />
          <div className="flex items-center">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Step 2</div>
              <div className="font-semibold text-sm">Payment</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h5 className="text-lg font-semibold">Order Summary</h5>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded object-contain bg-gray-50"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.cartQuantity}
                    </div>
                  </div>
                  <div className="font-semibold text-sm">
                    ${item.price * item.cartQuantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="border-t pt-4">
              <p className="font-semibold text-sm mb-2">Delivery Address</p>
              <div className="text-sm text-gray-600">
                <div className="font-medium">{selectedAddress.title}</div>
                <div>{selectedAddress.fullAddress}</div>
                <div>{selectedAddress.phone}</div>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (14%)</span>
                <span>${tax}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

          {/* Right — Payment Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h5 className="text-lg font-semibold mb-4">Payment Information</h5>

            <div className="mb-6 space-y-2">
              <label className="block text-sm font-medium mb-2">
                Payment Method
              </label>
              {[
                { value: "card", label: "Credit / Debit Card" },
                { value: "paypal", label: "PayPal" },
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={value}
                    checked={paymentMethod === value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, number: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expiry: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4 text-sm">
                  You will be redirected to PayPal to complete your payment.
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Continue with PayPal
                </button>
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-semibold transition-colors"
            >
              Place Order — ${total}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
