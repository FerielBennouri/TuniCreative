import React, { useState } from 'react'; // Import React and useState hook for managing state
import "./Login.scss"; // Import the CSS file for styling
import newRequest from "../../utils/newRequest"; // Import a custom axios instance for making HTTP requests
import { useNavigate, Link } from "react-router-dom";// Import Link for navigation and useNavigate for programmatic navigation
import Spinner from "../../components/spinner/Spinner"; // Import Spinner

const Login = () => {
  const [username, setUsername] = useState(""); // State for handling username input
  const [password, setPassword] = useState(""); // State for handling password input
  const [error, setError] = useState(null); // State for handling errors

  const [loading, setLoading] = useState(false); // State for handling loading state

  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);// Clear any previous errors

    if (username === "" || password === "") {
      setError("Username and Password are required"); // Set error if fields are empty
      return;
    }

    setLoading(true); // Set loading state to true
    try {
       // Make a POST request to the backend with login credentials
      const res = await newRequest.post("/auth/login", { username, password });
       // Store the user data in localStorage
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      setLoading(false);
      // Navigate to the home page on successful login
      navigate("/");
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Set error message from the response
      } else {
        setError("Something went wrong. Please try again."); // Set a generic error message
      }
    }
  };

  return (
    <div className="login">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {error && !username && <p className="error">Username is required</p>}
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && !password && <p className="error">Password is required</p>}
        <button type="submit" disabled={loading}>Login</button>
        {error && <p className="error">{error}</p>}
        <p className="redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
