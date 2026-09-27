import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import Logo from "../components/Logo";

export default function Register() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) navigate("/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 32, width: 380 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Logo />
        </div>
        <h2 style={{ textAlign: "center", marginTop: 0 }}>Create your account</h2>

        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <input placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password (min 6 characters)" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn-primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Creating account..." : "Register"}
          </button>
        </div>

        <p className="text-muted" style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          Already have an account? <Link to="/login" style={{ color: "var(--emerald)" }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
