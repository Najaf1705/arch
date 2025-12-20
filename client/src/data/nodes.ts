import type { Node } from "@xyflow/react";
import type { CustomNodeData } from "../types/NodeTypes";

const initialNodes: Node<CustomNodeData>[] = [
  {
    id: '0',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: {
      label: 'Node 1',
      kind: 'default',
      meta: {},
    },
  },
  {
    id: '1',
    type: 'customNode',
    position: { x: 200, y: 200 },
    data: {
      label: 'Node 2',
      kind: 'default',
      meta: {},
    },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 300, y: 300 },
    data: {
      label: 'Node 3',
      kind: 'default',
      meta: {},
    },
  },
];

export default initialNodes;
