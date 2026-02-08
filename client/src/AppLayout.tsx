import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Everything below the navbar */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
