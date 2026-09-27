import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

// Simple branded splash screen; transitions once the app is "ready"
export default function Splash() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fade = setTimeout(() => setFadeOut(true), 900);
    const go = setTimeout(() => navigate("/login"), 1300);

    return () => {
      clearTimeout(fade);
      clearTimeout(go);
    };
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? "splash-fade-out" : ""}`}>

      <Logo size={64} withText={false} />

      <h1 className="splash-title">
        Link<span>Up</span>
      </h1>

      <p className="text-muted splash-tagline">
        Connect. Collaborate. Create.
      </p>

    </div>
  );
}