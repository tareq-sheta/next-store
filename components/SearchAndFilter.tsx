"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

const CATEGORIES = [
  "all",
  "phones",
  "smartwatch",
  "cameras",
  "headphones",
  "computers",
  "gaming",
];

export default function SearchAndFilter({
  totalCount,
}: {
  totalCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "all";
  const currentSearch = searchParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to page 1 whenever filters change
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateQuery("search", searchTerm.trim());
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">Products</span>
      </nav>

      {/* Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800">
          {totalCount !== undefined
            ? `${totalCount} Product${totalCount !== 1 ? "s" : ""} Found`
            : "Products"}
        </h4>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Category Select */}
          <select
            value={currentCategory}
            onChange={(e) => updateQuery("category", e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all"
                  ? "All Categories"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 w-full sm:w-64"
            />
            <button
              type="button"
              onClick={() => updateQuery("search", searchTerm.trim())}
              className="bg-gray-900 text-white px-4 py-2 rounded-r-lg hover:bg-gray-700 transition-colors"
            >
              <FiSearch className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
