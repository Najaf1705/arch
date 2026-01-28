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

import PublicOnlyRoute from "./routing/PublicOnlyRoute";
import VerifyOtp from "./pages/VerifyOtp";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🚫 AUTH PAGES — block if already logged in */}
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
          path="/setPass"
          element={
            <PublicOnlyRoute>
              <SetPassword />
            </PublicOnlyRoute>
          }
        />

        {/* 🌍 PUBLIC PAGES — accessible to everyone */}
        <Route path="/" element={<Flow />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
