import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

// Simple branded splash screen; transitions once the app is "ready"
// (here, after a short, deliberately brief timeout).
export default function Splash() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFadeOut(true), 900);
    const go = setTimeout(() => navigate("/login"), 1300);
    return () => { clearTimeout(fade); clearTimeout(go); };
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 16,
        background: "radial-gradient(circle at 50% 40%, rgba(67,230,165,0.12), var(--bg) 65%)",
        opacity: fadeOut ? 0 : 1, transition: "opacity 0.4s ease",
      }}
    >
      <Logo size={64} withText={false} />
      <h1 style={{ margin: 0, fontSize: 32 }}>
        Link<span style={{ color: "var(--emerald)" }}>Up</span>
      </h1>
      <p className="text-muted">Connect. Collaborate. Create.</p>
    </div>
  );
}
