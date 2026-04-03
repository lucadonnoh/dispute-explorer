"use client";

import { useRef, useEffect } from "react";
import type { ClaimData, Game, Move } from "@/lib/types";
import { truncateHash, etherscanUrl } from "@/lib/utils";

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

type TreeNode = {
  index: number;
  claim: string;
  claimant: string;
  counteredBy: string;
  position: bigint;
  bond: bigint;
  clockDuration: number; // seconds accumulated
  txHash: string;
  depth: number;
  children: TreeNode[];
  countered: boolean;
  isAttack: boolean;
  x: number;
  y: number;
  subtreeWidth: number;
};

const NODE_W = 140;
const NODE_H = 58;
const H_GAP = 16;
const V_GAP = 56;
const ARROW_SIZE = 6;

const COLOR_UNCOUNTERED = {
  fill: "rgba(34, 197, 94, 0.15)",
  stroke: "#22c55e",
  text: "#4ade80",
};
const COLOR_COUNTERED = {
  fill: "rgba(239, 68, 68, 0.15)",
  stroke: "#ef4444",
  text: "#f87171",
};
const COLOR_PENDING = {
  fill: "rgba(234, 179, 8, 0.15)",
  stroke: "#eab308",
  text: "#facc15",
};

function formatBond(wei: bigint): string {
  const eth = Number(wei) / 1e18;
  if (eth >= 1) return `${eth.toFixed(2)} ETH`;
  if (eth >= 0.01) return `${eth.toFixed(4)} ETH`;
  return `${eth.toFixed(6)} ETH`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

// Position is a gindex. Even position = attack, odd = defend (except root)
function isAttackMove(position: bigint): boolean {
  return position % BigInt(2) === BigInt(0);
}

// Clock is packed: upper 64 bits = duration, lower 64 bits = timestamp
function unpackClockDuration(clock: string): number {
  const packed = BigInt(clock);
  return Number(packed >> BigInt(64));
}

function buildTree(_game: Game, claims: ClaimData[], txHashByIndex: Record<number, string>): TreeNode {
  const nodes: TreeNode[] = claims.map((c, i) => ({
    index: i,
    claim: c.claim,
    claimant: c.claimant,
    counteredBy: c.counteredBy,
    position: BigInt(c.position),
    bond: BigInt(c.bond),
    clockDuration: unpackClockDuration(c.clock),
    txHash: txHashByIndex[i] || "",
    depth: 0,
    children: [],
    countered: false, // computed after tree is built
    isAttack: i === 0 ? false : isAttackMove(BigInt(c.position)),
    x: 0,
    y: 0,
    subtreeWidth: 0,
  }));

  for (let i = 1; i < nodes.length; i++) {
    const parentIdx = claims[i].parentIndex;
    if (parentIdx < nodes.length) {
      nodes[parentIdx].children.push(nodes[i]);
    }
  }

  // BFS to set depths
  const queue = [nodes[0]];
  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const child of node.children) {
      child.depth = node.depth + 1;
      queue.push(child);
    }
  }

  // Resolve countered status: use on-chain counteredBy, then infer from tree
  resolveCountered(nodes[0]);

  return nodes[0];
}

// Bottom-up: a node is countered if it has on-chain counteredBy set,
// OR if any of its children are uncountered (tree inference)
function resolveCountered(node: TreeNode) {
  for (const child of node.children) {
    resolveCountered(child);
  }

  if (node.counteredBy !== ZERO_ADDR) {
    // On-chain confirmed
    node.countered = true;
  } else if (node.children.length > 0) {
    // Infer: countered if any child is uncountered
    node.countered = node.children.some((c) => !c.countered);
  } else {
    // Leaf with no on-chain counteredBy — uncountered
    node.countered = false;
  }
}

