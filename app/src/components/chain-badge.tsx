const CHAIN_STYLES: Record<string, { bg: string; dot: string; label: string; fullLabel: string }> = {
  optimism: { bg: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-500", label: "OP", fullLabel: "OP Mainnet" },
  base: { bg: "bg-blue-500/20 text-blue-400 border-blue-500/30", dot: "bg-blue-500", label: "Base", fullLabel: "Base" },
  ink: { bg: "bg-purple-500/20 text-purple-400 border-purple-500/30", dot: "bg-purple-500", label: "Ink", fullLabel: "Ink" },
  unichain: { bg: "bg-pink-500/20 text-pink-400 border-pink-500/30", dot: "bg-pink-500", label: "Uni", fullLabel: "Unichain" },
};

const DEFAULT_STYLE = { bg: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30", dot: "bg-zinc-500", label: "?", fullLabel: "?" };

export function ChainBadge({ chain }: { chain: string }) {
  const style = CHAIN_STYLES[chain] || DEFAULT_STYLE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border ${style.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {style.fullLabel}
    </span>
  );
}

export { CHAIN_STYLES };
