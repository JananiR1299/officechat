import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Suggestions from "./Suggestions";
import MoreIcon from "@mui/icons-material/MoreVert";
import { User } from "../ChatWindow/messagetypes";
import { useUser } from "../../context/UserContext";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 1300,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, selectActiveUser } = useUser();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    console.log("Logout", user?.userdata?.UserID);

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
        userId: user?.userdata?.UserID, // Pass the user ID in the request body
      }) // Replace with your actual logout API endpoint
      .then(() => {
        window.location.href = "/login"; // Redirect to login page
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });

    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem>{user?.userdata?.Username}</MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  useEffect(() => {
    console.log("selectActiveUser", selectActiveUser);
  }, [selectActiveUser]);

  return (
    <Box
      sx={{
        width: "100%", // Use percentage to make it responsive instead of a fixed width
        height: "70.22px", // Keep the fixed height as required
        padding: "16px 32px", // Maintain the padding values

        justifyContent: "space-between", // Space between children
        opacity: 1, // Keep opacity fully visible
      }}
    >
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            marginTop: "1px",
            color: "#6a11cb ",
            backgroundColor: "white", // Keep the background white
            boxShadow: "0 2px 2px -2px rgba(0, 0, 0, 0.2)", // Soft shadow effect
            justifyContent: "space-between", // Ensure the content is spaced properly
            alignItems: "center",
          }}
        >
          {/* Logo / Branding */}
          <Typography
            variant="h6"
            // noWrap
            whiteSpace="nowrap"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <svg
              width="190"
              height="39"
              viewBox="0 0 190 39"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8.99344"
                width="11.242"
                height="7.49463"
                rx="1"
                fill="url(#paint0_linear_154_706)"
              />
              <rect
                x="23.2335"
                y="2.99802"
                width="14.2398"
                height="11.242"
                rx="1"
                fill="url(#paint1_linear_154_706)"
              />
              <rect
                x="23.2335"
                y="17.2374"
                width="17.2377"
                height="17.2377"
                rx="1"
                fill="url(#paint2_linear_154_706)"
              />
              <rect
                x="6.74519"
                y="26.981"
                width="13.4903"
                height="11.242"
                rx="1"
                fill="url(#paint3_linear_154_706)"
              />
              <rect
                y="10.4924"
                width="20.2355"
                height="14.2398"
                rx="1"
                fill="url(#paint4_linear_154_706)"
              />
              <path
                d="M61.9031 27.2795C60.3351 27.2795 58.8951 26.9115 57.5831 26.1755C56.2711 25.4395 55.2311 24.4235 54.4631 23.1275C53.6951 21.8155 53.3111 20.3355 53.3111 18.6875C53.3111 17.0555 53.6951 15.5915 54.4631 14.2955C55.2311 12.9835 56.2711 11.9595 57.5831 11.2235C58.8951 10.4875 60.3351 10.1195 61.9031 10.1195C63.4871 10.1195 64.9271 10.4875 66.2231 11.2235C67.5351 11.9595 68.5671 12.9835 69.3191 14.2955C70.0871 15.5915 70.4711 17.0555 70.4711 18.6875C70.4711 20.3355 70.0871 21.8155 69.3191 23.1275C68.5671 24.4235 67.5351 25.4395 66.2231 26.1755C64.9111 26.9115 63.4711 27.2795 61.9031 27.2795ZM61.9031 24.2795C62.9111 24.2795 63.7991 24.0555 64.5671 23.6075C65.3351 23.1435 65.9351 22.4875 66.3671 21.6395C66.7991 20.7915 67.0151 19.8075 67.0151 18.6875C67.0151 17.5675 66.7991 16.5915 66.3671 15.7595C65.9351 14.9115 65.3351 14.2635 64.5671 13.8155C63.7991 13.3675 62.9111 13.1435 61.9031 13.1435C60.8951 13.1435 59.9991 13.3675 59.2151 13.8155C58.4471 14.2635 57.8471 14.9115 57.4151 15.7595C56.9831 16.5915 56.7671 17.5675 56.7671 18.6875C56.7671 19.8075 56.9831 20.7915 57.4151 21.6395C57.8471 22.4875 58.4471 23.1435 59.2151 23.6075C59.9991 24.0555 60.8951 24.2795 61.9031 24.2795ZM79.0669 16.5755H76.7389V27.1115H73.3309V16.5755H71.8189V13.8155H73.3309V13.1435C73.3309 11.5115 73.7949 10.3115 74.7229 9.54351C75.6509 8.77551 77.0509 8.41551 78.9229 8.46351V11.2955C78.1069 11.2795 77.5389 11.4155 77.2189 11.7035C76.8989 11.9915 76.7389 12.5115 76.7389 13.2635V13.8155H79.0669V16.5755ZM87.3403 16.5755H85.0123V27.1115H81.6043V16.5755H80.0923V13.8155H81.6043V13.1435C81.6043 11.5115 82.0683 10.3115 82.9963 9.54351C83.9243 8.77551 85.3243 8.41551 87.1963 8.46351V11.2955C86.3803 11.2795 85.8123 11.4155 85.4923 11.7035C85.1723 11.9915 85.0123 12.5115 85.0123 13.2635V13.8155H87.3403V16.5755ZM91.2218 12.2315C90.6298 12.2315 90.1338 12.0475 89.7338 11.6795C89.3498 11.2955 89.1578 10.8235 89.1578 10.2635C89.1578 9.70351 89.3498 9.23951 89.7338 8.87151C90.1338 8.48751 90.6298 8.29551 91.2218 8.29551C91.8138 8.29551 92.3018 8.48751 92.6858 8.87151C93.0858 9.23951 93.2858 9.70351 93.2858 10.2635C93.2858 10.8235 93.0858 11.2955 92.6858 11.6795C92.3018 12.0475 91.8138 12.2315 91.2218 12.2315ZM92.8778 13.8155V27.1115H89.5178V13.8155H92.8778ZM95.3334 20.4635C95.3334 19.0875 95.6134 17.8875 96.1734 16.8635C96.7334 15.8235 97.5094 15.0235 98.5014 14.4635C99.4934 13.8875 100.629 13.5995 101.909 13.5995C103.557 13.5995 104.917 14.0155 105.989 14.8475C107.077 15.6635 107.805 16.8155 108.173 18.3035H104.549C104.357 17.7275 104.029 17.2795 103.565 16.9595C103.117 16.6235 102.557 16.4555 101.885 16.4555C100.925 16.4555 100.165 16.8075 99.6054 17.5115C99.0454 18.1995 98.7654 19.1835 98.7654 20.4635C98.7654 21.7275 99.0454 22.7115 99.6054 23.4155C100.165 24.1035 100.925 24.4475 101.885 24.4475C103.245 24.4475 104.133 23.8395 104.549 22.6235H108.173C107.805 24.0635 107.077 25.2075 105.989 26.0555C104.901 26.9035 103.541 27.3275 101.909 27.3275C100.629 27.3275 99.4934 27.0475 98.5014 26.4875C97.5094 25.9115 96.7334 25.1115 96.1734 24.0875C95.6134 23.0475 95.3334 21.8395 95.3334 20.4635ZM122.995 20.1755C122.995 20.6555 122.963 21.0875 122.899 21.4715H113.179C113.259 22.4315 113.595 23.1835 114.187 23.7275C114.779 24.2715 115.507 24.5435 116.371 24.5435C117.619 24.5435 118.507 24.0075 119.035 22.9355H122.659C122.275 24.2155 121.539 25.2715 120.451 26.1035C119.363 26.9195 118.027 27.3275 116.443 27.3275C115.163 27.3275 114.011 27.0475 112.987 26.4875C111.979 25.9115 111.187 25.1035 110.611 24.0635C110.051 23.0235 109.771 21.8235 109.771 20.4635C109.771 19.0875 110.051 17.8795 110.611 16.8395C111.171 15.7995 111.955 14.9995 112.963 14.4395C113.971 13.8795 115.131 13.5995 116.443 13.5995C117.707 13.5995 118.835 13.8715 119.827 14.4155C120.835 14.9595 121.611 15.7355 122.155 16.7435C122.715 17.7355 122.995 18.8795 122.995 20.1755ZM119.515 19.2155C119.499 18.3515 119.187 17.6635 118.579 17.1515C117.971 16.6235 117.227 16.3595 116.347 16.3595C115.515 16.3595 114.811 16.6155 114.235 17.1275C113.675 17.6235 113.331 18.3195 113.203 19.2155H119.515ZM130.35 18.7115C130.35 17.0635 130.718 15.5915 131.454 14.2955C132.206 12.9835 133.222 11.9675 134.502 11.2475C135.798 10.5115 137.246 10.1435 138.846 10.1435C140.718 10.1435 142.358 10.6235 143.766 11.5835C145.174 12.5435 146.158 13.8715 146.718 15.5675H142.854C142.47 14.7675 141.926 14.1675 141.222 13.7675C140.534 13.3675 139.734 13.1675 138.822 13.1675C137.846 13.1675 136.974 13.3995 136.206 13.8635C135.454 14.3115 134.862 14.9515 134.43 15.7835C134.014 16.6155 133.806 17.5915 133.806 18.7115C133.806 19.8155 134.014 20.7915 134.43 21.6395C134.862 22.4715 135.454 23.1195 136.206 23.5835C136.974 24.0315 137.846 24.2555 138.822 24.2555C139.734 24.2555 140.534 24.0555 141.222 23.6555C141.926 23.2395 142.47 22.6315 142.854 21.8315H146.718C146.158 23.5435 145.174 24.8795 143.766 25.8395C142.374 26.7835 140.734 27.2555 138.846 27.2555C137.246 27.2555 135.798 26.8955 134.502 26.1755C133.222 25.4395 132.206 24.4235 131.454 23.1275C130.718 21.8315 130.35 20.3595 130.35 18.7115ZM157.076 13.6235C158.084 13.6235 158.98 13.8475 159.764 14.2955C160.548 14.7275 161.156 15.3755 161.588 16.2395C162.036 17.0875 162.26 18.1115 162.26 19.3115V27.1115H158.9V19.7675C158.9 18.7115 158.636 17.9035 158.108 17.3435C157.58 16.7675 156.86 16.4795 155.948 16.4795C155.02 16.4795 154.284 16.7675 153.74 17.3435C153.212 17.9035 152.948 18.7115 152.948 19.7675V27.1115H149.588V9.35151H152.948V15.4715C153.38 14.8955 153.956 14.4475 154.676 14.1275C155.396 13.7915 156.196 13.6235 157.076 13.6235ZM164.591 20.4155C164.591 19.0715 164.855 17.8795 165.383 16.8395C165.927 15.7995 166.655 14.9995 167.567 14.4395C168.495 13.8795 169.527 13.5995 170.663 13.5995C171.655 13.5995 172.519 13.7995 173.255 14.1995C174.007 14.5995 174.607 15.1035 175.055 15.7115V13.8155H178.439V27.1115H175.055V25.1675C174.623 25.7915 174.023 26.3115 173.255 26.7275C172.503 27.1275 171.631 27.3275 170.639 27.3275C169.519 27.3275 168.495 27.0395 167.567 26.4635C166.655 25.8875 165.927 25.0795 165.383 24.0395C164.855 22.9835 164.591 21.7755 164.591 20.4155ZM175.055 20.4635C175.055 19.6475 174.895 18.9515 174.575 18.3755C174.255 17.7835 173.823 17.3355 173.279 17.0315C172.735 16.7115 172.151 16.5515 171.527 16.5515C170.903 16.5515 170.327 16.7035 169.799 17.0075C169.271 17.3115 168.839 17.7595 168.503 18.3515C168.183 18.9275 168.023 19.6155 168.023 20.4155C168.023 21.2155 168.183 21.9195 168.503 22.5275C168.839 23.1195 169.271 23.5755 169.799 23.8955C170.343 24.2155 170.919 24.3755 171.527 24.3755C172.151 24.3755 172.735 24.2235 173.279 23.9195C173.823 23.5995 174.255 23.1515 174.575 22.5755C174.895 21.9835 175.055 21.2795 175.055 20.4635ZM185.633 16.5755V23.0075C185.633 23.4555 185.737 23.7835 185.945 23.9915C186.169 24.1835 186.537 24.2795 187.049 24.2795H188.609V27.1115H186.497C183.665 27.1115 182.249 25.7355 182.249 22.9835V16.5755H180.665V13.8155H182.249V10.5275H185.633V13.8155H188.609V16.5755H185.633Z"
                fill="url(#paint5_linear_154_706)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_154_706"
                  x1="14.6144"
                  y1="0"
                  x2="14.6144"
                  y2="7.49463"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#8548D0" />
                  <stop offset="1" stop-color="#29BFFF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_154_706"
                  x1="30.3534"
                  y1="2.99802"
                  x2="30.3534"
                  y2="14.24"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#8548D0" />
                  <stop offset="1" stop-color="#29BFFF" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_154_706"
                  x1="31.8523"
                  y1="17.2374"
                  x2="31.8523"
                  y2="34.4751"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#8548D0" />
                  <stop offset="1" stop-color="#29BFFF" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_154_706"
                  x1="13.4904"
                  y1="26.981"
                  x2="13.4904"
                  y2="38.223"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#8548D0" />
                  <stop offset="1" stop-color="#29BFFF" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_154_706"
                  x1="10.1178"
                  y1="10.4924"
                  x2="10.1178"
                  y2="24.7322"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#8548D0" />
                  <stop offset="1" stop-color="#29BFFF" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_154_706"
                  x1="38.2003"
                  y1="1.11152"
                  x2="199.933"
                  y2="8.44313"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#8548D0" />
                  <stop offset="1" stop-color="#0771DE" />
                </linearGradient>
              </defs>
            </svg>
          </Typography>
          {/* Actions / Icons on the right side */}
          <Box
            sx={{
              display: "flex", // Ensure icons or actions are aligned horizontally
              alignItems: "center",
              // gap: 1, // Add spacing between items
            }}
          >
            <IconButton
              size="large"
              aria-label="show new notifications"
              sx={{ color: "black" }}
            >
              <SearchIcon />
            </IconButton>

            <IconButton
              size="large"
              aria-label="show new notifications"
              // color="black"
              sx={{ color: "black" }}
            >
              <NotificationsNoneIcon />
            </IconButton>

            {/* <Typography>{user?.userdata?.Username}</Typography> */}

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{ color: "black" }}
            >
              <AccountCircle />
            </IconButton>
            {/* Insert action buttons or icons here */}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>

    // <Box
    //   sx={{
    //     width: "1440px", // Fixed width
    //     height: "70.22px", // Fixed height
    //     padding: "16px 32px", // Padding values (top, right, bottom, left)
    //     gap: "0px", // Gap between children
    //     borderBottom: "1px solid", // Border with only bottom side
    //     justifyContent: "space-between", // Space between children
    //     opacity: 1, // Set opacity (0 means invisible, 1 is fully visible)
    //   }}
    // >
    //   <AppBar position="fixed">
    //     <Toolbar
    //       sx={{
    //         marginTop: "1px",
    //         color: "#6a11cb ",
    //         backgroundColor: "white",
    //         boxShadow: "0 2px 2px -2px rgba(0, 0, 0, 0.2)",
    //         justifyContent: "space-between",
    //         alignItems: "center",
    //       }}
    //     >
    //       {/* <IconButton
    //         size="large"
    //         edge="start"
    //         color="inherit"
    //         aria-label="open drawer"
    //         sx={{ mr: 2 }}
    //       >
    //         <MenuIcon />
    //       </IconButton> */}
    //       <Typography
    //         variant="h6"
    //         // noWrap
    //         whiteSpace="nowrap"
    //         component="div"
    //         sx={{ display: { xs: "none", sm: "block" } }}
    //       >
    //         <svg
    //           width="190"
    //           height="39"
    //           viewBox="0 0 190 39"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <rect
    //             x="8.99344"
    //             width="11.242"
    //             height="7.49463"
    //             rx="1"
    //             fill="url(#paint0_linear_154_706)"
    //           />
    //           <rect
    //             x="23.2335"
    //             y="2.99802"
    //             width="14.2398"
    //             height="11.242"
    //             rx="1"
    //             fill="url(#paint1_linear_154_706)"
    //           />
    //           <rect
    //             x="23.2335"
    //             y="17.2374"
    //             width="17.2377"
    //             height="17.2377"
    //             rx="1"
    //             fill="url(#paint2_linear_154_706)"
    //           />
    //           <rect
    //             x="6.74519"
    //             y="26.981"
    //             width="13.4903"
    //             height="11.242"
    //             rx="1"
    //             fill="url(#paint3_linear_154_706)"
    //           />
    //           <rect
    //             y="10.4924"
    //             width="20.2355"
    //             height="14.2398"
    //             rx="1"
    //             fill="url(#paint4_linear_154_706)"
    //           />
    //           <path
    //             d="M61.9031 27.2795C60.3351 27.2795 58.8951 26.9115 57.5831 26.1755C56.2711 25.4395 55.2311 24.4235 54.4631 23.1275C53.6951 21.8155 53.3111 20.3355 53.3111 18.6875C53.3111 17.0555 53.6951 15.5915 54.4631 14.2955C55.2311 12.9835 56.2711 11.9595 57.5831 11.2235C58.8951 10.4875 60.3351 10.1195 61.9031 10.1195C63.4871 10.1195 64.9271 10.4875 66.2231 11.2235C67.5351 11.9595 68.5671 12.9835 69.3191 14.2955C70.0871 15.5915 70.4711 17.0555 70.4711 18.6875C70.4711 20.3355 70.0871 21.8155 69.3191 23.1275C68.5671 24.4235 67.5351 25.4395 66.2231 26.1755C64.9111 26.9115 63.4711 27.2795 61.9031 27.2795ZM61.9031 24.2795C62.9111 24.2795 63.7991 24.0555 64.5671 23.6075C65.3351 23.1435 65.9351 22.4875 66.3671 21.6395C66.7991 20.7915 67.0151 19.8075 67.0151 18.6875C67.0151 17.5675 66.7991 16.5915 66.3671 15.7595C65.9351 14.9115 65.3351 14.2635 64.5671 13.8155C63.7991 13.3675 62.9111 13.1435 61.9031 13.1435C60.8951 13.1435 59.9991 13.3675 59.2151 13.8155C58.4471 14.2635 57.8471 14.9115 57.4151 15.7595C56.9831 16.5915 56.7671 17.5675 56.7671 18.6875C56.7671 19.8075 56.9831 20.7915 57.4151 21.6395C57.8471 22.4875 58.4471 23.1435 59.2151 23.6075C59.9991 24.0555 60.8951 24.2795 61.9031 24.2795ZM79.0669 16.5755H76.7389V27.1115H73.3309V16.5755H71.8189V13.8155H73.3309V13.1435C73.3309 11.5115 73.7949 10.3115 74.7229 9.54351C75.6509 8.77551 77.0509 8.41551 78.9229 8.46351V11.2955C78.1069 11.2795 77.5389 11.4155 77.2189 11.7035C76.8989 11.9915 76.7389 12.5115 76.7389 13.2635V13.8155H79.0669V16.5755ZM87.3403 16.5755H85.0123V27.1115H81.6043V16.5755H80.0923V13.8155H81.6043V13.1435C81.6043 11.5115 82.0683 10.3115 82.9963 9.54351C83.9243 8.77551 85.3243 8.41551 87.1963 8.46351V11.2955C86.3803 11.2795 85.8123 11.4155 85.4923 11.7035C85.1723 11.9915 85.0123 12.5115 85.0123 13.2635V13.8155H87.3403V16.5755ZM91.2218 12.2315C90.6298 12.2315 90.1338 12.0475 89.7338 11.6795C89.3498 11.2955 89.1578 10.8235 89.1578 10.2635C89.1578 9.70351 89.3498 9.23951 89.7338 8.87151C90.1338 8.48751 90.6298 8.29551 91.2218 8.29551C91.8138 8.29551 92.3018 8.48751 92.6858 8.87151C93.0858 9.23951 93.2858 9.70351 93.2858 10.2635C93.2858 10.8235 93.0858 11.2955 92.6858 11.6795C92.3018 12.0475 91.8138 12.2315 91.2218 12.2315ZM92.8778 13.8155V27.1115H89.5178V13.8155H92.8778ZM95.3334 20.4635C95.3334 19.0875 95.6134 17.8875 96.1734 16.8635C96.7334 15.8235 97.5094 15.0235 98.5014 14.4635C99.4934 13.8875 100.629 13.5995 101.909 13.5995C103.557 13.5995 104.917 14.0155 105.989 14.8475C107.077 15.6635 107.805 16.8155 108.173 18.3035H104.549C104.357 17.7275 104.029 17.2795 103.565 16.9595C103.117 16.6235 102.557 16.4555 101.885 16.4555C100.925 16.4555 100.165 16.8075 99.6054 17.5115C99.0454 18.1995 98.7654 19.1835 98.7654 20.4635C98.7654 21.7275 99.0454 22.7115 99.6054 23.4155C100.165 24.1035 100.925 24.4475 101.885 24.4475C103.245 24.4475 104.133 23.8395 104.549 22.6235H108.173C107.805 24.0635 107.077 25.2075 105.989 26.0555C104.901 26.9035 103.541 27.3275 101.909 27.3275C100.629 27.3275 99.4934 27.0475 98.5014 26.4875C97.5094 25.9115 96.7334 25.1115 96.1734 24.0875C95.6134 23.0475 95.3334 21.8395 95.3334 20.4635ZM122.995 20.1755C122.995 20.6555 122.963 21.0875 122.899 21.4715H113.179C113.259 22.4315 113.595 23.1835 114.187 23.7275C114.779 24.2715 115.507 24.5435 116.371 24.5435C117.619 24.5435 118.507 24.0075 119.035 22.9355H122.659C122.275 24.2155 121.539 25.2715 120.451 26.1035C119.363 26.9195 118.027 27.3275 116.443 27.3275C115.163 27.3275 114.011 27.0475 112.987 26.4875C111.979 25.9115 111.187 25.1035 110.611 24.0635C110.051 23.0235 109.771 21.8235 109.771 20.4635C109.771 19.0875 110.051 17.8795 110.611 16.8395C111.171 15.7995 111.955 14.9995 112.963 14.4395C113.971 13.8795 115.131 13.5995 116.443 13.5995C117.707 13.5995 118.835 13.8715 119.827 14.4155C120.835 14.9595 121.611 15.7355 122.155 16.7435C122.715 17.7355 122.995 18.8795 122.995 20.1755ZM119.515 19.2155C119.499 18.3515 119.187 17.6635 118.579 17.1515C117.971 16.6235 117.227 16.3595 116.347 16.3595C115.515 16.3595 114.811 16.6155 114.235 17.1275C113.675 17.6235 113.331 18.3195 113.203 19.2155H119.515ZM130.35 18.7115C130.35 17.0635 130.718 15.5915 131.454 14.2955C132.206 12.9835 133.222 11.9675 134.502 11.2475C135.798 10.5115 137.246 10.1435 138.846 10.1435C140.718 10.1435 142.358 10.6235 143.766 11.5835C145.174 12.5435 146.158 13.8715 146.718 15.5675H142.854C142.47 14.7675 141.926 14.1675 141.222 13.7675C140.534 13.3675 139.734 13.1675 138.822 13.1675C137.846 13.1675 136.974 13.3995 136.206 13.8635C135.454 14.3115 134.862 14.9515 134.43 15.7835C134.014 16.6155 133.806 17.5915 133.806 18.7115C133.806 19.8155 134.014 20.7915 134.43 21.6395C134.862 22.4715 135.454 23.1195 136.206 23.5835C136.974 24.0315 137.846 24.2555 138.822 24.2555C139.734 24.2555 140.534 24.0555 141.222 23.6555C141.926 23.2395 142.47 22.6315 142.854 21.8315H146.718C146.158 23.5435 145.174 24.8795 143.766 25.8395C142.374 26.7835 140.734 27.2555 138.846 27.2555C137.246 27.2555 135.798 26.8955 134.502 26.1755C133.222 25.4395 132.206 24.4235 131.454 23.1275C130.718 21.8315 130.35 20.3595 130.35 18.7115ZM157.076 13.6235C158.084 13.6235 158.98 13.8475 159.764 14.2955C160.548 14.7275 161.156 15.3755 161.588 16.2395C162.036 17.0875 162.26 18.1115 162.26 19.3115V27.1115H158.9V19.7675C158.9 18.7115 158.636 17.9035 158.108 17.3435C157.58 16.7675 156.86 16.4795 155.948 16.4795C155.02 16.4795 154.284 16.7675 153.74 17.3435C153.212 17.9035 152.948 18.7115 152.948 19.7675V27.1115H149.588V9.35151H152.948V15.4715C153.38 14.8955 153.956 14.4475 154.676 14.1275C155.396 13.7915 156.196 13.6235 157.076 13.6235ZM164.591 20.4155C164.591 19.0715 164.855 17.8795 165.383 16.8395C165.927 15.7995 166.655 14.9995 167.567 14.4395C168.495 13.8795 169.527 13.5995 170.663 13.5995C171.655 13.5995 172.519 13.7995 173.255 14.1995C174.007 14.5995 174.607 15.1035 175.055 15.7115V13.8155H178.439V27.1115H175.055V25.1675C174.623 25.7915 174.023 26.3115 173.255 26.7275C172.503 27.1275 171.631 27.3275 170.639 27.3275C169.519 27.3275 168.495 27.0395 167.567 26.4635C166.655 25.8875 165.927 25.0795 165.383 24.0395C164.855 22.9835 164.591 21.7755 164.591 20.4155ZM175.055 20.4635C175.055 19.6475 174.895 18.9515 174.575 18.3755C174.255 17.7835 173.823 17.3355 173.279 17.0315C172.735 16.7115 172.151 16.5515 171.527 16.5515C170.903 16.5515 170.327 16.7035 169.799 17.0075C169.271 17.3115 168.839 17.7595 168.503 18.3515C168.183 18.9275 168.023 19.6155 168.023 20.4155C168.023 21.2155 168.183 21.9195 168.503 22.5275C168.839 23.1195 169.271 23.5755 169.799 23.8955C170.343 24.2155 170.919 24.3755 171.527 24.3755C172.151 24.3755 172.735 24.2235 173.279 23.9195C173.823 23.5995 174.255 23.1515 174.575 22.5755C174.895 21.9835 175.055 21.2795 175.055 20.4635ZM185.633 16.5755V23.0075C185.633 23.4555 185.737 23.7835 185.945 23.9915C186.169 24.1835 186.537 24.2795 187.049 24.2795H188.609V27.1115H186.497C183.665 27.1115 182.249 25.7355 182.249 22.9835V16.5755H180.665V13.8155H182.249V10.5275H185.633V13.8155H188.609V16.5755H185.633Z"
    //             fill="url(#paint5_linear_154_706)"
    //           />
    //           <defs>
    //             <linearGradient
    //               id="paint0_linear_154_706"
    //               x1="14.6144"
    //               y1="0"
    //               x2="14.6144"
    //               y2="7.49463"
    //               gradientUnits="userSpaceOnUse"
    //             >
    //               <stop stop-color="#8548D0" />
    //               <stop offset="1" stop-color="#29BFFF" />
    //             </linearGradient>
    //             <linearGradient
    //               id="paint1_linear_154_706"
    //               x1="30.3534"
    //               y1="2.99802"
    //               x2="30.3534"
    //               y2="14.24"
    //               gradientUnits="userSpaceOnUse"
    //             >
    //               <stop stop-color="#8548D0" />
    //               <stop offset="1" stop-color="#29BFFF" />
    //             </linearGradient>
    //             <linearGradient
    //               id="paint2_linear_154_706"
    //               x1="31.8523"
    //               y1="17.2374"
    //               x2="31.8523"
    //               y2="34.4751"
    //               gradientUnits="userSpaceOnUse"
    //             >
    //               <stop stop-color="#8548D0" />
    //               <stop offset="1" stop-color="#29BFFF" />
    //             </linearGradient>
    //             <linearGradient
    //               id="paint3_linear_154_706"
    //               x1="13.4904"
    //               y1="26.981"
    //               x2="13.4904"
    //               y2="38.223"
    //               gradientUnits="userSpaceOnUse"
    //             >
    //               <stop stop-color="#8548D0" />
    //               <stop offset="1" stop-color="#29BFFF" />
    //             </linearGradient>
    //             <linearGradient
    //               id="paint4_linear_154_706"
    //               x1="10.1178"
    //               y1="10.4924"
    //               x2="10.1178"
    //               y2="24.7322"
    //               gradientUnits="userSpaceOnUse"
    //             >
    //               <stop stop-color="#8548D0" />
    //               <stop offset="1" stop-color="#29BFFF" />
    //             </linearGradient>
    //             <linearGradient
    //               id="paint5_linear_154_706"
    //               x1="38.2003"
    //               y1="1.11152"
    //               x2="199.933"
    //               y2="8.44313"
    //               gradientUnits="userSpaceOnUse"
    //             >
    //               <stop stop-color="#8548D0" />
    //               <stop offset="1" stop-color="#0771DE" />
    //             </linearGradient>
    //           </defs>
    //         </svg>
    //       </Typography>

    //       {/* <Box
    //         sx={{
    //           width: "128px", // Fixed width
    //           height: "32px", // Fixed height
    //           gap: "32px", // Gap between children, equivalent to var(--Spacing32)
    //           opacity: 0, // Fully transparent (invisible)
    //         }}
    //       /> */}
    //       <Box sx={{ display: "", alignItems: "right" }}>
    //         <IconButton
    //           size="large"
    //           aria-label="show new notifications"
    //           sx={{ mx: 2, color: "black" }}
    //         >
    //           <SearchIcon />
    //         </IconButton>

    //         <IconButton
    //           size="large"
    //           aria-label="show new notifications"
    //           // color="black"
    //           sx={{ mx: 2, color: "black" }}
    //         >
    //           <NotificationsNoneIcon />
    //         </IconButton>

    //         {/* <Typography>{user?.userdata?.Username}</Typography> */}

    //         <IconButton
    //           size="large"
    //           aria-label="account of current user"
    //           aria-controls={menuId}
    //           aria-haspopup="true"
    //           onClick={handleProfileMenuOpen}
    //           sx={{ mx: 2, color: "black" }}
    //         >
    //           <AccountCircle />
    //         </IconButton>
    //       </Box>

    //       <Box sx={{ display: { xs: "flex", md: "none" } }}>
    //         <IconButton
    //           size="large"
    //           aria-label="show more"
    //           aria-controls={mobileMenuId}
    //           aria-haspopup="true"
    //           onClick={handleMobileMenuOpen}
    //           color="inherit"
    //         >
    //           <MoreIcon />
    //         </IconButton>
    //       </Box>
    //     </Toolbar>
    //   </AppBar>
    //   {renderMobileMenu}
    //   {renderMenu}
    // </Box>
  );
}

export default Header;
