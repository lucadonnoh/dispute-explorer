import { onchainTable, index } from "ponder";

export const game = onchainTable(
  "game",
  (t) => ({
    id: t.text().primaryKey(), // game proxy address
    chain: t.text().notNull(), // "optimism" | "base"
    gameType: t.integer().notNull(), // 0 = FaultDisputeGame, 1 = PermissionedDisputeGame
    rootClaim: t.hex().notNull(),
    status: t.integer().notNull().default(0), // 0 = IN_PROGRESS, 1 = CHALLENGER_WINS, 2 = DEFENDER_WINS
    l1BlockNumber: t.bigint().notNull(),
    createdAt: t.bigint().notNull(), // block timestamp
    resolvedAt: t.bigint(), // block timestamp when resolved
    moveCount: t.integer().notNull().default(0),
    createdTxHash: t.hex().notNull(),
    resolvedTxHash: t.hex(),
  }),
  (table) => ({
    chainIdx: index().on(table.chain),
    statusIdx: index().on(table.status),
  })
);

export const move = onchainTable(
  "move",
  (t) => ({
    id: t.text().primaryKey(), // gameAddress-moveIndex
    gameId: t.text().notNull(), // game proxy address
    moveIndex: t.integer().notNull(), // sequential index within the game
    parentIndex: t.bigint().notNull(),
    claim: t.hex().notNull(),
    claimant: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    txHash: t.hex().notNull(),
  }),
  (table) => ({
    gameIdx: index().on(table.gameId),
  })
);
