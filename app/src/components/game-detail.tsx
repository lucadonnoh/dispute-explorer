"use client";

import Link from "next/link";
import { useGame, useClaims } from "@/hooks/use-games";
import { useMoves } from "@/hooks/use-moves";
import { StatusBadge } from "./status-badge";
import { ChainBadge } from "./chain-badge";
import { MoveGraph } from "./move-graph";
import { ExternalLink } from "./external-link";
import {
  truncateAddress,
  formatTimestamp,
  timeAgo,
  etherscanUrl,
  etherscanAddressUrl,
} from "@/lib/utils";
import { GAME_TYPE_LABELS, type GameStatus } from "@/lib/types";

export function GameDetail({ id }: { id: string }) {
  const { game, isLoading: gameLoading } = useGame(id);
  const { moves, isLoading: movesLoading } = useMoves(id);
  const hasContested = !gameLoading && game && game.moveCount > 0;
  const { claims, isLoading: claimsLoading } = useClaims(id, !!hasContested);

  const sortedMoves = [...moves].sort((a, b) => {
    const tsDiff = Number(a.timestamp) - Number(b.timestamp);
    if (tsDiff !== 0) return tsDiff;
    return a.moveIndex - b.moveIndex;
  });

  if (gameLoading) {
    return (
      <div className="px-4 py-8 text-center text-terminal-muted">
        Loading game...
      </div>
    );
  }

  if (!game) {
    return (
      <div className="px-4 py-8 text-center text-terminal-muted">
        Game not found
      </div>
    );
  }

  return (
    <div className="px-4 py-4 max-w-5xl mx-auto">
      <Link
        href="/"
        className="text-xs text-terminal-muted hover:text-zinc-300 mb-4 inline-block"
      >
        &larr; Back to games
      </Link>

      {/* Outcome Banner */}
      {game.status === 2 && (
        <div className="mb-4 border border-green-500/30 bg-green-500/5 px-4 py-3 flex items-center gap-3">
          <span className="text-green-400 text-lg">&#10003;</span>
          <div>
            <div className="text-green-400 font-semibold text-sm">Root Accepted</div>
            <div className="text-zinc-500 text-xs">This proposal was confirmed as canonical — defender wins.</div>
          </div>
        </div>
      )}
      {game.status === 1 && (
        <div className="mb-4 border border-red-500/30 bg-red-500/5 px-4 py-3 flex items-center gap-3">
          <span className="text-red-400 text-lg">&#10007;</span>
          <div>
            <div className="text-red-400 font-semibold text-sm">Root Discarded</div>
            <div className="text-zinc-500 text-xs">This proposal was proven incorrect — challenger wins.</div>
          </div>
        </div>
      )}
      {game.status === 0 && game.moveCount > 0 && (
        <div className="mb-4 border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 flex items-center gap-3">
          <span className="text-yellow-400 text-lg pulse-dot">&#9679;</span>
          <div>
            <div className="text-yellow-400 font-semibold text-sm">Dispute In Progress</div>
            <div className="text-zinc-500 text-xs">This proposal is being actively challenged.</div>
          </div>
        </div>
      )}

      {/* Game Info */}
      <div className="border border-terminal-border bg-terminal-panel p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <ChainBadge chain={game.chain} />
          <StatusBadge status={game.status as GameStatus} createdAt={game.createdAt} moveCount={game.moveCount} />
          <span className="text-xs text-terminal-muted">
            {GAME_TYPE_LABELS[game.gameType] ?? `Type ${game.gameType}`}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="col-span-2 lg:col-span-1">
            <span className="text-terminal-muted">Game Address</span>
            <div className="mt-0.5">
              <ExternalLink
                href={etherscanAddressUrl(game.id)}
                className="text-terminal-accent hover:underline font-mono"
              >
                {game.id}
              </ExternalLink>
            </div>
          </div>

          <div>
            <span className="text-terminal-muted">Root Claim</span>
            <div className="mt-0.5 font-mono text-zinc-400 break-all">
              {game.rootClaim}
            </div>
          </div>

          <div>
            <span className="text-terminal-muted">Created</span>
            <div className="mt-0.5 text-zinc-400">
              {formatTimestamp(game.createdAt)}
              <div className="text-zinc-600">{timeAgo(game.createdAt)}</div>
            </div>
          </div>

          {game.resolvedAt && (
            <div>
              <span className="text-terminal-muted">Resolved</span>
              <div className="mt-0.5 text-zinc-400">
                {formatTimestamp(game.resolvedAt)}
                <div className="text-zinc-600">{timeAgo(game.resolvedAt)}</div>
              </div>
            </div>
          )}

          <div>
            <span className="text-terminal-muted">L1 Block</span>
            <div className="mt-0.5 text-zinc-400">{game.l1BlockNumber}</div>
          </div>

          <div>
            <span className="text-terminal-muted">Total Moves</span>
            <div className="mt-0.5 text-zinc-400">{game.moveCount}</div>
          </div>

          {claims.length > 0 && (
            <div>
              <span className="text-terminal-muted">Total Bonds</span>
              <div className="mt-0.5 text-yellow-400 font-semibold">
                {(claims.reduce((sum, c) => sum + Number(BigInt(c.bond)) / 1e18, 0)).toFixed(4)} ETH
              </div>
            </div>
          )}

          <div>
            <span className="text-terminal-muted">Creation Tx</span>
            <div className="mt-0.5">
              <ExternalLink
                href={etherscanUrl(game.createdTxHash)}
                className="text-terminal-muted hover:text-zinc-300"
              >
                {truncateAddress(game.createdTxHash)}
              </ExternalLink>
            </div>
          </div>

          {game.resolvedTxHash && (
            <div>
              <span className="text-terminal-muted">Resolution Tx</span>
              <div className="mt-0.5">
                <ExternalLink
                  href={etherscanUrl(game.resolvedTxHash)}
                  className="text-terminal-muted hover:text-zinc-300"
                >
                  {truncateAddress(game.resolvedTxHash)}
                </ExternalLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Move Graph */}
      {hasContested && (
        <div className="border border-terminal-border bg-terminal-panel mb-4">
          <div className="px-4 py-3 border-b border-terminal-border">
            <h3 className="text-sm font-semibold text-zinc-200">
              Dispute Tree
            </h3>
          </div>
          {claimsLoading ? (
            <div className="px-4 py-6 text-center text-xs text-terminal-muted">
              Loading on-chain claim data...
            </div>
          ) : (
            <MoveGraph game={game} claims={claims} moves={moves} />
          )}
        </div>
      )}

      {/* Claims Table */}
      <div className="border border-terminal-border bg-terminal-panel">
        <div className="px-4 py-3 border-b border-terminal-border">
          <h3 className="text-sm font-semibold text-zinc-200">
            Claims
            {!claimsLoading && claims.length > 0 && (
              <span className="text-terminal-muted font-normal ml-2">
                ({claims.length})
              </span>
            )}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-terminal-border text-terminal-muted text-left">
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Parent</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Claim</th>
                <th className="px-4 py-2 font-medium">Claimant</th>
                <th className="px-4 py-2 font-medium">Bond</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {claimsLoading || claims.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-terminal-muted"
                  >
                    {claimsLoading ? "Loading claims..." : "No claims"}
                  </td>
                </tr>
              ) : (
                claims.map((c, i) => {
                  const isRoot = i === 0;
                  const isAttack = !isRoot && BigInt(c.position) % BigInt(2) === BigInt(0);
                  const countered = c.counteredBy !== "0x0000000000000000000000000000000000000000";
                  const bond = Number(BigInt(c.bond)) / 1e18;
                  const move = sortedMoves[i - 1];

                  return (
                    <tr
                      key={i}
                      className="game-row border-b border-terminal-border"
                    >
                      <td className="px-4 py-2 text-zinc-500">{i}</td>
                      <td className="px-4 py-2 text-zinc-500">
                        {isRoot ? "-" : c.parentIndex}
                      </td>
                      <td className="px-4 py-2">
                        {isRoot ? (
                          <span className="text-zinc-500">root</span>
                        ) : isAttack ? (
                          <span className="text-red-400">attack</span>
                        ) : (
                          <span className="text-green-400">defend</span>
                        )}
                      </td>
                      <td className="px-4 py-2 font-mono text-zinc-500">
                        {truncateAddress(c.claim)}
                      </td>
                      <td className="px-4 py-2">
                        <ExternalLink
                          href={etherscanAddressUrl(c.claimant)}
                          className="text-terminal-accent hover:underline font-mono"
                        >
                          {truncateAddress(c.claimant)}
                        </ExternalLink>
                      </td>
                      <td className="px-4 py-2 text-zinc-500">
                        {bond >= 1 ? `${bond.toFixed(2)}` : bond.toFixed(4)} ETH
                      </td>
                      <td className="px-4 py-2">
                        {countered ? (
                          <span className="text-red-400">countered</span>
                        ) : (
                          <span className="text-green-400">uncountered</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {move ? (
                          <ExternalLink
                            href={etherscanUrl(move.txHash)}
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            {timeAgo(move.timestamp)}
                          </ExternalLink>
                        ) : (
                          <ExternalLink
                            href={etherscanUrl(game.createdTxHash)}
                            className="text-zinc-500 hover:text-zinc-300"
                          >
                            {timeAgo(game.createdAt)}
                          </ExternalLink>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
