"use client";

import { useClaims } from "@/hooks/use-games";

export function GameBond({ gameId }: { gameId: string }) {
  const { claims, isLoading } = useClaims(gameId, true);

  if (isLoading) return <span className="text-zinc-600">...</span>;
  if (claims.length === 0) return <span className="text-zinc-600">-</span>;

  const total = claims.reduce(
    (sum, c) => sum + Number(BigInt(c.bond)) / 1e18,
    0
  );

  return (
    <span className="text-yellow-400 font-semibold">
      {total >= 1 ? total.toFixed(2) : total.toFixed(4)} ETH
    </span>
  );
}
