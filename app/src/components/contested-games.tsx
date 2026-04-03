"use client";

import { useState } from "react";
import Link from "next/link";
import { useGames } from "@/hooks/use-games";
import { StatusBadge } from "./status-badge";
import { ChainBadge } from "./chain-badge";
import { ExternalLink } from "./external-link";
import { ClickableRow } from "./clickable-row";
import { GameCard } from "./game-card";
import { truncateAddress, timeAgo, etherscanUrl } from "@/lib/utils";
import type { GameStatus } from "@/lib/types";

const PAGE_SIZE = 25;

export function ContestedGames({ chain }: { chain: string }) {
  const [page, setPage] = useState(1);
  const { games, page: currentPage, totalPages, total, isLoading } = useGames({
    chain: chain || undefined,
    contested: true,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className="border-b border-terminal-border">
      <div className="px-5 py-4 flex items-center gap-3">
        <h2 className="text-sm font-bold text-zinc-100 tracking-wide uppercase section-title">
          Recently Contested
        </h2>
        {!isLoading && (
          <span className="text-xs text-zinc-600 font-mono">({total})</span>
        )}
      </div>

      {isLoading ? (
        <div className="px-5 py-6 text-center text-xs text-terminal-muted">
          Loading...
        </div>
      ) : games.length === 0 ? (
        <div className="px-5 py-6 text-center text-xs text-terminal-muted">
          No contested games found yet
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="lg:hidden">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
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

      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-terminal-border flex items-center justify-between">
          <span className="text-xs text-terminal-muted">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage <= 1}
              className="hidden sm:block px-2 py-1 text-xs border border-terminal-border disabled:opacity-30 hover:bg-terminal-row-hover disabled:hover:bg-transparent"
            >
              First
            </button>
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-2 py-1 text-xs border border-terminal-border disabled:opacity-30 hover:bg-terminal-row-hover disabled:hover:bg-transparent"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-2 py-1 text-xs border border-terminal-border disabled:opacity-30 hover:bg-terminal-row-hover disabled:hover:bg-transparent"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="hidden sm:block px-2 py-1 text-xs border border-terminal-border disabled:opacity-30 hover:bg-terminal-row-hover disabled:hover:bg-transparent"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
