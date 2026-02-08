import React, { useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNavigate, useLocation } from "react-router-dom";

/* ======================
   NODES
====================== */

function TextNode({ data }: any) {
  return (
    <div className="bg-c6 border rounded-xl px-4 py-2 text-sm">
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

function ErrorNode({ data }: any) {
  return (
    <div className="bg-c3 border-2 border-dashed rounded-2xl p-6 text-center">
      <div className="text-6xl font-extrabold">404</div>
      <div className="text-sm mt-2 text-muted-foreground">
        Page Not Found
      </div>

      <Handle type="target" position={Position.Left} style={{ top: "50%" }} />
      <Handle type="source" position={Position.Right} style={{ top: "50%" }} />
    </div>
  );
}

function HomeNode() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="cursor-pointer bg-pink-500 text-white font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition"
    >
      Go Home →
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

/* ======================
   RESPONSIVE CAMERA
====================== */

function ResponsiveViewport() {
  const { setViewport, getViewport, fitView } = useReactFlow();

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const w = window.innerWidth;

        // smooth, proportional values (no hard jumps)
        let targetX = 0;
        let targetY = 0;
        let targetZoom = 1;

        if (w >= 1280) {
          targetX = 1000;
          targetY = 1000;
          targetZoom = 10;
        } else if (w >= 1024) {
          targetX = 700;
          targetY = 240;
          targetZoom = 0.95;
        } else if (w >= 768) {
          targetX = 400;
          targetY = 380;
          targetZoom = 0.9;
        } else {
          targetX = 120;
          targetY = 520;
          targetZoom = 0.75;
        }

        const current = getViewport();

        // interpolate instead of snapping
        setViewport(
          {
            x: current.x + (targetX - current.x) * 0.15,
            y: current.y + (targetY - current.y) * 0.15,
            zoom: current.zoom + (targetZoom - current.zoom) * 0.15,
          },
          { duration: 300 }
        );
      });
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", update);
    };
  }, [setViewport, getViewport]);

  return null;
}


/* ======================
   MAIN PAGE
====================== */

export default function NotFoundFlow() {
  const location = useLocation();

  const nodes: Node[] = [
    {
      id: "lost",
      type: "text",
      position: { x: 0, y: 120 },
      data: { label: "Request lost" }
    },
    {
      id: "route",
      type: "text",
      position: { x: 0, y: 220 },
      data: { label: `URL: ${location.pathname}` }
    },
    {
      id: "404",
      type: "error",
      position: { x: 240, y: 140 },
      data: {}
    },
    {
      id: "home",
      type: "home",
      position: { x: 520, y: 220 },
      data: {}
    }
  ];

  const edges: Edge[] = [
    { id: "e1", source: "lost", target: "404", animated: true },
    { id: "e2", source: "route", target: "404", animated: true },
    { id: "e3", source: "404", target: "home", animated: true }
  ];

  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            text: TextNode,
            error: ErrorNode,
            home: HomeNode
          }}
          nodesDraggable     // 😄 let users drag in frustration
          panOnDrag
          zoomOnScroll={false}
          zoomOnPinch={false}
          selectionOnDrag={false}
        >
          <ResponsiveViewport />
          <Background color={`rgb(var(--foreground))`} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
