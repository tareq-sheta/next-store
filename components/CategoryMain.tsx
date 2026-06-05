import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";

export default function CategoryMain() {
  // let categories: { slug: string; name: string; icon: string }[] = await fetch(
  //   "/api/categories",
  // )
  //   .then((res) => res.json())
  //   .then((data) => data.data);
  // console.log(categories, "_____categories");
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Browse By Category
        </h2>
      </div>

      {/* Categories Grid */}
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex md:grid md:grid-cols-6 gap-4 min-w-max md:min-w-full">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              data-category={cat.slug}
              className="group flex flex-col items-center justify-center w-40 h-32 md:w-full rounded-xl hover:bg-[#211C24] hover:text-white transition-all duration-300 cursor-pointer shadow-sm border border-gray-100 hover:border-transparent"
            >
              <div className="mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:invert">
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-medium">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
