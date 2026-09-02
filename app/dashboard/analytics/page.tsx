import AdminAnalytics from "@/components/dashboard/AdminAnalytics";
import SellerAnalytics from "@/components/dashboard/SellerAnalytics";
import { requireAuth } from "@/lib/auth-guard";

export default async function AnalyticsPage() {
  const session = await requireAuth(["admin", "seller"]);

  if (session?.user?.role === "admin") {
    return <AdminAnalytics />;
  }

  return <SellerAnalytics />;
}
