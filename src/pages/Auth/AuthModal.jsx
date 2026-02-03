import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

const API = "http://localhost:5000/api/auth";

export default function Auth() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    // Simple validation
    if (!email || !password || (isRegister && !name)) {
      alert("Please fill all fields");
      return;
    }

    const url = isRegister ? `${API}/register` : `${API}/login`;
    const body = isRegister
      ? { name, email, password }  // For registration
      : { email, password };  // For login

    try {
      setLoading(true);

      // Making the API request
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Save token and user data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Navigate to the profile page (or any protected page)
      navigate("/profile");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="auth-eyebrow">
          {isRegister ? "CREATE YOUR KITCHEN" : "WELCOME BACK"}
        </span>

        <h1>{isRegister ? "Join Yummi" : "Login"}</h1>

        <p className="auth-sub">
          {isRegister
            ? "Create your personal cooking space"
            : "Enter your kitchen"}
        </p>

        {isRegister && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegister
            ? "Create account"
            : "Login"}
        </button>

        <span
          className="auth-switch"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "No account yet? Register"}
        </span>
      </div>
    </main>
  );
}
