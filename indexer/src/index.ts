import { ponder } from "ponder:registry";
import { game, move } from "ponder:schema";
import { FACTORY_TO_CHAIN } from "../ponder.config";

// ===== Factory event handlers (one per chain) =====

function handleGameCreated(chain: string) {
  return async ({ event, context }: any) => {
    await context.db.insert(game).values({
      id: event.args.disputeProxy.toLowerCase(),
      chain,
      gameType: event.args.gameType,
      rootClaim: event.args.rootClaim,
      status: 0,
      l1BlockNumber: event.block.number,
      createdAt: event.block.timestamp,
      moveCount: 0,
      createdTxHash: event.transaction.hash,
    });
  };
}

// ===== Shared move & resolution handlers =====

async function handleMove({ event, context }: any) {
  const gameId = event.log.address.toLowerCase();
  const moveId = `${event.transaction.hash}-${event.log.logIndex}`;

  const inserted = await context.db
    .insert(move)
    .values({
      id: moveId,
      gameId,
      moveIndex: event.log.logIndex,
      parentIndex: event.args.parentIndex,
      claim: event.args.claim,
      claimant: event.args.claimant,
      timestamp: event.block.timestamp,
      txHash: event.transaction.hash,
    })
    .onConflictDoNothing();

  if (inserted) {
    const existing = await context.db.find(game, { id: gameId });
    if (existing) {
      await context.db
        .update(game, { id: gameId })
        .set({ moveCount: existing.moveCount + 1 });
    }
  }
}

async function handleResolved({ event, context }: any) {
  const gameId = event.log.address.toLowerCase();
  const existing = await context.db.find(game, { id: gameId });
  if (existing) {
    await context.db.update(game, { id: gameId }).set({
      status: event.args.status,
      resolvedAt: event.block.timestamp,
      resolvedTxHash: event.transaction.hash,
    });
  }
}

// ===== Register handlers for all chains =====

const chains = ["Optimism", "Base", "Ink", "Unichain"];

for (const chain of chains) {
  const chainLower = chain.toLowerCase();

  ponder.on(
    `${chain}DisputeGameFactory:DisputeGameCreated` as any,
    handleGameCreated(chainLower)
  );

  ponder.on(`${chain}FaultDisputeGame:Move` as any, handleMove);
  ponder.on(`${chain}FaultDisputeGame:Resolved` as any, handleResolved);
}
