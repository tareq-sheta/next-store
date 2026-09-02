import AdminOverview from "@/components/dashboard/AdminOverview";
import SellerOverview from "@/components/dashboard/SellerOverview";
import { requireAuth } from "@/lib/auth-guard";

export default async function OverviewPage() {
  const session = await requireAuth(["admin", "seller"]);

  return session.user.role === "admin" ? <AdminOverview /> : <SellerOverview />;
}
