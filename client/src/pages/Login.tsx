import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../redux/hooks";
import {
  loginThunk,
  fetchMe,
  generateOtp
} from "../redux/auth/authThunks";
import { handleGoogleLogin } from "../utils/handleGoogleLogin";
import EyeToggle from "../components/EyeToggle";

type Mode = "choice" | "password" | "otp";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<Mode>("choice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- CLEAN VALUES ---------- */

  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  /* ---------- VALIDATION ---------- */

  const isEmailValid = emailRegex.test(cleanEmail);
  const isPasswordValid = cleanPassword.length >= 1;

  const canUsePassword = isEmailValid && isPasswordValid;
  const canUseOtp = isEmailValid;

  /* ---------- PASSWORD LOGIN ---------- */

  const loginWithPassword = async () => {
    setError(null);

    if (!canUsePassword) {
      setError("Enter valid email and password");
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        loginThunk({
          email: cleanEmail.toLowerCase(),
          password: cleanPassword
        })
      ).unwrap();

      await dispatch(fetchMe()).unwrap();
      navigate("/profile");

    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP LOGIN ---------- */

  const loginWithOtp = async () => {
    setError(null);

    if (!canUseOtp) {
      setError("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await dispatch(
        generateOtp({ email: cleanEmail.toLowerCase() })
      ).unwrap();

      navigate("/verify-otp", {
        state: {
          type: "login",
          otpRequestId: res.otpRequestId,
          email: cleanEmail
        }
      });

    } catch {
      setError("Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESET ---------- */

  const resetFlow = () => {
    setMode("choice");
    setPassword("");
    setShowPassword(false);
    setError(null);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-c1 p-6 rounded-lg w-sm shadow-lg border border-border">

        <div className={loading ? "pointer-events-none opacity-60" : ""}>


          <h2 className="text-xl text-center mb-4 font-semibold">
            Login
          </h2>

          {/* EMAIL */}

          <input
            className="input mb-2"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {email && !isEmailValid && (
            <p className="text-xs mb-2 text-red-500">
              Enter a valid email address
            </p>
          )}

          {error && (
            <p className="text-sm mb-3 text-red-500 text-center">
              {error}
            </p>
          )}

          {/* ---------- CHOICE ---------- */}

          {isEmailValid && mode === "choice" && (
            <div className="flex gap-2 mb-2">
              <button
                className="btn btn-primary flex-1"
                onClick={() => setMode("password")}
              >
                Use Password
              </button>

              <button
                className="btn btn-secondary flex-1"
                onClick={() => setMode("otp")}
              >
                Use OTP
              </button>
            </div>
          )}

          {/* ---------- PASSWORD FLOW ---------- */}

          {isEmailValid && mode === "password" && (
            <>
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
                  Password can't be empty
                </p>
              )}

              <button
                onClick={loginWithPassword}
                disabled={loading || !canUsePassword}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in…" : "Login"}
              </button>

              <button
                onClick={resetFlow}
                className="text-sm mt-2 opacity-70 hover:underline"
              >
                Back
              </button>
            </>
          )}

          {/* ---------- OTP FLOW ---------- */}

          {isEmailValid && mode === "otp" && (
            <>
              <button
                onClick={loginWithOtp}
                disabled={loading || !canUseOtp}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>

              <button
                onClick={resetFlow}
                className="text-sm mt-2 opacity-70 hover:underline"
              >
                Back
              </button>
            </>
          )}

          {/* ---------- GOOGLE ---------- */}

          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs opacity-70">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(cred) =>
                handleGoogleLogin(cred, dispatch, navigate, setLoading)
              }
              onError={() => setError("Google login failed")}
            />
          </div>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary underline">
              Register
            </Link>
          </p>
        </div>

      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
          <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
