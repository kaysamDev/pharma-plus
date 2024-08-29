import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "./util/tokenService";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.json();
        throw new Error(message.error || "Failed to login");
      }

      const data = await response.json();
      saveToken(data.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="acc-form">
      <h1>Welcome To GeoPharmacy</h1>
      <div className="form-container">
        <h2>Login to your account</h2>
        <div className="form">
          <form onSubmit={handleLogin}>
            <div className="form-item">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-item">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}
          </form>
          <p>
            Don't have an account? <Link to="/register">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;