import { useState } from "react";
import { Link } from "react-router-dom";
// import user from "../index"

const Register = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  //   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault()
  //   }

  return (
    <div className="acc-form">
        <h1>Welcome To GeoPharmacy</h1>
      <div className="form-container">
        <h2>create account</h2>
        <div className="form">
          <form>
            <div className="form-item">
              <label htmlFor="email">Fullname:</label>
              <input
                type="text"
                placeholder="Jonathan Quaynoo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="pss">Password:</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Create</button>
          </form>
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
