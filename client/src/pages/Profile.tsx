import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutThunk } from "../redux/auth/authThunks";
import { Navigate } from "react-router-dom";

export function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhotoUrl(user.profilePicture ?? "");
    }
  }, [user]);

  const logout = async () => {
    await dispatch(logoutThunk());
  };

  if (status === "loading" || status === "idle") {
    return <div className="p-8">Loading profile...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center gap-6">

      {/* Avatar */}
      <img
        src={photoUrl || "/avatar.png"}
        alt="Profile"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className="h-32 w-32 rounded-full object-cover bg-c6"
      />

      {/* Name */}
      <h1 className="text-2xl font-semibold">{name}</h1>

      {/* Email */}
      <p className="text-foreground/70">{email}</p>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-6 px-6 py-2 rounded-md bg-c10 text-white hover:opacity-90 transition"
      >
        Logout
      </button>

    </div>
  );
}