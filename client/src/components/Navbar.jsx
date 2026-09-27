import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header
      className="glass-panel"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        margin: "16px 24px",
        borderRadius: 16,
      }}
    >
      <Logo size={32} />
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="text-muted">Hi, {user.name.split(" ")[0]}</span>
          <button
            className="btn-secondary"
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
