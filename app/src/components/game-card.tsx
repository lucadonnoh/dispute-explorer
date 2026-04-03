"use client";

import { useRouter } from "next/navigation";
import { StatusBadge } from "./status-badge";
import { ChainBadge } from "./chain-badge";
import { ExternalLink } from "./external-link";
import { truncateAddress, timeAgo, etherscanUrl } from "@/lib/utils";
import type { Game, GameStatus } from "@/lib/types";

export function GameCard({
  game,
  showBonds,
  bondSlot,
}: {
  game: Game;
  showBonds?: boolean;
  bondSlot?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div
      className="border-b border-terminal-border px-4 py-3 hover:bg-terminal-row-hover transition-colors cursor-pointer"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        router.push(`/game/${game.id}`);
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ChainBadge chain={game.chain} />
          <span className="text-terminal-accent font-mono text-xs">
            {truncateAddress(game.id)}
          </span>
        </div>
        <StatusBadge
          status={game.status as GameStatus}
          createdAt={game.createdAt}
          moveCount={game.moveCount}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-zinc-500">
          {game.moveCount > 0 && (
            <span>
              <span className="text-terminal-accent font-semibold font-mono">
                {game.moveCount}
              </span>{" "}
              moves
            </span>
          )}
          {showBonds && bondSlot && <span>{bondSlot}</span>}
          <span className="font-mono text-zinc-600">
            {truncateAddress(game.rootClaim)}
          </span>
        </div>
        <ExternalLink
          href={etherscanUrl(game.createdTxHash)}
          className="text-zinc-600 hover:text-zinc-400"
        >
          {timeAgo(game.createdAt)}
        </ExternalLink>
      </div>
    </div>
  );
}
