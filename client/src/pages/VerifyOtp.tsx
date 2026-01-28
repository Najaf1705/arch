import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import {
  fetchMe,
  regenerateOtpThunk,
  verifyLoginOtpThunk,
  verifyRegisterOtpThunk
} from "../redux/auth/authThunks";

export default function VerifyOtp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const otpRequestId = location.state?.otpRequestId;
  const email = location.state?.email;
  const type = location.state?.type;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(30);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const isOtpComplete = otp.every((d) => d !== "");

  /* ---------- SESSION SAFETY ---------- */

  useEffect(() => {
    if (!otpRequestId || !email) {
      navigate("/register", { replace: true });
    }
  }, [otpRequestId, email, navigate]);

  /* ---------- COOLDOWN TIMER ---------- */

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ---------- INPUT CONTROL ---------- */

  const handleChange = (index: number, value: string) => {
    if (!/^\d$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(text)) {
      setError("Paste a valid 6-digit code");
      return;
    }

    setOtp(text.split(""));
    inputsRef.current[5]?.focus();
  };

  /* ---------- SUBMIT ---------- */

  const submitOtp = async () => {
    setError(null);

    if (!isOtpComplete) {
      setError("Enter all 6 digits");
      return;
    }

    try {
      setLoading(true);

      const thunk =
        type === "register"
          ? verifyRegisterOtpThunk
          : verifyLoginOtpThunk;

      await dispatch(
        thunk({
          otpRequestId,
          otp: otp.join(""),
          email
        })
      ).unwrap();

      await dispatch(fetchMe()).unwrap();
      navigate("/profile");

    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND ---------- */

  const resendOtp = async () => {
    try {
      setLoading(true);
      setCooldown(30);

      await dispatch(
        regenerateOtpThunk({ otpRequestId })
      ).unwrap();
    } catch {
      setError("Could not resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
      }}
    >
      <div
        className="w-full max-w-sm p-6 rounded-lg shadow-md"
        style={{
          background: "rgb(var(--c1))",
          border: "1px solid rgb(var(--border))",
        }}
      >
        <div className={loading ? "pointer-events-none opacity-60" : ""}>

          <h2 className="text-xl font-semibold text-center mb-2">
            Verify your email
          </h2>

          <p className="text-sm text-center opacity-80 mb-6">
            Enter the 6-digit code sent to <br />
            <strong>{email}</strong>
          </p>

          <div
            className="flex justify-center gap-2 mb-4"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                className="input text-center text-lg"
                style={{
                  width: "44px",
                  height: "48px",
                  padding: 0,
                }}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                maxLength={1}
                inputMode="numeric"
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <p
              className="text-sm text-center mb-3"
              style={{ color: "rgb(var(--c10))" }}
            >
              {error}
            </p>
          )}

          <button
            onClick={submitOtp}
            disabled={loading || !isOtpComplete}
            className="btn btn-primary w-full"
          >
            {loading ? "Verifying…" : "Verify"}
          </button>

          <button
            onClick={resendOtp}
            disabled={cooldown > 0 || loading}
            className="text-xs mx-auto block mt-4 opacity-80 hover:underline disabled:opacity-40"
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </button>
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