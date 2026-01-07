export type NodeRect = { x: number; y: number; width: number; height: number };

export type NodeCenter = {
  x: number;
  y: number;
  leftX: number;
  rightX: number;
};

export type NodeCenters = Record<string, NodeCenter>;

export type Edge = { from: NodeCenter; to: NodeCenter; key: string };
