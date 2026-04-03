"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGameMoves } from "@/lib/api";
import type { Move } from "@/lib/types";

export function useMoves(gameId: string) {
  const { data, isLoading } = useQuery<Move[]>({
    queryKey: ["moves", gameId],
    queryFn: () => fetchGameMoves(gameId),
    enabled: !!gameId,
  });

  return { moves: data ?? [], isLoading };
}
