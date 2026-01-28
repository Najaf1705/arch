import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logoutThunk } from "../redux/auth/authThunks";
import { Navigate } from "react-router-dom";

export function Profile() {
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();

  console.log(useAppSelector((state) => state.auth));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Sync Redux → local state
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhotoUrl(user.profilePicture ?? "");
    }
  }, [user]);

  const handleSave = () => {
    console.log({ name, email, photoUrl });
  };

  const handleCancel = () => {
    if (!user) return;
    setName(user.name ?? "");
    setEmail(user.email ?? "");
    setPhotoUrl(user.profilePicture ?? "");
  };

  const logout = async () => {
    await dispatch(logoutThunk());
    // no navigate, no fetchMe, no drama
  };

  // ⛔ auth still resolving
  if (status === "loading" || status === "idle") {
    return <div>Loading profile...</div>;
  }

  // ⛔ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
      <div className="w-full max-w-[520px] rounded-xl bg-c1 border border-border p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6">Profile</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full p-1 bg-c4">
            <img
              src={photoUrl || "/avatar.png"}
              alt="Profile"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="h-28 w-28 rounded-full object-cover bg-c6"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm mb-1 block text-foreground/80">
            Name
          </label>
          <input
            className="input bg-c4 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-c9"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm mb-1 block text-foreground/80">
            Email
          </label>
          <input
            className="input bg-c5 text-foreground border border-border opacity-80 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>

        {/* Photo URL */}
        <div className="mb-6">
          <label className="text-sm mb-1 block text-foreground/80">
            Profile Picture URL
          </label>
          <input
            className="input bg-c4 text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-c9"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-md bg-c6 text-foreground hover:bg-c5 transition">
            Cancel
          </button>

          <button className="px-4 py-2 rounded-md bg-c9 text-white hover:opacity-90 transition">
            Save
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-c10 text-white hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>

  );
}
