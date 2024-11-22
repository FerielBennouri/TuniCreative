import React, { useState } from "react";// Import React and useState hook for managing state
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for programmatic navigation
import Spinner from "../../components/spinner/Spinner"; // Import a Spinner component
import newRequest from "../../utils/newRequest"; // Import a custom axios instance for making HTTP requests
import upload from "../../utils/upload";// Import a utility function for handling file uploads
import "./Register.scss";

function Register() {
   // State for handling the file upload
  const [file, setFile] = useState(null);
  // State for handling user input
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    phone: "",
    desc: "",
    isCreator: false,
  });
   // State for handling form errors
  const [errors, setErrors] = useState({});
   // State for handling loading state
  const [loading, setLoading] = useState(false);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle input changes
  //Updates the state with the new value from the input field.
  const handleChange = (e) => {
    const { name, value } = e.target;
     // Update user state with input values
    setUser((prev) => ({ ...prev, [name]: value }));
    // Clear errors for the input being changed
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

   // Function to handle creator checkbox changes
  const handleCreator = (e) => {
    // Update isCreator state based on checkbox
    setUser((prev) => ({ ...prev, isCreator: e.target.checked }));
  };
  
  // Function to validate the form input for required values and correct format
  const validate = () => {
    const newErrors = {};
    if (!user.username) newErrors.username = "Username is required";
    if (!user.email) newErrors.email = "Email is required";
    if (!user.password) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (
      !/[A-Za-z]/.test(user.password) ||
      !/[0-9]/.test(user.password)
    ) {
      newErrors.password =
        "Password must contain at least one letter and one number";
    }
    if (!user.country) newErrors.country = "Country is required";
    if (!/^\+?\d{7,15}$/.test(user.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!user.desc) newErrors.desc = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;// If validation fails, do not proceed

    setLoading(true); // Set loading state to true
    try {
      let url = "";
      if (file) {
        // Upload the file if present and get the URL
        url = await upload(file);
      }
      // Make a POST request to the backend with user data
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      setLoading(false);
       // Navigate to the login page on successful registration
      navigate("/login");
    } catch (err) {
      setLoading(false);
      console.error(err); // Log the error for debugging
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message || "Unknown error occurred";
        if (errorMessage.includes("Username already exists")) {
          setErrors((prev) => ({ ...prev, username: "Username already exists" }));
        } else if (errorMessage.includes("Email already exists")) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }));
        } else {
          setErrors({ form: errorMessage });
        }
      } else {
        setErrors({ form: "Registration failed. Please try again." });
      }
    }
  };

  return (
    <div className="register">
      {loading && <Spinner />}
      <form onSubmit={handleSubmit}>
        <h1>Create a new account</h1>
        <div className="form-content">
          <div className="left">
            <label htmlFor="username">Username</label>
            <input
              name="username"
              type="text"
              placeholder="johndoe"
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <label htmlFor="password">Password</label>
            <input name="password" type="password" onChange={handleChange} />
            {errors.password && <p className="error">{errors.password}</p>}
            <label htmlFor="img">Profile Picture</label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="country">Region</label>
            <select name="country" onChange={handleChange}>
              <option value="">Select your region</option>
              <option value="Tunis">Tunis</option>
              <option value="Ariana">Ariana</option>
              <option value="Ben Arous">Ben Arous</option>
              <option value="Manouba">Manouba</option>
              <option value="Nabeul">Nabeul</option>
              <option value="Zaghouan">Zaghouan</option>
              <option value="Bizerte">Bizerte</option>
              <option value="Béja">Béja</option>
              <option value="Jendouba">Jendouba</option>
              <option value="Kef">Kef</option>
              <option value="Siliana">Siliana</option>
              <option value="Sousse">Sousse</option>
              <option value="Monastir">Monastir</option>
              <option value="Mahdia">Mahdia</option>
              <option value="Sfax">Sfax</option>
              <option value="Kairouan">Kairouan</option>
              <option value="Kasserine">Kasserine</option>
              <option value="Sidi Bouzid">Sidi Bouzid</option>
              <option value="Gabès">Gabès</option>
              <option value="Mednine">Mednine</option>
              <option value="Tataouine">Tataouine</option>
              <option value="Gafsa">Gafsa</option>
              <option value="Tozeur">Tozeur</option>
              <option value="Kebili">Kebili</option>
            </select>
            {errors.country && <p className="error">{errors.country}</p>}
          </div>
          <div className="right">
            <div className="toggle">
              <label htmlFor="isCreator">Activate the Creator account</label>
              <label className="switch">
                <input type="checkbox" onChange={handleCreator} />
                <span className="slider round"></span>
              </label>
            </div>
            <label htmlFor="phone">Phone Number</label>
            <input
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              onChange={handleChange}
            />
            {errors.phone && <p className="error">{errors.phone}</p>}
            <label htmlFor="desc">Bio</label>
            <textarea
              placeholder="A short description of yourself"
              name="desc"
              id=""
              cols="30"
              rows="10"
              onChange={handleChange}
            ></textarea>
            {errors.desc && <p className="error">{errors.desc}</p>}
          </div>
        </div>
        <div className="button-container">
          <button type="submit" disabled={loading}>
            Register
          </button>
        </div>
        {errors.form && <p className="error form-error">{errors.form}</p>}
        <p className="redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
