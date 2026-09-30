// Mainnet RPC endpoints. PONDER_RPC_URL_1 is the primary; in production that's
// the Erigon archive node running on the same host as the indexer.
// PONDER_RPC_FALLBACK_URLS is an optional comma-separated list of extra
// endpoints (e.g. https://gateway.tenderly.co/public/mainnet).
//
// Think twice before adding fallbacks: Ponder load-balances across *every* URL,
// not only when the primary is down, and a non-retryable error from any one of
// them (e.g. "method not available on this plan") crashes the indexer. That
// took the site down for six days in September 2026. A fallback must serve
// eth_getLogs (ranges + blockHash), eth_getBlockByNumber with full
// transactions, and eth_call without an API key. Known-bad: nodies.app (no
// full-tx blocks on the free plan), onfinality (constant 429s), publicnode
// (eth_getLogs gated behind a paid token).
//
// This file deliberately lives outside src/: Ponder hashes every file under
// src/ (except src/api/) into the build ID, so editing RPCs there would
// invalidate the database schema and force a full re-index.
const FALLBACK_RPC_URLS = (process.env.PONDER_RPC_FALLBACK_URLS ?? "")
  .split(",")
  .map((url) => url.trim());

export const RPC_URLS: string[] = [
  process.env.PONDER_RPC_URL_1,
  ...FALLBACK_RPC_URLS,
].filter((url): url is string => Boolean(url));
