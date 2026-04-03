"use client";

import { useStats } from "@/hooks/use-games";
import { CHAIN_STYLES } from "./chain-badge";

export function StatsBar({
  selectedChain,
  onChainSelect,
}: {
  selectedChain: string;
  onChainSelect: (chain: string) => void;
}) {
  const { stats, isLoading } = useStats();

  if (isLoading || !stats) {
    return (
      <div className="border-b border-terminal-border px-5 py-4">
        <div className="text-xs text-terminal-muted">Loading stats...</div>
      </div>
    );
  }

  const chains = Object.keys(CHAIN_STYLES).filter((c) => {
    const s = stats[c];
    return s && ((s.active || 0) + (s.challenger_wins || 0) + (s.defender_wins || 0)) > 0;
  });

  if (chains.length === 0) return null;

  return (
    <div className="border-b border-terminal-border">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {selectedChain && (
          <button
            onClick={() => onChainSelect("")}
            className="col-span-2 lg:col-span-4 px-4 py-2 flex items-center justify-center border-b border-terminal-border text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer hover:bg-terminal-panel transition-colors"
          >
            &times; Clear filter
          </button>
        )}
        {chains.map((chain) => {
          const s = stats[chain] || {};
          const total =
            (s.active || 0) + (s.challenger_wins || 0) + (s.defender_wins || 0);
          const style = CHAIN_STYLES[chain];
          const isSelected = selectedChain === chain;

          return (
            <button
              key={chain}
              onClick={() => onChainSelect(isSelected ? "" : chain)}
              className={`px-5 py-3.5 flex flex-col gap-1.5 text-left transition-all border-b lg:border-b-0 border-r border-terminal-border cursor-pointer ${
                isSelected
                  ? "bg-terminal-panel stat-card-selected"
                  : selectedChain && !isSelected
                    ? "opacity-30 hover:opacity-60"
                    : "hover:bg-terminal-panel"
              }`}
            >
              <span className="font-semibold text-zinc-200 flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                {style.fullLabel}
                <span className="text-zinc-600 font-normal text-xs ml-auto font-mono">
                  {total.toLocaleString()}
                </span>
              </span>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
                <div>
                  <div className="text-yellow-400 font-mono">{s.active || 0}</div>
                  <div>active</div>
                </div>
                <div>
                  <div className="text-green-400 font-mono">{(s.defender_wins || 0).toLocaleString()}</div>
                  <div>defended</div>
                </div>
                <div>
                  <div className="text-red-400 font-mono">{s.challenger_wins || 0}</div>
                  <div>challenged</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
