import Link from "next/link";

export default function SalePanner() {
  return (
    <section className="bg-[#211C24] text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-4">
          Big Summer <span className="font-bold">Sale</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Commodo fames vitae vitae leo mauris in. Eu consequat.
        </p>
        <Link
          href="/products"
          className="inline-block border border-white text-white text-lg px-8 py-3 hover:bg-white hover:text-black transition-colors duration-300 rounded-sm"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
