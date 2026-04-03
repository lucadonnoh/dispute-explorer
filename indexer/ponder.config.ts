import { createConfig } from "ponder";
import { http, parseAbiItem } from "viem";
import { DisputeGameFactoryAbi } from "./abis/DisputeGameFactory";
import { FaultDisputeGameAbi } from "./abis/FaultDisputeGame";

const disputeGameCreatedEvent = parseAbiItem(
  "event DisputeGameCreated(address indexed disputeProxy, uint32 indexed gameType, bytes32 indexed rootClaim)"
);

// Add new chains here — everything else is generated automatically
const CHAINS = [
  { name: "optimism", factory: "0xe5965Ab5962eDc7477C8520243A95517CD252fA9", startBlock: 19469529 },
  { name: "base", factory: "0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e", startBlock: 19469529 },
  { name: "ink", factory: "0x10d7B35078d3baabB96Dd45a9143B94be65b12CD", startBlock: 21401266 },
  { name: "unichain", factory: "0x2F12d621a16e2d3285929C9996f478508951dFe4", startBlock: 21401266 },
] as const;

const contracts: Record<string, any> = {};

for (const chain of CHAINS) {
  const pascal = chain.name.charAt(0).toUpperCase() + chain.name.slice(1);

  contracts[`${pascal}DisputeGameFactory`] = {
    abi: DisputeGameFactoryAbi,
    chain: "mainnet",
    address: chain.factory,
    startBlock: chain.startBlock,
  };

  contracts[`${pascal}FaultDisputeGame`] = {
    abi: FaultDisputeGameAbi,
    chain: "mainnet",
    factory: {
      address: chain.factory,
      event: disputeGameCreatedEvent,
      parameter: "disputeProxy",
    },
    startBlock: chain.startBlock,
  };
}

export default createConfig({
  chains: {
    mainnet: {
      id: 1,
      rpc: http(process.env.PONDER_RPC_URL_1),
    },
  },
  contracts,
});

// Export chain names for use in event handlers
export const CHAIN_NAMES = CHAINS.map((c) => c.name);
export const FACTORY_TO_CHAIN: Record<string, string> = {};
for (const c of CHAINS) {
  FACTORY_TO_CHAIN[c.factory.toLowerCase()] = c.name;
}
