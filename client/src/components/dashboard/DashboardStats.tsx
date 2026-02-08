interface StatProps {
  label: string;
  value: string | number;
}

const Stat: React.FC<StatProps> = ({ label, value }) => {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="Total Graphs" value={8} />
      <Stat label="Total Nodes" value={1240} />
      <Stat label="Total Edges" value={3560} />
      <Stat label="Last Updated" value="2 hrs ago" />
    </div>
  );
};

export default DashboardStats;
