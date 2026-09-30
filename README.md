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

Runs on `eth-node`, the home server that also runs the Erigon archive node,
with Docker Compose (`deploy/docker-compose.yml`): Postgres, the indexer and
the app, all on loopback. The indexer reads from Erigon directly, with no
public RPCs involved.

```bash
./deploy/deploy.sh   # rsyncs the working tree to eth-node and rebuilds
```

Traffic path: Cloudflare → tunnel (cloudflared on the rpi) → Caddy on eth-node
(`deploy/caddy/disputes.caddy`) → app, with `/api/*` going to the indexer.

One-time host setup, already done:
- `deploy/.env` on the host with `POSTGRES_PASSWORD`
- `deploy/caddy/disputes.caddy` installed as `/etc/caddy/conf.d/disputes-public.caddy`
- a ufw rule admitting only the rpi to port 15103
- a `disputes.slopo.net` ingress rule in the rpi's `/etc/cloudflared/config.yml`

Monitoring: two Uptime Kuma monitors on the rpi notify ntfy (`homelab`).
"Disputes explorer (public)" checks the site end to end. "Disputes indexer
freshness" reads `/api/status` and goes down if the indexer is unreachable or
its latest block is more than 15 minutes old.

Changing `ponder.schema.ts`, the `contracts` in `ponder.config.ts` or any file
under `indexer/src/` except `src/api/` changes Ponder's build ID. The indexer
then refuses the existing schema. Bump `DATABASE_SCHEMA` in the compose file
when that happens; the new schema rebuilds from the `ponder_sync` cache in a
few minutes. Restarts take about 20s while Ponder waits out its schema lock.

## Environment variables

**Indexer:**
- `PONDER_RPC_URL_1`: Ethereum L1 RPC endpoint (archive node)
- `PONDER_RPC_FALLBACK_URLS`: optional comma-separated fallback RPCs (see `indexer/rpc.ts` before adding any)
- `DATABASE_URL`, `DATABASE_SCHEMA`: PostgreSQL connection and schema (production only)

**App:**
- `NEXT_PUBLIC_INDEXER_URL`: Indexer API URL, baked in at build time (`/api` in production)

## License

MIT
