import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken, getToken } from "./util/tokenService";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      // If the user is already logged in, redirect to the home page
      navigate("/", { replace: true });
    }
  }, [navigate]);

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
      saveToken(data.token); // Save the token to localStorage or cookies

      // Fetch user profile using the token to get the role
      const profileResponse = await fetch("http://localhost:5000/api/v1/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`, // Pass the token in Authorization header
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileResponse.json();

      // Check the role and navigate accordingly
      if (profileData.role === "admin") {
        navigate("/admin/dashboard"); // Redirect to admin dashboard if role is admin
      } else {
        navigate("/"); // Otherwise, redirect to the home page
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        throw err;
      }
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
