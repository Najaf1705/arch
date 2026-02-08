import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  Background,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* =======================
   TYPES
======================= */

type FormData = {
  name: string;
  age: number;
  profession: string;
};

type FormContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

/* =======================
   CONTEXT
======================= */

const FormContext = createContext<FormContextType | null>(null);

function useForm() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("FormContext missing");
  return ctx;
}

/* =======================
   NODES
======================= */

// function FormInputNode({ data }: any) {
//   const { field, label } = data;
//   const { formData, setFormData } = useForm();

//   return (
//     <div className="bg-c6 border rounded-lg p-3 w-[180px] text-sm">
//       <div className="font-semibold mb-1">{label}</div>

//       <input
//         type={field === "age" ? "number" : "text"}
//         inputMode={field === "age" ? "numeric" : "text"}
//         className="border rounded px-2 py-1 w-full nodrag"
//         value={formData[field as keyof FormData]}
//         onChange={(e) => {
//           const v = e.target.value;

//           if (field === "age") {
//             const n = Math.min(Math.max(Number(v || 0), 0), 100);
//             setFormData((d) => ({ ...d, age: n }));
//           } else {
//             setFormData((d) => ({
//               ...d,
//               [field]: v.slice(0, 15),
//             }));
//           }
//         }}
//       />

//       <Handle type="source" position={Position.Right} />
//     </div>
//   );
// }

// function HeroCardNode() {
//   const { formData } = useForm();

//   return (
//     <div className="bg-c3 border rounded-xl p-4 w-65 text-sm">
//       <div className="font-bold mb-2 border-b pb-1">
//         User Profile
//       </div>

//       <div className="space-y-1">
//         <div><b>Name:</b> {formData.name}</div>
//         <div><b>Age:</b> {formData.age}</div>
//         <div><b>Profession:</b> {formData.profession}</div>
//       </div>

//       <Handle id="h1" type="target" position={Position.Left} style={{ top: 28 }} />
//       <Handle id="h2" type="target" position={Position.Left} style={{ top: 56 }} />
//       <Handle id="h3" type="target" position={Position.Left} style={{ top: 84 }} />
//     </div>
//   );
// }

/* =======================
   RESPONSIVE VIEWPORT
======================= */

// function ResponsiveViewport() {
//   const { setViewport } = useReactFlow();

//   useEffect(() => {
//     let raf: number;

//     const update = () => {
//       cancelAnimationFrame(raf);

//       raf = requestAnimationFrame(() => {
//         const w = window.innerWidth;

//         if (w >= 1280) {
//           setViewport({ x: 920, y: 220, zoom: 1.2 });
//         } else if (w >= 1100) {
//           setViewport({ x: 100000, y: 120, zoom: 1 });
//         } else if (w >= 768) {
//           setViewport({ x: 200, y: 460, zoom: 0.5 });
//         } else {
//           setViewport({ x: 0, y: 460, zoom: 0.65 });
//         }
//       });
//     };

//     // ⬅️ WAIT A TICK AFTER FLOW IS READY
//     const timeout = setTimeout(update, 0);

//     window.addEventListener("resize", update);

//     return () => {
//       clearTimeout(timeout);
//       cancelAnimationFrame(raf);
//       window.removeEventListener("resize", update);
//     };
//   }, [setViewport]);

//   return null;
// }

/* =======================
   MAIN FLOW
======================= */

export default function EgFlow() {
  const [formData, setFormData] = useState<FormData>({
    name: "Najaf",
    age: 22,
    profession: "Software Engineer",
  });

  const initialNodes: Node[] = [
    {
      id: "name",
      type: "formInput",
      position: { x: 40, y: 40 },
      data: { field: "name", label: "Name" },
    },
    {
      id: "age",
      type: "formInput",
      position: { x: 40, y: 140 },
      data: { field: "age", label: "Age" },
    },
    {
      id: "profession",
      type: "formInput",
      position: { x: 40, y: 240 },
      data: { field: "profession", label: "Profession" },
    },
    {
      id: "hero",
      type: "heroCard",
      position: { x: 360, y: 140 },
      data: {},
    },
  ];

  const initialEdges: Edge[] = [
    { id: "e1", source: "name", target: "hero", targetHandle: "h1", animated: true },
    { id: "e2", source: "age", target: "hero", targetHandle: "h2", animated: true },
    { id: "e3", source: "profession", target: "hero", targetHandle: "h3", animated: true },
  ];

  const [nodes, , onNodesChange] = useNodesState([]);
  const [edges] = useEdgesState([]);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      <ReactFlowProvider>
        <div className="w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            // nodeTypes={{
            //   formInput: FormInputNode,
            //   heroCard: HeroCardNode,
            // }}
            nodesDraggable
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            selectionOnDrag={false}
          >
            {/* <ResponsiveViewport /> */}
            <Background
              id="cross2"
              gap={50}
              color="green"
              variant={BackgroundVariant.Cross}
            />
            <Background
              id="cross3"
              gap={100}
              color="red"
              variant={BackgroundVariant.Cross}
            />
            <Background
              id="cross1"
              gap={150}
              color="blue"
              variant={BackgroundVariant.Cross}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </FormContext.Provider>
  );
}
