export default function EyeToggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Hide password" : "Show password"}
      className="absolute right-2 top-1/2 -translate-y-1/2"
      style={{
        color: "rgb(var(--foreground))",
        opacity: 0.7,
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* OPEN EYE */}
        <g
          style={{
            transformOrigin: "center",
            transition: "opacity 160ms ease, transform 160ms ease",
            opacity: open ? 1 : 0,
            transform: open ? "scale(1)" : "scale(0.85)",
          }}
        >
          {/* eye outline */}
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12" />
          {/* pupil */}
          <circle cx="12" cy="12" r="3" />
        </g>

        {/* CLOSED EYE */}
        <g
          style={{
            transformOrigin: "center",
            transition: "opacity 160ms ease, transform 160ms ease",
            opacity: open ? 0 : 1,
            transform: open ? "scale(1.1)" : "scale(1)",
          }}
        >
          {/* eyelid curve */}
          <path d="M4 12c2.5 2 5 3 8 3s5.5-1 8-3" />
        </g>
      </svg>
    </button>
  );
}