import Hero from "@/components/Hero";
import CategoryMain from "@/components/CategoryMain";
import SalePanner from "@/components/SalePanner";
import TopProducts from "@/components/TopProducts";

export default async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const orderSuccess = params.order === "success";

  return (
    <>
      {orderSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          Thank you for your purchase!
        </div>
      )}

      <Hero />
      <CategoryMain />

      <TopProducts limit={8} />

      <SalePanner />
    </>
  );
}
