const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-xl font-semibold mb-2">
        No graphs yet
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Create your first graph to get started.
      </p>
      <button className="px-4 py-2 rounded-md bg-primary text-white">
        Create Graph
      </button>
    </div>
  );
};

export default EmptyState;
