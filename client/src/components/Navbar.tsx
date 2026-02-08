import { useEffect, useRef, useState } from "react";
import ThemeToggle from "../theme/ThemeToggle";
import GithubLink from "./GithubLink";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";

const pages = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Graph", path: "/graph" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" },
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function Navbar() {
  const user = useAppSelector((state) => state.user);
  const authenticationStatus = useAppSelector(
    (state) => state.auth.status
  );

  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  /* SCROLL LOGIC */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (delta > 10 && currentY > 60) {
        setVisible(false); // scroll down → hide
      } else if (delta < -10) {
        setVisible(true); // scroll up → show
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-50
          transition-transform duration-300 ease-out
          ${visible ? "translate-y-0" : "-translate-y-full"}
          backdrop-blur-xs bg-background/70 text-foreground border-b-2 border-c4
        `}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <img src="/flaticon.svg" alt="logo" className="w-8 h-8 cursor-pointer" onClick={() => navigate("/")} />
            <span className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>Nerch</span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-6 text-sm">
            {pages.map((p) => (
              <button
                key={p.label}
                className="hover:text-green-400 transition"
                onClick={() => navigate(p.path)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <GithubLink />

            {authenticationStatus === "authenticated" ? (
              <button className="w-9 h-9 rounded-full overflow-hidden"
                onClick={() => navigate("/profile")}>
                <img
                  src={user?.profilePicture || "/avatar-fallback.png"}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 rounded-md border border-white/20
                           text-sm hover:bg-white/10 transition"
              >
                Login
              </button>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              className="md:hidden ml-2"
              onClick={() => setMobileOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed top-14 left-0 w-full z-40 bg-black/90 text-white md:hidden">
          <div className="flex flex-col p-4 gap-3">
            {pages.map((p) => (
              <button
                key={p.label}
                className="text-left py-2 border-b border-white/10"
                onClick={() => navigate(p.path)}
              >
                {p.label}
              </button>
            ))}

            <div className="mt-2 border-t border-white/10 pt-2">
              {settings.map((s) => (
                <button
                  key={s}
                  className="block w-full text-left py-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
