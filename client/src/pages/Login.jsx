import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authSlice";
import Logo from "../components/Logo";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 32, width: 380 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Logo />
        </div>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Welcome back</h2>

        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <input
            type="email" placeholder="Email" required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password" placeholder="Password" required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing in..." : "Login"}
          </button>
        </div>

        <p className="text-muted" style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          No account? <Link to="/register" style={{ color: "var(--emerald)" }}>Register</Link>
        </p>
        <p className="text-muted" style={{ textAlign: "center", fontSize: 12 }}>
          Practice login (after seeding): ava@example.com / Password123
        </p>
      </form>
    </div>
  );
}
