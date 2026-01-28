import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { fetchMe, googleLoginThunk } from "../redux/auth/authThunks";
import EyeToggle from "../components/EyeToggle";

const MIN_PASSWORD = 6;

export default function SetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const state = location.state as { idToken?: string } | null;
  const idToken = state?.idToken;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPassword = password.trim();
  const cleanConfirm = confirmPassword.trim();

  const isPasswordValid = cleanPassword.length >= MIN_PASSWORD;
  const doMatch = cleanPassword === cleanConfirm;

  const canSubmit = isPasswordValid && doMatch;

  /* ---------- GUARD ---------- */

  useEffect(() => {
    if (!idToken) {
      navigate("/login", { replace: true });
    }
  }, [idToken, navigate]);

  /* ---------- SUBMIT ---------- */

  async function submit() {
    setError(null);

    if (!idToken) return;

    if (!isPasswordValid) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!doMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(googleLoginThunk({idToken,password})).unwrap();

      await dispatch(fetchMe()).unwrap();
      navigate("/profile");

    } catch {
      setError("Could not complete signup");
    } finally {
      setLoading(false);
    }
  }

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="relative bg-c1 p-6 rounded-lg w-sm max-w-md shadow-lg border border-border">

        <div className={loading ? "pointer-events-none opacity-60" : ""}>

          <h2 className="text-xl font-semibold text-center mb-4">
            Create a password
          </h2>

          {/* PASSWORD */}

          <div className="relative mb-2">
            <input
              className="input pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <EyeToggle
              open={showPassword}
              onClick={() => setShowPassword(v => !v)}
            />
          </div>

          {password && !isPasswordValid && (
            <p className="text-xs mb-2 text-red-500">
              Minimum 6 characters
            </p>
          )}

          {/* CONFIRM */}

          <div className="relative mb-2">
            <input
              className="input pr-10"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <EyeToggle
              open={showConfirmPassword}
              onClick={() => setShowConfirmPassword(v => !v)}
            />
          </div>

          {confirmPassword && !doMatch && (
            <p className="text-xs mb-2 text-red-500">
              Passwords do not match
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center mb-3">
              {error}
            </p>
          )}

          <button
            onClick={submit}
            disabled={loading || !canSubmit}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Continue"}
          </button>

        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
            <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
          </div>
        )}

      </div>
    </div>
  );
}
