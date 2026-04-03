import type { GameStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

// Challenge period is ~3.5 days, use 4 days as safe threshold
const CHALLENGE_WINDOW_SECONDS = 4 * 24 * 60 * 60;

export function StatusBadge({
  status,
  createdAt,
  moveCount,
}: {
  status: GameStatus;
  createdAt?: string;
  moveCount?: number;
}) {
  if (status === 0 && createdAt) {
    const age = Math.floor(Date.now() / 1000) - Number(createdAt);
    const pastWindow = age > CHALLENGE_WINDOW_SECONDS;
    const unchallenged = (moveCount ?? 0) === 0;

    if (pastWindow && unchallenged) {
      // Past challenge window, no moves, never resolved → accepted by default
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border bg-green-500/20 text-green-400 border-green-500/30">
          Accepted
        </span>
      );
    }

    if (pastWindow && !unchallenged) {
      // Past window, has moves, not resolved → claimable
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border bg-blue-500/20 text-blue-400 border-blue-500/30">
          Claimable
        </span>
      );
    }

    // Still within challenge window
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 pulse-dot" />
        In Progress
      </span>
    );
  }

  const colors: Record<GameStatus, string> = {
    0: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    1: "bg-red-500/20 text-red-400 border-red-500/30",
    2: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border ${colors[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
