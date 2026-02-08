import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { fetchMe } from "./redux/auth/authThunks";

import Login from "./pages/Login";
import Register from "./pages/Register";
import SetPassword from "./pages/SetPassword";
import Flow from "./flow/Flow";
import { Profile } from "./pages/Profile";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VerifyOtp from "./pages/VerifyOtp";
import NotFound from "./pages/NotFound";

import PublicOnlyRoute from "./routing/PublicOnlyRoute";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Everything below navbar */}
        <main className="flex-1 overflow-y-auto">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/graph" element={<Flow />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/verify-otp"
              element={
                <PublicOnlyRoute>
                  <VerifyOtp />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/set-password"
              element={
                <PublicOnlyRoute>
                  <SetPassword />
                </PublicOnlyRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
