import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../features/auth/authSlice";
import Logo from "../components/Logo";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(result)) {
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
          Create your account
        </h2>

        {error && (
          <p className="auth-error">
            {error}
          </p>
        )}

        <div className="auth-fields">

          <input
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Username"
            required
            value={form.username}
            onChange={(e) =>
              setForm({
                ...form,
                username: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
          />

          <button
            className="btn-primary"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Creating account..."
              : "Register"}
          </button>

        </div>

        <p className="text-muted auth-register">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}