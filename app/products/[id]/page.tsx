// app/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectToDatabase from "@/lib/database";
import Products from "@/models/products";
import { toPublicProductDTO } from "@/lib/dto";
import AddToCartButton from "@/components/AddToCartButton"; // Client component
import { FaShieldAlt, FaShoppingCart, FaTruck } from "react-icons/fa";
import TopProducts from "@/components/TopProducts";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 1. Dynamic SEO Metadata for Google / Social Media Crawlers
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  await connectToDatabase();
  const productDoc = await new Products().findById(id);

  if (!productDoc) return { title: "Product Not Found" };

  return {
    title: `${productDoc.name} | Cyber Tech Store`,
    description: productDoc.description,
    openGraph: {
      title: productDoc.name,
      description: productDoc.description,
      images: [{ url: productDoc.image }],
    },
  };
}

// 2. Fast Server Component (RSC)
export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();
  const productsRepo = new Products();

  const productDoc = await productsRepo.findById(id);
  if (!productDoc) notFound();

  const product = toPublicProductDTO(productDoc);

  // Fetch similar products in DB (same category, excluding current)
  const { items: rawSimilar } = await productsRepo.showPublic({
    category: product.category as any,
    limit: 4,
  });
  const similar = rawSimilar
    .map(toPublicProductDTO)
    .filter((p) => p._id !== product._id);

  return (
    // <div className="container mx-auto px-50 py-8">
    // <div className="w-full xl:w-330 mx-auto py-8 px-4 md:px-8">
    <div className="w-full">
      {/* Breadcrumb */}
      <nav
        className="text-sm text-gray-500 mb-8 w-full px-10 py-4"
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className="hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
        >
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link
          href="/products"
          className="hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
        >
          Products
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 "> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 w-full xs:px-20  xl:max-w-330  md:max-w-240  sm:max-w-140 mx-auto"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 w-full px-6 md:px-0 xl:max-w-330 md:max-w-240 sm:max-w-140 mx-auto">
        <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-8 min-h-87.5 relative">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            priority
            className="object-contain max-h-87.5"
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm text-gray-400 uppercase tracking-wide mb-2">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price}
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Interactive Client Component for Cart Action */}
          <AddToCartButton product={product} />
          {/* <div className="grid grid-cols-3 gap-4 mt-8 pt-8 "> */}
          <div className="flex flex-wrap justify-around gap-6 mt-8 pt-8">
            {[
              { icon: <FaTruck />, title: "Free Delivery", sub: "1-2 days" },
              {
                icon: <FaShoppingCart />,
                title: "Stock Status",
                sub: `${product.stockStatus === "IN_STOCK" ? "In Stock" : product.stockStatus === "OUT_OF_STOCK" ? "Out of Stock" : "Low Stock"}`,
              },
              {
                icon: <FaShieldAlt />,
                title: "Guaranteed",
                sub: "1 Year Warranty",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex flex-row justify-center items-center text-center gap-2"
              >
                <span className="text-3xl text-gray-700">{f.icon}</span>
                <span>
                  <p className="text-xs font-semibold text-gray-800">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-400">{f.sub}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {/* {similar.length > 0 && (
        // <section>
        // <section className="w-full xl:max-w-330 md:max-w-240 sm:max-w-140 mx-auto py-10">
        <section className="w-full px-6 md:px-0 xl:max-w-330 md:max-w-240 sm:max-w-140 mx-auto py-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similar.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )} */}
      <TopProducts
        limit={4}
        category={product.category}
        excludeId={product._id}
      />
    </div>
  );
}
