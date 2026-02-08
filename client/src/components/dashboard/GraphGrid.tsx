import GraphCard from "./GraphCard";
import EmptyState from "./EmptyState";


interface Graph {
  id: string;
  name: string;
  description?: string;
  nodes: number;
  edges: number;
  updatedAt: string;
}

const graphs: Graph[] = [
  {
    id: "g1",
    name: "Social Network",
    description: "User relationships graph",
    nodes: 420,
    edges: 980,
    updatedAt: "1 day ago",
  },
  {
    id: "g2",
    name: "Service Dependency",
    description: "Microservice DAG",
    nodes: 72,
    edges: 140,
    updatedAt: "3 hrs ago",
  },
];

const GraphGrid: React.FC = () => {
  if (graphs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {graphs.map((graph) => (
        <GraphCard key={graph.id} graph={graph} />
      ))}
    </div>
  );
};

export default GraphGrid;
