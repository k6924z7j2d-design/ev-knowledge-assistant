import Link from "next/link";

export default function EvNotFound() {
  return (
    <div className="max-w-[1390px] mx-auto px-10 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">Vehicle not found</h1>
      <p className="text-text-secondary mb-6">
        We couldn&apos;t find that vehicle in the garage.
      </p>
      <Link href="/evs" className="text-info font-semibold">
        ‹ Back to all EVs
      </Link>
    </div>
  );
}
