export const metadata = {
  title: "Favorites - Cyber Tech Store",
  description:
    "The story of Cyber Tech Store, from its vanilla JS roots to its modern Next.js evolution.",
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-16 lg:py-24 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Favorites
          </h1>
        </div>
      </section>
    </div>
  );
}
