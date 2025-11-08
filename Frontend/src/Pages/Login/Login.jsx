import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Use environment variable for backend URL, fallback to production URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://skillswap2-mo3i.onrender.com";

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  const containerStyle = {
    minHeight: "90.4vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d2d2d",
  };

  const loginBoxStyle = {
    height: "200px",
    display: "flex",
    backgroundColor: "#2d2d2d",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px",
    border: "1px solid #fcaaa8",
    borderRadius: "10px",
    boxShadow: "10px 10px 10px #5c4242",
    zIndex: "999",
  };

  const titleStyle = {
    fontSize: "50px",
    fontFamily: "Oswald, sans-serif",
    color: "#fcaaa8",
    textAlign: "center",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const buttonStyle = {
    backgroundColor: "#f56664",
    color: "#fff",
    fontFamily: "Montserrat",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const hoverButtonStyle = {
    backgroundColor: "#fff",
    color: "#f56664",
    fontFamily: "Montserrat",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.5s ease-in-out",
  };

  const imageStyle = {
    position: "absolute",
    left: "10px",
    top: "80px",
    width: "400px",
    marginBottom: "20px",
  };

  const imageBelowStyle = {
    position: "absolute",
    right: "10px",
    bottom: "50px",
    width: "400px",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <img src={"/assets/images/1.png"} alt="Above Image" style={imageStyle} />
      <div style={loginBoxStyle}>
        <h1 style={titleStyle}>LOGIN</h1>
        <div style={buttonContainerStyle}>
          <Button
            style={isHovered ? hoverButtonStyle : buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleGoogleLogin}
          >
            <FaGoogle /> Login with Google
          </Button>
        </div>
      </div>
      <img src={"/assets/images/2.png"} alt="Below Image" style={imageBelowStyle} />
    </div>
  );
};

export default Login;