"use client";

import { use } from "react";
import { GameDetail } from "@/components/game-detail";

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <GameDetail id={id} />;
}
