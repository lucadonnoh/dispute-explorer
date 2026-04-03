# Dispute Explorer

Explore active and past OP Stack fault proof dispute games across Optimism, Base, Ink, and Unichain.

Live at [disputes.slopo.net](https://disputes.slopo.net)

## What it does

- Indexes `DisputeGameFactory` and `FaultDisputeGame` events from Ethereum L1
- Tracks game creation, moves, and resolution across multiple OP Stack chains
- Visualizes dispute trees with on-chain claim resolution data (`counteredBy`, bonds, chess clocks)
- Shows which claims were countered vs uncountered using bottom-up resolution logic

## Architecture

```
indexer/          Ponder blockchain indexer
├── ponder.config.ts   Chain + contract config (add new chains here)
├── ponder.schema.ts   game + move tables
├── src/index.ts       Event handlers
└── src/api/index.ts   REST API + on-chain claim reads

app/              Next.js frontend
├── src/app/           Pages (home + game detail)
└── src/components/    UI components + dispute tree visualization
```

## Adding a new chain

1. Add an entry to the `CHAINS` array in `indexer/ponder.config.ts`:
```ts
{ name: "mychain", factory: "0x...", startBlock: 12345678 },
```

2. Add a color entry in `app/src/components/chain-badge.tsx`:
```ts
mychain: { bg: "...", dot: "...", label: "MC", fullLabel: "My Chain" },
```

Everything else (event handlers, API, UI filters) is generated automatically.

## Development

```bash
# Indexer
cd indexer
cp .env.local.example .env.local  # set PONDER_RPC_URL_1
npm install
npm run dev                        # runs on :42069

# Frontend
cd app
npm install
npm run dev                        # runs on :3000
```

## Deployment

Deployed on Railway with PostgreSQL. See `Dockerfile` in each directory.

```bash
# Deploy indexer
cd indexer && railway up . --service indexer --path-as-root

# Deploy app
cd app && railway up . --service app --path-as-root
```

## Environment variables

**Indexer:**
- `PONDER_RPC_URL_1` — Ethereum L1 RPC endpoint
- `DATABASE_URL` — PostgreSQL connection string (production only)

**App:**
- `NEXT_PUBLIC_INDEXER_URL` — Indexer API URL

## License

MIT
