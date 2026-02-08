interface GraphCardProps {
    graph: {
        id: string;
        name: string;
        description?: string;
        nodes: number;
        edges: number;
        updatedAt: string;
    }
}

const GraphCard= ({graph}:GraphCardProps ) => {
  return (
    <div className="rounded-xl border p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{graph.name}</h3>
        <button className="text-muted-foreground">⋮</button>
      </div>

      {graph.description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {graph.description}
        </p>
      )}

      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span>{graph.nodes} nodes</span>
        <span>{graph.edges} edges</span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs">{graph.updatedAt}</span>
        <button className="px-3 py-1 text-sm rounded-md bg-primary text-foreground">
          Open
        </button>
      </div>
    </div>
  );
};

export default GraphCard;
