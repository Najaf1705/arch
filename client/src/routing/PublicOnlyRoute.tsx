import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { ReactNode } from "react";

export default function PublicOnlyRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, status } = useAppSelector((state) => state.auth);

  // Auth state not resolved yet → wait
  if (status === "idle" || status === "loading") {
    return <div>Checking authentication...</div>;
  }

  // User is logged in → kick them out
  if (user) {
    return <Navigate to="/profile" replace />;
  }

  // User is NOT logged in → allow
  return children;
}