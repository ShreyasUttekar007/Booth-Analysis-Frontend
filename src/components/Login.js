import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import localforage from "localforage";
import img from "../STC_logo-01.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/update");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setEmailError("");
      setPasswordError("");
  
      const response = await axios.post(
        "http://43.205.136.100:5000/api/auth/login",
        {
          email,
          password,
        }
      );
  
      const userEmail = response.data.userObj.email;
      const token = response.data.token;
      const id = response.data.userObj._id;
      const roles = response.data.userObj.roles; // Array of roles
      const data = response.data;
      localforage.setItem("email", userEmail);
      localforage.setItem("token", token);
      localforage.setItem("ID", id);
      localforage.setItem("roles", roles); // Save roles as an array
      console.log("Login success:", response.data.message);
      navigate("/create");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setEmailError("Incorrect email or password");
        setPasswordError("Incorrect email or password");
      } else {
        console.error("Login failed:", error.response.data.message);
      }
    }
  };
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="container">
        <div className="login">
          <img src={img} className="img" />
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "250px" }}
            />
            <br />
            <div className="password-input" style={{ position: "relative", marginBottom:"20px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "250px"}}
              />
              <div
                className="eye-icon"
                onClick={toggleShowPassword}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </div>
            </div>
            <p className="error">{passwordError}</p>
            <div className="bttn">
              <button type="submit" className="button">
                Sign In
              </button>
            </div>
          </form>
          <button onClick={handleClick} className="button">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
