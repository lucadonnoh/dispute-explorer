import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "ponder:api";
import { game, move } from "ponder:schema";
import { eq, desc, and, gt, sql } from "ponder";
import { createPublicClient, http, getAddress } from "viem";
import { mainnet } from "viem/chains";
import { FaultDisputeGameAbi } from "../../abis/FaultDisputeGame";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.PONDER_RPC_URL_1),
});

const app = new Hono();

app.use("/*", cors());

// All games, with optional filters: ?chain=optimism|base&status=0|1|2
app.get("/games", async (c) => {
  const chain = c.req.query("chain");
  const status = c.req.query("status");

  const contested = c.req.query("contested");

  const conditions = [];
  if (chain) conditions.push(eq(game.chain, chain));
  if (status !== undefined && status !== "")
    conditions.push(eq(game.status, Number(status)));
  if (contested === "true") conditions.push(gt(game.moveCount, 0));
  if (contested === "false") conditions.push(eq(game.moveCount, 0));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const page = Math.max(1, Number(c.req.query("page") || 1));
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") || 25)));
  const offset = (page - 1) * limit;

  const sortBy = c.req.query("sort");
  const orderBy = sortBy === "moves" ? desc(game.moveCount) : desc(game.createdAt);

  const [games, countResult] = await Promise.all([
    db
      .select()
      .from(game)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)`.as("total") })
      .from(game)
      .where(where),
  ]);

  const total = Number(countResult[0]?.total ?? 0);

  return c.json({
    data: games.map((g) => ({
      ...g,
      l1BlockNumber: g.l1BlockNumber.toString(),
      createdAt: g.createdAt.toString(),
      resolvedAt: g.resolvedAt?.toString() ?? null,
    })),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

// Single game by address
app.get("/games/:id", async (c) => {
  const id = c.req.param("id").toLowerCase();
  const g = await db.select().from(game).where(eq(game.id, id)).limit(1);

  if (g.length === 0) return c.json({ error: "Game not found" }, 404);

  const result = g[0];
  return c.json({
    ...result,
    l1BlockNumber: result.l1BlockNumber.toString(),
    createdAt: result.createdAt.toString(),
    resolvedAt: result.resolvedAt?.toString() ?? null,
  });
});

// Moves for a game
app.get("/games/:id/moves", async (c) => {
  const gameId = c.req.param("id").toLowerCase();
  const moves = await db
    .select()
    .from(move)
    .where(eq(move.gameId, gameId))
    .orderBy(move.timestamp, move.moveIndex);

  return c.json(
    moves.map((m) => ({
      ...m,
      parentIndex: m.parentIndex.toString(),
      timestamp: m.timestamp.toString(),
    }))
  );
});

// Stats summary
app.get("/stats", async (c) => {
  const rows = await db
    .select({
      chain: game.chain,
      status: game.status,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(game)
    .groupBy(game.chain, game.status);

  const stats: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    if (!stats[row.chain]) stats[row.chain] = {};
    const label =
      row.status === 0
        ? "active"
        : row.status === 1
          ? "challenger_wins"
          : "defender_wins";
    stats[row.chain][label] = Number(row.count);
  }

  return c.json(stats);
});

// On-chain claim data for a game (direct contract reads)
app.get("/games/:id/claims", async (c) => {
  const gameAddress = c.req.param("id").toLowerCase() as `0x${string}`;

  const claimCount = await publicClient.readContract({
    address: gameAddress,
    abi: FaultDisputeGameAbi,
    functionName: "claimDataLen",
  });

  const len = Number(claimCount);
  const claims = await Promise.all(
    Array.from({ length: len }, (_, i) =>
      publicClient.readContract({
        address: gameAddress,
        abi: FaultDisputeGameAbi,
        functionName: "claimData",
        args: [BigInt(i)],
      })
    )
  );

  return c.json(
    claims.map((claim, i) => ({
      index: i,
      parentIndex: claim[0],
      counteredBy: claim[1],
      claimant: claim[2],
      bond: claim[3].toString(),
      claim: claim[4],
      position: claim[5].toString(),
      clock: claim[6].toString(),
    }))
  );
});

export default app;