function computeLayout(node: TreeNode): number {
  if (node.children.length === 0) {
    node.subtreeWidth = NODE_W;
    return NODE_W;
  }

  let totalWidth = 0;
  for (const child of node.children) {
    totalWidth += computeLayout(child);
  }
  totalWidth += (node.children.length - 1) * H_GAP;

  node.subtreeWidth = Math.max(NODE_W, totalWidth);
  return node.subtreeWidth;
}

function assignPositions(node: TreeNode, left: number, top: number) {
  node.x = left + node.subtreeWidth / 2 - NODE_W / 2;
  node.y = top;

  let childLeft = left;
  for (const child of node.children) {
    assignPositions(child, childLeft, top + NODE_H + V_GAP);
    childLeft += child.subtreeWidth + H_GAP;
  }
}

function collectAll(
  node: TreeNode,
  nodes: TreeNode[],
  edges: { from: TreeNode; to: TreeNode }[]
) {
  nodes.push(node);
  for (const child of node.children) {
    edges.push({ from: node, to: child });
    collectAll(child, nodes, edges);
  }
}

export function MoveGraph({
  game,
  claims,
  moves,
}: {
  game: Game;
  claims: ClaimData[];
  moves: Move[];
}) {
  if (claims.length <= 1) {
    return (
      <div className="px-4 py-6 text-center text-xs text-terminal-muted">
        No moves to visualize
      </div>
    );
  }

  const isResolved = game.status === 1 || game.status === 2;

  // Sort moves by timestamp to match claimData ordering (index 1, 2, 3...)
  const sortedMoves = [...moves].sort((a, b) => {
    const tsDiff = Number(a.timestamp) - Number(b.timestamp);
    if (tsDiff !== 0) return tsDiff;
    return a.moveIndex - b.moveIndex;
  });
  // claimData[0] = root (use game.createdTxHash), claimData[1..n] = moves in order
  const txHashByIndex: Record<number, string> = { 0: game.createdTxHash };
  sortedMoves.forEach((m, i) => {
    txHashByIndex[i + 1] = m.txHash;
  });

  const root = buildTree(game, claims, txHashByIndex);
  computeLayout(root);
  assignPositions(root, 0, 0);

  const allNodes: TreeNode[] = [];
  const edges: { from: TreeNode; to: TreeNode }[] = [];
  collectAll(root, allNodes, edges);

  function getNodeColor(n: TreeNode) {
    if (n.countered) return COLOR_COUNTERED;
    if (!isResolved) return COLOR_PENDING;
    return COLOR_UNCOUNTERED;
  }

  const maxX = Math.max(...allNodes.map((n) => n.x + NODE_W));
  const maxY = Math.max(...allNodes.map((n) => n.y + NODE_H));
  const svgW = maxX + 20;
  const svgH = maxY + 20;
  const pad = 10;
  const topPad = isResolved ? 24 : pad;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  }, [claims]);

  return (
    <div ref={scrollRef} className="overflow-auto p-4">
      <svg
        width={svgW + pad * 2}
        height={svgH + topPad + pad}
        className="mx-auto"
      >
        <defs>
          <marker
            id="arrow-green"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <path
              d={`M0,0 L${ARROW_SIZE},${ARROW_SIZE / 2} L0,${ARROW_SIZE}`}
              fill="#22c55e"
            />
          </marker>
          <marker
            id="arrow-red"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <path
              d={`M0,0 L${ARROW_SIZE},${ARROW_SIZE / 2} L0,${ARROW_SIZE}`}
              fill="#ef4444"
            />
          </marker>
          <marker
            id="arrow-yellow"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE}
            refY={ARROW_SIZE / 2}
            orient="auto"
          >
            <path
              d={`M0,0 L${ARROW_SIZE},${ARROW_SIZE / 2} L0,${ARROW_SIZE}`}
              fill="#eab308"
            />
          </marker>
        </defs>

        <g transform={`translate(${pad}, ${topPad})`}>
          {/* Edges with attack/defend labels */}
          {edges.map((e, i) => {
            const x1 = e.from.x + NODE_W / 2;
            const y1 = e.from.y + NODE_H;
            const x2 = e.to.x + NODE_W / 2;
            const y2 = e.to.y;
            const midY = y1 + (y2 - y1) * 0.5;
            const color = getNodeColor(e.to);
            const markerId = !isResolved
              ? "arrow-yellow"
              : e.to.countered
                ? "arrow-red"
                : "arrow-green";
            const label = e.to.isAttack ? "attack" : "defend";

            return (
              <g key={i}>
                <path
                  d={`M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`}
                  fill="none"
                  stroke={color.stroke}
                  strokeWidth={1.5}
                  opacity={0.7}
                  markerEnd={`url(#${markerId})`}
                />
                <text
                  x={(x1 + x2) / 2 + (x1 === x2 ? 0 : x1 < x2 ? 10 : -10)}
                  y={midY - 4}
                  fill={color.stroke}
                  fontSize={8}
                  textAnchor="middle"
                  opacity={0.8}
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {allNodes.map((n) => {
            const isRoot = n.index === 0;
            const color = getNodeColor(n);
            const href = n.txHash
              ? etherscanUrl(n.txHash)
              : `https://etherscan.io/address/${n.claimant}`;

            return (
              <a
                key={n.index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ cursor: "pointer" }}
              >
                {/* Root outcome icon */}
                {isRoot && isResolved && (
                  <text
                    x={n.x + NODE_W / 2}
                    y={n.y - 6}
                    fontSize={16}
                    textAnchor="middle"
                    style={{ pointerEvents: "none" }}
                  >
                    {!root.countered ? "👑" : "💀"}
                  </text>
                )}
                <rect
                  x={n.x}
                  y={n.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={3}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth={1}
                  style={{ cursor: "pointer" }}
                />
                <rect
                  x={n.x}
                  y={n.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={3}
                  fill="white"
                  opacity={0}
                  style={{ cursor: "pointer" }}
                >
                  <set attributeName="opacity" to="0.05" begin="mouseover" end="mouseout" />
                </rect>
                <text
                  x={n.x + NODE_W / 2}
                  y={n.y + 13}
                  fill={color.text}
                  fontSize={10}
                  textAnchor="middle"
                  fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {isRoot ? "ROOT" : truncateHash(n.claim)}
                </text>
                <text
                  x={n.x + NODE_W / 2}
                  y={n.y + 26}
                  fill="#71717a"
                  fontSize={8}
                  textAnchor="middle"
                  fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                >
                  <tspan fill="#3f3f46">{isRoot ? "claim " : "by "}</tspan>
                  {isRoot ? truncateHash(n.claim) : truncateHash(n.claimant)}
                </text>
                <text
                  x={n.x + NODE_W / 2}
                  y={n.y + 40}
                  fill="#eab308"
                  fontSize={9}
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {formatBond(n.bond)}
                </text>
                <text
                  x={n.x + NODE_W / 2}
                  y={n.y + 52}
                  fill="#52525b"
                  fontSize={7}
                  textAnchor="middle"
                  fontFamily="monospace"
                  style={{ pointerEvents: "none" }}
                >
                  {n.clockDuration > 0
                    ? `⏱ ${formatDuration(n.clockDuration)} used`
                    : ""}
                </text>
              </a>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 justify-center text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm border"
            style={{
              backgroundColor: COLOR_UNCOUNTERED.fill,
              borderColor: COLOR_UNCOUNTERED.stroke,
            }}
          />
          <span className="text-green-400">Uncountered</span>
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 rounded-sm border"
            style={{
              backgroundColor: COLOR_COUNTERED.fill,
              borderColor: COLOR_COUNTERED.stroke,
            }}
          />
          <span className="text-red-400">Countered</span>
        </span>
        {!isResolved && (
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-sm border"
              style={{
                backgroundColor: COLOR_PENDING.fill,
                borderColor: COLOR_PENDING.stroke,
              }}
            />
            <span className="text-yellow-400">Pending</span>
          </span>
        )}
      </div>
    </div>
  );
}
