export const API_BASE =
  process.env.NEXT_PUBLIC_INDEXER_URL || "http://localhost:42069";

export async function fetchGames(params?: {
  chain?: string;
  status?: string;
  page?: number;
  limit?: number;
  contested?: boolean;
  sort?: string;
}) {
  const search = new URLSearchParams();
  if (params?.chain) search.set("chain", params.chain);
  if (params?.status !== undefined && params.status !== "")
    search.set("status", params.status);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.contested !== undefined)
    search.set("contested", String(params.contested));
  if (params?.sort) search.set("sort", params.sort);

  const url = `${API_BASE}/games${search.toString() ? `?${search}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch games");
  return res.json();
}

export async function fetchGame(id: string) {
  const res = await fetch(`${API_BASE}/games/${id}`);
  if (!res.ok) throw new Error("Failed to fetch game");
  return res.json();
}

export async function fetchGameMoves(id: string) {
  const res = await fetch(`${API_BASE}/games/${id}/moves`);
  if (!res.ok) throw new Error("Failed to fetch moves");
  return res.json();
}

export async function fetchGameClaims(id: string) {
  const res = await fetch(`${API_BASE}/games/${id}/claims`);
  if (!res.ok) throw new Error("Failed to fetch claims");
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
