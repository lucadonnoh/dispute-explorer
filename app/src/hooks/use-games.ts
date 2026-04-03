"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchGames, fetchGame, fetchGameClaims, fetchStats } from "@/lib/api";
import type { PaginatedGames, Game, ClaimData, Stats } from "@/lib/types";

export function useGames(params?: {
  chain?: string;
  status?: string;
  page?: number;
  limit?: number;
  contested?: boolean;
  sort?: string;
}) {
  const { data, isLoading } = useQuery<PaginatedGames>({
    queryKey: ["games", params?.chain, params?.status, params?.page, params?.limit, params?.contested, params?.sort],
    queryFn: () => fetchGames(params),
    refetchInterval: 30_000,
  });

  return {
    games: data?.data ?? [],
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    total: data?.total ?? 0,
    isLoading,
  };
}

export function useGame(id: string) {
  const { data, isLoading } = useQuery<Game>({
    queryKey: ["game", id],
    queryFn: () => fetchGame(id),
    refetchInterval: 30_000,
  });

  return { game: data, isLoading };
}

export function useClaims(id: string, enabled: boolean) {
  const { data, isLoading } = useQuery<ClaimData[]>({
    queryKey: ["claims", id],
    queryFn: () => fetchGameClaims(id),
    enabled,
  });

  return { claims: data ?? [], isLoading };
}

export function useStats() {
  const { data, isLoading } = useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: fetchStats,
    refetchInterval: 30_000,
  });

  return { stats: data, isLoading };
}
