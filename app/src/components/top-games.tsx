"use client";

import Link from "next/link";
import { useGames } from "@/hooks/use-games";
import { StatusBadge } from "./status-badge";
import { ChainBadge } from "./chain-badge";
import { ExternalLink } from "./external-link";
import { ClickableRow } from "./clickable-row";
import { GameCard } from "./game-card";
import { GameBond } from "./game-bond";
import { truncateAddress, timeAgo, etherscanUrl } from "@/lib/utils";
import type { GameStatus } from "@/lib/types";

export function TopGames({ chain }: { chain: string }) {
  const { games, isLoading } = useGames({
    chain: chain || undefined,
    contested: true,
    sort: "moves",
    limit: 3,
  });

  return (
    <div className="bg-gradient-to-b from-terminal-panel to-terminal-bg">
      <div className="px-5 py-4">
        <h2 className="text-sm font-bold text-zinc-100 tracking-wide uppercase">
          Most Contested
        </h2>
      </div>

      {isLoading ? (
        <div className="px-5 py-8 text-center text-xs text-terminal-muted">
          Loading...
        </div>
      ) : games.length === 0 ? (
        <div className="px-5 py-8 text-center text-xs text-terminal-muted">
          No contested games yet
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="lg:hidden">
            {games.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                showBonds
                bondSlot={<GameBond gameId={g.id} />}
              />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-y border-terminal-border text-zinc-500 text-left uppercase tracking-wider">
                  <th className="px-5 py-2.5 font-medium text-[10px]">Chain</th>
                  <th className="px-5 py-2.5 font-medium text-[10px]">Game</th>
                  <th className="px-5 py-2.5 font-medium text-[10px]">Root Claim</th>
                  <th className="px-5 py-2.5 font-medium text-[10px]">Status</th>
                  <th className="px-5 py-2.5 font-medium text-[10px]">Moves</th>
                  <th className="px-5 py-2.5 font-medium text-[10px]">Bonds</th>
                  <th className="px-5 py-2.5 font-medium text-[10px]">Created</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <ClickableRow
                    key={g.id}
                    href={`/game/${g.id}`}
                    className="game-row border-b border-terminal-border"
                  >
                    <td className="px-5 py-2.5">
                      <ChainBadge chain={g.chain} />
                    </td>
                    <td className="px-5 py-2.5">
                      <Link
                        href={`/game/${g.id}`}
                        className="text-terminal-accent hover:underline font-mono"
                      >
                        {truncateAddress(g.id)}
                      </Link>
                    </td>
                    <td className="px-5 py-2.5 font-mono text-zinc-500">
                      {truncateAddress(g.rootClaim)}
                    </td>
                    <td className="px-5 py-2.5">
                      <StatusBadge
                        status={g.status as GameStatus}
                        createdAt={g.createdAt}
                        moveCount={g.moveCount}
                      />
                    </td>
                    <td className="px-5 py-2.5 text-terminal-accent font-semibold font-mono">
                      {g.moveCount}
                    </td>
                    <td className="px-5 py-2.5">
                      <GameBond gameId={g.id} />
                    </td>
                    <td className="px-5 py-2.5">
                      <ExternalLink
                        href={etherscanUrl(g.createdTxHash)}
                        className="text-zinc-500 hover:text-zinc-300"
                      >
                        {timeAgo(g.createdAt)}
                      </ExternalLink>
                    </td>
                  </ClickableRow>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
