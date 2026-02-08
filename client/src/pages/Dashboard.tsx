import DashboardStats from "../components/dashboard/DashboardStats";
import GraphGrid from "../components/dashboard/GraphGrid";
import CreateGraphButton from "../components/dashboard/CreateGraphButton";

const Dashboard: React.FC = () => {
  return (
    <div className="w-full p-6 bg-background pt-20">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Graphs</h1>
        <CreateGraphButton />
      </div>

      <DashboardStats />
      <GraphGrid />
    </div>
  );
};

export default Dashboard;
