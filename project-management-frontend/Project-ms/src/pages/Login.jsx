import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

import { loginUser } from "../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Call Spring Boot login API
      const data = await loginUser(email, password);

      console.log("Login successful:", data);

      // =========================
      // SAVE LOGIN INFORMATION
      // =========================

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);

      // =========================
      // ROLE BASED REDIRECTION
      // =========================

      const role = data.role;

      if (role === "EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (role === "PROJECT_MANAGER") {
        navigate("/manager/dashboard");
      } else if (role === "PROJECT_ADMIN" || role === "SUPER_ADMIN") {
        navigate("/management/dashboard");
      } else {
        setError("Unknown user role.");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* =================================
                LEFT SIDE
            ================================= */}

      <div className="login-brand-section">
        <div className="login-brand">
          <div className="brand-logo">P</div>

          <span>ProjectFlow</span>
        </div>

        <div className="login-intro">
          <div className="intro-badge">PROJECT MANAGEMENT</div>

          <h1>
            Manage work.
            <br />
            <span>Deliver better.</span>
          </h1>

          <p>
            Plan projects, manage tasks, track timesheets and keep your entire
            team aligned in one place.
          </p>

          <div className="login-highlights">
            <div className="highlight">
              <div className="highlight-icon">✓</div>

              <div>
                <strong>Project management</strong>

                <span>Keep every project organized</span>
              </div>
            </div>

            <div className="highlight">
              <div className="highlight-icon">✓</div>

              <div>
                <strong>Task tracking</strong>

                <span>Know what needs to be done</span>
              </div>
            </div>

            <div className="highlight">
              <div className="highlight-icon">✓</div>

              <div>
                <strong>Timesheet management</strong>

                <span>Track planned and actual hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-copyright">© 2026 ProjectFlow</div>
      </div>

      {/* =================================
                RIGHT SIDE
            ================================= */}

      <div className="login-form-section">
        <div className="login-form-container">
          {/* MOBILE LOGO */}

          <div className="mobile-logo">
            <div className="brand-logo">P</div>

            <span>ProjectFlow</span>
          </div>

          {/* HEADING */}

          <div className="login-heading">
            <h2>Welcome back</h2>

            <p>Sign in to continue to your workspace</p>
          </div>

          {/* =================================
                        LOGIN FORM
                    ================================= */}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}

            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="input-group">
              <div className="password-heading">
                <label>Password</label>

                <a href="#">Forgot password?</a>
              </div>

              <div className="input-wrapper">
                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}

            {error && <div className="login-error">{error}</div>}

            {/* LOGIN BUTTON */}

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* DIVIDER */}

          <div className="login-divider">
            <span>OR</span>
          </div>

          {/* REGISTER */}

          <p className="register-text">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
