"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  FiSearch,
  FiTrash2,
  FiEdit,
  FiX,
  FiAlertTriangle,
  FiPlus,
} from "react-icons/fi";
import type {
  CreateProductInput,
  SellerProductDTO,
  AdminProductDTO,
} from "@/types/products";
import {
  Skeleton,
  EmptyState,
  DashboardPageHeader,
} from "@/components/dashboard/dashboard-shared";
import { toast } from "sonner";
import {
  createProduct,
  fetchAdminDashboardProducts,
  fetchSellerDashboardProducts,
  updateProduct,
} from "@/lib/api/products";
import {
  CATEGORY_DEFINITIONS,
  ProductCategory,
} from "@/lib/validations/categories";

type DashboardProduct = SellerProductDTO | AdminProductDTO;

// AdminProductDTO is the only variant carrying seller info — SellerProductDTO
// (what a seller sees for their own listings) never has it, since sellers
// don't need to look up their own email on their own products. This is the
// one place that distinction actually matters in the UI.
function hasSellerInfo(product: DashboardProduct): product is AdminProductDTO {
  return "sellerEmail" in product;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: DashboardProduct | null;
  onClose: () => void;
  onSave: (
    id: string | null,
    data: Partial<CreateProductInput>,
  ) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "",
    category: product?.category ?? ("phones" as ProductCategory),
    image: product?.image ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(product?._id ?? null, {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    });
    setSaving(false);
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type = "text",
    placeholder = "",
  ) => (
    <div>
      <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full bg-gray-150 border border-gray-100 rounded-lg px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gray-400 transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl my-4">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <h3 className="text-gray-900 font-semibold text-base">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field("Product Name", "name", "text", "e.g. iPhone 16 Pro")}
          {field(
            "Description",
            "description",
            "text",
            "Short product description",
          )}

          <div className="grid grid-cols-3 gap-3">
            {field("Price ($)", "price", "number", "999")}
            {field("Stock", "stock", "number", "50")}
          </div>

          <div>
            <label className="block text-gray-500 text-xs uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value as ProductCategory,
                })
              }
              className="w-full bg-gray-150 border border-gray-100 rounded-lg px-3 py-2.5 text-gray-900 text-sm outline-none focus:border-gray-400 transition-colors capitalize"
            >
              {CATEGORY_DEFINITIONS.map((c) => (
                <option
                  key={c.slug}
                  value={c.slug}
                  className="bg-white capitalize"
                >
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {field("Image URL", "image", "url", "https://…")}

          {/* Seller identity is never editable here — the backend always
              derives it from the authenticated session, never from the
              request body, so there's no field for it to submit. */}
          {product && hasSellerInfo(product) && (
            <div className="text-xs text-gray-400 pt-1">
              Seller: {product.sellerName} ({product.sellerEmail})
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-150 hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | ProductCategory>(
    "all",
  );
  const [modalProduct, setModalProduct] = useState<
    DashboardProduct | null | undefined
  >(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      let methode = isAdmin
        ? fetchAdminDashboardProducts
        : fetchSellerDashboardProducts;
      const response = await methode();
      if (response.success) {
        setProducts(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.warning("Product deleted");
      } else {
        toast.error(json.error ?? "Failed");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (
    id: string | null,
    data: Partial<CreateProductInput>,
  ) => {
    if (id) {
      // const res = await fetch(`/api/products/${id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // const json = await res.json();
      const res = await updateProduct(id, data);
      if (res.success) {
        setProducts((prev) => prev.map((p) => (p._id === id ? res.data : p)));
        toast.success("Product updated");
      } else {
        toast.error(res.error ?? "Failed");
      }
    } else {
      // const res = await fetch("/api/products", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // const json = await res.json();
      const res = await createProduct(data as CreateProductInput);
      if (res.success) {
        setProducts((prev) => [res.data, ...prev]);
        toast.success("Product added");
      } else {
        toast.error(res.error ?? "Failed");
      }
    }
    setModalProduct(undefined);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {modalProduct !== undefined && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(undefined)}
          onSave={handleSave}
        />
      )}

      <DashboardPageHeader
        title="Products"
        subtitle="Manage your product catalogue"
        loading={loading}
        onRefresh={loadProducts}
      />

      <div className="flex flex-col flex-1 px-8 py-6 min-h-0 overflow-hidden">
        {lowStockCount > 0 && (
          <div className="flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3 mb-5 text-amber-600 text-sm shrink-0">
            <FiAlertTriangle size={15} className="shrink-0" />
            <span>
              {lowStockCount} product{lowStockCount > 1 ? "s" : ""} with 5 or
              fewer units in stock
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-5 shrink-0">
          <div className="relative flex-1">
            <FiSearch
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value as "all" | ProductCategory)
            }
            aria-label="Filter by category"
            className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-gray-600 text-sm outline-none focus:border-gray-400 transition-colors capitalize"
          >
            <option value="all">All categories</option>
            {CATEGORY_DEFINITIONS.map((c) => (
              <option key={c.slug} value={c.slug} className="capitalize">
                {c.name}
              </option>
            ))}
          </select>
          {/* No control anywhere previously ever called setModalProduct(null)
              — the "Add Product" flow existed in the modal/save logic but had
              no way to actually be triggered. */}
          <button
            onClick={() => setModalProduct(null)}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <FiPlus size={14} /> Add product
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              message={
                search ? `No products matching "${search}"` : "No products yet"
              }
            />
          ) : (
            <>
              <div className="flex-1 flex flex-col min-h-0 overflow-x-auto">
                <div className="w-full min-w-187.5 flex flex-col flex-1 min-h-0">
                  <div className="flex items-center border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-300 font-medium px-4 py-3 shrink-0 bg-white">
                    <div className="w-[8%] text-left">#</div>
                    <div className="w-[37%] text-left">Product</div>
                    <div className="w-[20%] text-left">Category</div>
                    <div className="w-[15%] text-left">Price</div>
                    <div className="w-[12%] text-left">Stock</div>
                    <div className="w-[8%] text-right"></div>
                  </div>

                  <div className="flex-1 overflow-y-auto min-h-0 custom-scroll">
                    {filtered.map((product, i) => (
                      <div
                        key={product._id}
                        className="flex items-center border-b border-gray-50 hover:bg-gray-150 transition-colors group px-4 py-3"
                      >
                        <div className="w-[8%] text-gray-300 text-xs font-mono pr-2">
                          {i + 1}
                        </div>

                        <div className="w-[37%] flex items-center gap-3 min-w-0 pr-4">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-gray-150 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-gray-900 text-xs font-medium truncate">
                              {product.name}
                            </p>
                            {hasSellerInfo(product) && (
                              <p className="text-gray-300 text-[11px] truncate">
                                {product.sellerEmail}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-[20%] pr-2">
                          <span className="text-[10px] inline-block capitalize text-gray-500 bg-gray-150 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        </div>

                        <div className="w-[15%] text-xs font-semibold pr-2">
                          ${product.price}
                        </div>

                        <div className="w-[12%] pr-2">
                          <span
                            className={`text-xs font-medium ${
                              product.stock === 0
                                ? "text-red-400"
                                : product.stock <= 5
                                  ? "text-amber-500"
                                  : "text-gray-500"
                            }`}
                          >
                            {product.stock === 0
                              ? "Out of stock"
                              : `${product.stock} units`}
                          </span>
                        </div>

                        <div className="w-[8%] flex justify-end">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setModalProduct(product)}
                              aria-label={`Edit ${product.name}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                            >
                              <FiEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              disabled={deletingId === product._id}
                              aria-label={`Delete ${product.name}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-100 text-gray-300 text-xs shrink-0">
                {filtered.length} of {products.length} products
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
