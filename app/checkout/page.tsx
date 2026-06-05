"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
//import { updateUser } from "@/lib/api";
// import { Address } from "@/types/UserInterface";
import useIsLogged from "@/hooks/useIsLogged";
import { IAddress, IUser } from "@/models/users";
import { updateUser } from "@/handlers/users";

export default function CheckoutPage() {
  useIsLogged();
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const router = useRouter();

  const addresses: IAddress[] = currentUser?.addresses ?? [];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    currentUser?.addresses?.length ? currentUser.addresses.length - 1 : null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({
    title: "",
    fullAddress: "",
    phone: "",
    label: "Home",
  });

  if (!currentUser) return null;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAddresses = [...addresses, newAddress];
    const updated = { ...currentUser, addresses: updatedAddresses };
    await updateUser(updated);
    setCurrentUser(updated);
    setNewAddress({ title: "", fullAddress: "", phone: "", label: "Home" });
    setShowAddModal(false);
  };

  const handleRemoveAddress = async (index: number) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    const updated = {
      ...currentUser,
      addresses: updatedAddresses,
      selectedAddressIndex:
        selectedIndex === index ? undefined : (selectedIndex ?? undefined),
    };
    await updateUser(updated);
    setCurrentUser(updated);
    if (selectedIndex === index) setSelectedIndex(null);
  };

  const handleSelectAddress = async (index: number) => {
    setSelectedIndex(index);
    const updated = { ...currentUser, selectedAddressIndex: index };
    await updateUser(updated);
    setCurrentUser(updated);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Step 1</div>
              <div className="font-semibold text-sm">Address</div>
            </div>
          </div>
          <div className="flex-1 h-px bg-gray-300 mx-4" />
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Step 2</div>
              <div className="font-semibold text-sm">Payment</div>
            </div>
          </div>
        </div>

        <h4 className="text-2xl font-bold mb-6">Select Delivery Address</h4>

        {/* Address List */}
        <div className="space-y-4 mb-6">
          {addresses.length === 0 && (
            <p className="text-gray-400 text-sm">
              No saved addresses yet. Add one below.
            </p>
          )}
          {addresses.map((address, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedIndex === index
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleSelectAddress(index)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedIndex === index}
                    onChange={() => handleSelectAddress(index)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-semibold">{address.title}</div>
                    <div className="text-sm text-gray-600">
                      {address.fullAddress}
                    </div>
                    <div className="text-sm text-gray-600">{address.phone}</div>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mt-1">
                      {address.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAddress(index);
                  }}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 text-xl transition-colors"
          >
            +
          </button>
          <div className="text-sm text-gray-600">Add New Address</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => router.push("/cart")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => router.push("/payment")}
            disabled={selectedIndex === null}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h5 className="text-lg font-semibold mb-4">Add New Address</h5>
            <form onSubmit={handleAddAddress} className="space-y-3">
              {[
                {
                  label: "Address Title",
                  key: "title" as keyof IAddress,
                  placeholder: "e.g. My Home",
                },
                {
                  label: "Full Address",
                  key: "fullAddress" as keyof IAddress,
                  placeholder: "123 Main St, City",
                },
                {
                  label: "Phone Number",
                  key: "phone" as keyof IAddress,
                  placeholder: "+1 234 567 8900",
                },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={newAddress[key]}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <select
                  value={newAddress.label}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, label: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
