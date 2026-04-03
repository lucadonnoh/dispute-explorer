export function truncateAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function truncateHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-4)}`;
}

export function formatTimestamp(ts: string): string {
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(ts: string): string {
  const seconds = Math.floor(Date.now() / 1000 - Number(ts));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function etherscanUrl(txHash: string): string {
  return `https://etherscan.io/tx/${txHash}`;
}

export function etherscanAddressUrl(address: string): string {
  return `https://etherscan.io/address/${address}`;
}
