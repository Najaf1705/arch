import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../redux/hooks";
import { registerThunk, fetchMe } from "../redux/auth/authThunks";
import { handleGoogleLogin } from "../utils/handleGoogleLogin";
import EyeToggle from "../components/EyeToggle";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();
  const cleanConfirm = confirmPassword.trim();

  const isNameValid = cleanName.length >= 2;
  const isEmailValid = emailRegex.test(cleanEmail);
  const isPasswordValid = cleanPassword.length >= 6;
  const doPasswordsMatch = cleanPassword === cleanConfirm;

  const canSubmit =
    isNameValid &&
    isEmailValid &&
    isPasswordValid &&
    doPasswordsMatch;


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isNameValid) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!isEmailValid) {
      setError("Enter a valid email address");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await dispatch(
        registerThunk({
          name: cleanName,
          email: cleanEmail.toLowerCase(),
          password: cleanPassword
        })
      ).unwrap();

      navigate("/verify-otp", {
        state: {
          type: "register",
          email: cleanEmail,
          otpRequestId: res.otpRequestId
        }
      });

    } catch {
      setError("Email already registered");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
      }}
    >
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm p-6 rounded-lg shadow-md"
        style={{
          background: "rgb(var(--c1))",
          border: "1px solid rgb(var(--border))",
        }}
      >
                <div className={loading ? "pointer-events-none opacity-60" : ""}>

        <h2 className="text-xl font-semibold text-center mb-4">
          Create account
        </h2>

        {error && (
          <p
            className="text-sm text-center mb-3"
            style={{ color: "rgb(var(--c10))" }}
          >
            {error}
          </p>
        )}

        <input
          className="input mb-3"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input mb-3"
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        {email && !isEmailValid && (
          <p className="text-xs mb-2 text-red-500">
            Invalid email format
          </p>
        )}


        {/* Password */}
        <div className="relative mb-3">
          <input
            className="input pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <EyeToggle
            open={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          />
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            className="input pr-10"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <EyeToggle
            open={showConfirmPassword}
            onClick={() => setShowConfirmPassword((v) => !v)}
          />
        </div>

        {password && !isPasswordValid && (
          <p className="text-xs mb-2 text-red-500">
            Minimum 6 characters
          </p>
        )}

        {confirmPassword && !doPasswordsMatch && (
          <p className="text-xs mb-2 text-red-500">
            Passwords don’t match
          </p>
        )}



        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {loading ? "Creating…" : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-xs opacity-70">
          <div className="flex-1 h-px" style={{ background: "rgb(var(--border))" }} />
          OR
          <div className="flex-1 h-px" style={{ background: "rgb(var(--border))" }} />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(cred) =>
              handleGoogleLogin(cred, dispatch, navigate, setLoading)
            }
            onError={() => setError("Google signup failed")}
          />
        </div>

        <p className="text-sm text-center mt-4 text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            replace={true}
            className="text-primary underline"
          >
            Login
          </Link>
        </p>
        </div>
      </form>
      {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
            <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
          </div>
        )}
      
    </div>
  );
}