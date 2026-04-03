"use client";

import { useState } from "react";
import { StatsBar } from "@/components/stats-bar";
import { TopGames } from "@/components/top-games";
import { ContestedGames } from "@/components/contested-games";
import { GameTable } from "@/components/game-table";

export default function Home() {
  const [chain, setChain] = useState("");

  return (
    <div>
      <StatsBar selectedChain={chain} onChainSelect={setChain} />
      <TopGames chain={chain} />
      <div className="separator my-1" />
      <div className="flex flex-col lg:flex-row lg:divide-x divide-terminal-border min-h-0">
        <div className="lg:w-3/5 lg:overflow-auto">
          <ContestedGames chain={chain} />
        </div>
        <div className="lg:w-2/5 lg:overflow-auto border-t lg:border-t-0 border-terminal-border">
          <GameTable chain={chain} />
        </div>
      </div>
    </div>
  );
}
