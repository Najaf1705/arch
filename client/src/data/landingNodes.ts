import type { Node } from "@xyflow/react";
import type { CustomNodeData } from "../types/NodeTypes";

const initialNodes: Node[] = [
    {
  id: "name",
  type: "formInput",
  position: { x: 40, y: 260 },
  data: {
    label: "Name",
    value: "Najaf",
    // onChange: v =>
    //   setFormData(d => ({ ...d, profession: v.slice(0, 15) }))
  },
},
  {
  id: "age",
  type: "formInput",
  position: { x: 40, y: 140 },
  data: {
    label: "Age",
    value: 22,
    // onChange: v =>
    //   setFormData(d => ({ ...d, age: Math.min(Number(v || 0), 100) }))
  },
},
{
  id: "profession",
  type: "formInput",
  position: { x: 40, y: 260 },
  data: {
    label: "Profession",
    value: "Software Engineer",
    // onChange: v =>
    //   setFormData(d => ({ ...d, profession: v.slice(0, 15) }))
  },
}

];

export default initialNodes;
