import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

export default function SectionHeader({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-gray-900 text-sm font-semibold">{title}</h3>
      <Link
        href={href}
        className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors"
      >
        {linkLabel} <FiArrowUpRight size={11} />
      </Link>
    </div>
  );
}
