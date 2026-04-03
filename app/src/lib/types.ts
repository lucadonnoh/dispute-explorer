export type GameStatus = 0 | 1 | 2;

export type Game = {
  id: string;
  chain: string;
  gameType: number;
  rootClaim: string;
  status: GameStatus;
  l1BlockNumber: string;
  createdAt: string;
  resolvedAt: string | null;
  moveCount: number;
  createdTxHash: string;
  resolvedTxHash: string | null;
};

export type Move = {
  id: string;
  gameId: string;
  moveIndex: number;
  parentIndex: string;
  claim: string;
  claimant: string;
  timestamp: string;
  txHash: string;
};

export type PaginatedGames = {
  data: Game[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ClaimData = {
  index: number;
  parentIndex: number;
  counteredBy: string;
  claimant: string;
  bond: string;
  claim: string;
  position: string;
  clock: string;
};

export type Stats = Record<
  string,
  { active?: number; challenger_wins?: number; defender_wins?: number }
>;

export const STATUS_LABELS: Record<GameStatus, string> = {
  0: "In Progress",
  1: "Challenger Wins",
  2: "Defender Wins",
};

export const GAME_TYPE_LABELS: Record<number, string> = {
  0: "Fault Dispute Game",
  1: "Permissioned Dispute Game",
};
