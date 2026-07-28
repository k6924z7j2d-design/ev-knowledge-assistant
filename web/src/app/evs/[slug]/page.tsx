import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvBySlug } from "@/lib/ev-data";
import { EvShortlistRail } from "@/components/evs/EvShortlistRail";
import { EvDetailHero } from "@/components/evs/EvDetailHero";
import { EvStatGrid } from "@/components/evs/EvStatGrid";
import { EvEnergyChart } from "@/components/evs/EvEnergyChart";
import { ChevronLeft } from "lucide-react";

export default async function EvDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getEvBySlug(slug);
  if (!vehicle) notFound();

  return (
    <div className="flex h-full">
      <EvShortlistRail activeSlug={vehicle.slug} />
      <div className="flex-1 min-w-0 px-8 py-7 overflow-y-auto">
        <Link
          href="/evs"
          className="inline-flex items-center gap-1.5 text-text-secondary text-sm mb-5 hover:text-text-primary"
        >
          <ChevronLeft width={14} height={14} /> All EVs
        </Link>
        <div className="mb-6">
          <h1 className="text-[28px] font-bold mb-1">{vehicle.name}</h1>
          <p className="text-text-secondary text-[15px] m-0">
            {vehicle.year} · {vehicle.trim}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <EvDetailHero vehicle={vehicle} />
          <EvStatGrid vehicle={vehicle} />
          <EvEnergyChart values={vehicle.weeklyEnergyUseKWh} avgKWh={vehicle.weeklyEnergyAvgKWh} />
        </div>
      </div>
    </div>
  );
}
