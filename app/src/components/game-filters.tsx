"use client";

import { CHAIN_STYLES } from "./chain-badge";

const chainOptions = [
  { value: "", label: "All Chains" },
  ...Object.entries(CHAIN_STYLES).map(([key, s]) => ({
    value: key,
    label: s.label,
  })),
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "0", label: "In Progress" },
  { value: "1", label: "Challenger Wins" },
  { value: "2", label: "Defender Wins" },
];

export function GameFilters({
  chain,
  status,
  onChainChange,
  onStatusChange,
}: {
  chain: string;
  status: string;
  onChainChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <div className="flex border border-terminal-border">
        {chainOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChainChange(opt.value)}
            className={`px-3 py-1.5 text-xs transition-colors ${
              chain === opt.value
                ? "bg-terminal-accent/20 text-terminal-accent"
                : "text-terminal-muted hover:text-zinc-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex border border-terminal-border">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`px-3 py-1.5 text-xs transition-colors ${
              status === opt.value
                ? "bg-terminal-accent/20 text-terminal-accent"
                : "text-terminal-muted hover:text-zinc-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
