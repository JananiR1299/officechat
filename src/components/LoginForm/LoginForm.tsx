import React, { useState } from "react";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Box, Typography, Grid } from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { IconButton } from "@mui/material";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700&display=swap');
`;

const socket: Socket = io(process.env.REACT_APP_SOCKET_URL);

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          Email: email,
          PasswordHash: password,
        }
      );

      const userDetails = {
        userdata: response.data.userDetails,
      };

      setUser(userDetails);
      socket.emit("login", userDetails.userdata.UserID);
      navigate("/chatpage", { state: { userDetails } });
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <GlobalStyle />
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Grid
          container
          sx={{ overflow: "hidden", height: "100%", width: "100%" }}
        >
          {/* Left Side Image */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              backgroundImage: "url('/login_background.png')",
              backgroundSize: "100% 95%",
              backgroundPosition: "center",
            }}
          >
            <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
              <img
                src="./login_hover.png"
                alt="hover image"
                style={{
                  position: "absolute",
                  bottom: "20%",
                  left: "20%",
                  width: "60%",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: "55%",
                  left: "20%",
                  color: "white",
                }}
              >
                <Typography variant="h4">One Integrated Solution</Typography>
                <Typography variant="h4">For your Practice</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: "8%",
                  }}
                >
                  Revenue
                  <FiberManualRecordIcon sx={{ fontSize: "8px", mx: 1 }} />
                  Appointments
                  <FiberManualRecordIcon sx={{ fontSize: "8px", mx: 1 }} />
                  Treatment Plans
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Side Form */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              p: 3,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: "400px" }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <svg
                  width="54"
                  height="88"
                  viewBox="0 0 94 88"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="21.1177"
                    width="25.8821"
                    height="17.2547"
                    rx="1"
                    fill="url(#paint0_linear_24_6502)"
                  />
                  <rect
                    x="53.9023"
                    y="6.90234"
                    width="32.784"
                    height="25.8821"
                    rx="1"
                    fill="url(#paint1_linear_24_6502)"
                  />
                  <rect
                    x="53.9023"
                    y="39.6853"
                    width="39.6859"
                    height="39.6859"
                    rx="1"
                    fill="url(#paint2_linear_24_6502)"
                  />
                  <rect
                    x="15.9414"
                    y="62.1179"
                    width="31.0585"
                    height="25.8821"
                    rx="1"
                    fill="url(#paint3_linear_24_6502)"
                  />
                  <rect
                    x="0.412109"
                    y="24.1565"
                    width="46.5878"
                    height="32.784"
                    rx="1"
                    fill="url(#paint4_linear_24_6502)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_24_6502"
                      x1="34.0587"
                      y1="0"
                      x2="34.0587"
                      y2="17.2547"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#8548D0" />
                      <stop offset="1" stop-color="#29BFFF" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_24_6502"
                      x1="70.2943"
                      y1="6.90234"
                      x2="70.2943"
                      y2="32.7844"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#8548D0" />
                      <stop offset="1" stop-color="#29BFFF" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_24_6502"
                      x1="73.7453"
                      y1="39.6853"
                      x2="73.7453"
                      y2="79.3712"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#8548D0" />
                      <stop offset="1" stop-color="#29BFFF" />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_24_6502"
                      x1="31.4707"
                      y1="62.1179"
                      x2="31.4707"
                      y2="88"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#8548D0" />
                      <stop offset="1" stop-color="#29BFFF" />
                    </linearGradient>
                    <linearGradient
                      id="paint4_linear_24_6502"
                      x1="23.706"
                      y1="24.1565"
                      x2="23.706"
                      y2="56.9405"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#8548D0" />
                      <stop offset="1" stop-color="#29BFFF" />
                    </linearGradient>
                  </defs>
                </svg>
                <Typography variant="h6" sx={{ mt: 0.3, fontSize: "15px" }}>
                  Connect, engage and grow with PractIOT
                </Typography>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  textAlign: "left",
                  mb: 1,
                  fontWeight: "500",
                  fontSize: "17px",
                }}
              >
                Login
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  textAlign: "left",
                  mb: 3,
                  fontWeight: "500",
                  fontSize: "12px",
                }}
              >
                Enter registered Email-ID and password
              </Typography>

              {/* Email Input */}
              <Box sx={{ position: "relative", mb: 3 }}>
                <input
                  type="text"
                  className="input"
                  id="email"
                  required
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "360px",
                    padding: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: "4px",
                  }}
                />
                <label
                  htmlFor="email"
                  style={{
                    position: "absolute",
                    top: "-20px",
                    fontSize: "12px",
                  }}
                >
                  Email
                </label>
              </Box>

              {/* Password Input */}
              <Box sx={{ position: "relative", mb: 2 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  id="pass"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "360px",
                    padding: "10px",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: "4px",
                  }}
                />
                <label
                  htmlFor="pass"
                  style={{
                    position: "absolute",
                    top: "-20px",
                    fontSize: "12px",
                  }}
                >
                  Password
                </label>
                {showPassword ? (
                  <FaEye
                    onClick={togglePasswordVisibility}
                    className="icon"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <FaEyeSlash
                    onClick={togglePasswordVisibility}
                    className="icon"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                )}
              </Box>

              {/* Error Message */}
              {error && (
                <Typography sx={{ color: "red", mb: 2 }}>{error}</Typography>
              )}

              {/* Remember Me and Forgot Password */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <input type="checkbox" />
                  <Typography variant="body2" sx={{ fontSize: "12px" }}>
                    Remember me
                  </Typography>
                </Box>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  sx={{
                    color: "#8548D0",
                    left: "20%",
                    fontSize: "13px",
                    cursor: "no-drop",
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                  width: "100%",
                  mb: 2,
                  background:
                    "linear-gradient(90deg, #8548D0 0%, #29BFFF 100%)",
                }}
              >
                Login
              </Button>

              {/* Separator */}
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  my: 2,
                  color: "rgba(71, 84, 103, 1)",
                  display: "flex",
                  fontSize: "14px",
                  fontWeight: "400",
                  lineHeight: "20px",
                  textAlign: "center",
                  alignItems: "center",
                  "&::before, &::after": {
                    content: '""',
                    flex: 1,
                    height: "1.3px",
                    backgroundColor: "rgba(234, 236, 240, 1)",
                    margin: "0 8px",
                  },
                }}
              >
                or
              </Typography>

              {/* Login with OTP Button */}
              <Button
                variant="outlined"
                sx={{
                  width: "100%",
                  border: "1.5px solid #8548D0",
                  color: "#8548D0",
                  mb: 2,
                  cursor: "no-drop",
                }}
              >
                Login with OTP
              </Button>

              {/* Need Help Link */}
              <Link
                href="#"
                underline="none"
                onClick={(e) => e.preventDefault()}
                sx={{
                  display: "block",
                  textAlign: "right",
                  color: "black",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "no-drop",
                }}
              >
                Need Help?
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LoginForm;
