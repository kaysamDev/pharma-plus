import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveToken } from "./util/tokenService";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const erroData = await response.json();
        if (erroData.error) {
          setError(erroData.error);
        } else {
          throw new Error("Something went wrong");
        }
      } else {
        const data = await response.json();
        console.log("Account created successfully", data);
        saveToken(data.token);
        
        navigate(`/`);
      }
    } catch (err) {
      if(err instanceof Error){
        setError(err.message)
      } else {
        throw err;
      }
    }
  };

  return (
    <div className="acc-form">
      <h1>Welcome To GeoPharmacy</h1>
      <div className="form-container">
        <h2>create account</h2>
        <div className="form">
          <form onSubmit={handleRegister}>
            <div className="form-item">
              <label htmlFor="email">Fullname:</label>
              <input
                type="text"
                placeholder="Please enter fullname"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="example@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="pss">Password:</label>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Create</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
          {/* {user.isAuthenticated && (
                <p>
                  Welcome, {user.name}! <Link to="/logout">Logout</Link>
                </p>
              )} */}
        </div>
      </div>
    </div>
  );
};

export default Register;
