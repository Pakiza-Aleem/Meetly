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

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="glass-panel auth-form">

        <div className="auth-logo">
          <Logo />
        </div>

        <h2 className="auth-title">
          Welcome back
        </h2>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <div className="auth-fields">

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
          />

          <button
            className="btn-primary"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Signing in..."
              : "Login"}
          </button>

        </div>

        <p className="text-muted auth-register">
          No account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>

        <p className="text-muted auth-practice">
          Practice login (after seeding):{" "}
          ava@example.com / Password123
        </p>

      </form>
    </div>
  );
}