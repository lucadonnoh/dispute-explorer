export const DisputeGameFactoryAbi = [
  {
    type: "event",
    name: "DisputeGameCreated",
    inputs: [
      { name: "disputeProxy", type: "address", indexed: true },
      { name: "gameType", type: "uint32", indexed: true },
      { name: "rootClaim", type: "bytes32", indexed: true },
    ],
  },
  {
    type: "function",
    name: "gameCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "gameAtIndex",
    inputs: [{ name: "_index", type: "uint256" }],
    outputs: [
      { name: "gameType_", type: "uint32" },
      { name: "timestamp_", type: "uint64" },
      { name: "proxy_", type: "address" },
    ],
    stateMutability: "view",
  },
] as const;
