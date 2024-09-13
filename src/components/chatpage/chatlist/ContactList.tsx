import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
} from "@mui/material";
import io from "socket.io-client";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, Tabs, Tab } from "@mui/material";
import { useUser } from "../../context/UserContext";

interface Contact {
  id: number;
  name: string;
  image: string;
  isActive: boolean;
  UserID: number;
  Username: string;
  ProfilePicture: string;
  GroupID?: number;
  GroupName?: string;
  GroupAvatar?: string;
  isGroupChat?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  greenDot?: boolean;
}

interface ContactListProps {
  onSelectUser: (user: Contact) => void;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: 1300,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  color: "rgba(102, 112, 133, 1)",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "400",
  width: "100%",
  height: "44px",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "44px",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // border: "1.67px solid rgba(102, 112, 133, 1)",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create("width"),
    // width: "250px",
    border: "1px solid rgba(208, 213, 221, 1)",
    borderRadius: "8px",
  },
}));

const socket = io(process.env.REACT_APP_SOCKET_URL);

const ContactList: React.FC<ContactListProps> = ({ onSelectUser }) => {
  const { user, groups, setGroups } = useUser();
  const [, setError] = useState<string | null>(null);
  const [loggedInUsers, setLoggedInUsers] = useState<any[]>([]);
  const [showMessages, setShowMessages] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Contact[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const {
    activeGroup,
    setActiveGroup,
    activeUser,
    setActiveUser,
    setSelectedUserId,
    Contact,
    setContact,
  } = useUser();

  // const handleSelectUser = (user: Contact) => {
  //   setActiveUser(user.UserID);
  //   onSelectUser(user);
  //   setSuggestionsVisible(false);
  // };

  const fetchSearchSuggestions = async (searchQuery: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/usernamesugggestions`,
        { params: { query: searchQuery } }
      );
      setSearchSuggestions(response.data);
      setSuggestionsVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (searchValue) {
      fetchSearchSuggestions(searchValue);
    } else {
      setSearchSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/users/${user?.userdata?.UserID}`
      )
      .then((response) => {
        const users = response.data.map((user: Contact) => ({
          ...user,
          lastMessage: user.lastMessage || "No messages yet",
          lastMessageTime: user.lastMessageTime || new Date().toISOString(),
        }));
        console.log("usersu", users);
        setContact(users);
        if (users.length > 0) {
          const firstUser = users[0];
          setActiveUser(firstUser.UserID);
          setSelectedUserId(firstUser.UserID);
          onSelectUser(firstUser);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [user?.userdata?.UserID, setContact]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/grouplist`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });

    return () => {
      socket.off("userStatusUpdate");
    };
  }, [setGroups]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getActiveUser`
        );

        setLoggedInUsers(response.data);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [setLoggedInUsers]);

  useEffect(() => {
    const updatedArray = Contact.map((item) => ({
      ...item,
      isActive: loggedInUsers.includes(item.UserID) ? true : false,
    }));
    if (JSON.stringify(updatedArray) !== JSON.stringify(Contact)) {
      setContact(updatedArray);
    }
  }, [loggedInUsers, Contact, setContact]);

  const handleContactClick = (user: any) => {
    onSelectUser(user);
    setSelectedUserId(user.UserID);
    setActiveUser(user.UserID);
    setActiveGroup(null);
  };

  const handleGroupClick = (group: any) => {
    // alert(groupid);
    onSelectUser(group);
    setActiveGroup(group.GroupID);
    setActiveUser(null);
  };

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setContact((prevContacts) =>
        prevContacts.map((contact) =>
          contact.UserID === message.senderId
            ? {
                ...contact,
                lastMessage: message.text,
                lastMessageTime: new Date().toISOString(),
              }
            : contact
        )
      );
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, setContact]);

  return (
    <Box
      sx={{
        p: 0,
        width: "35%",
        borderRight: "1px solid rgba(234, 236, 240, 1)",
      }}
    >
      <Grid>
        <Box>
          <Box sx={{}}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center", // Aligns items vertically in the center
                // gap: "2px", // Adjust gap between text and number if needed
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  p: 2,
                  // bgcolor: "#ebebeb40",
                  color: "#101828",

                  // borderBottom: "2px solid #80808021",
                  fontWeight: 600,
                  fontSize: "18px",
                  lineHeight: "28px",
                }}
              >
                Messages
              </Typography>
              <Box>
                <Typography
                  sx={{
                    background: "#FFFFFF",
                    // width: "28px",
                    // height: "22px",
                    padding: "2px 3px",
                    // gap: "0px",
                    borderRadius: "6px",
                    border: "1px solid rgba(208, 213, 221, 1)",
                    fontSize: "12px", // Adjust to make it look proportionate
                    fontWeight: 500,
                    textAlign: "center",
                    // opacity: 1, // Make sure it's visible
                    lineHeight: "18px",
                    color: "rgba(52, 64, 84, 1)",
                  }}
                >
                  40
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box sx={{ mt: 1, mb: 1 }}>
              <ButtonGroup
                variant="text"
                aria-label="text button group"
                sx={{
                  width: "90%",
                  height: "45px",
                  marginLeft: "20px",
                  backgroundColor: "#ccc",
                  display: "flex",
                  flexDirection: "row",
                  "& > *": {
                    flex: 1,
                    borderRadius: "10px",
                    paddingBottom: "5px",
                  },
                }}
              >
                <Button
                  variant={showMessages ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: showMessages ? "white" : "ghostwhite",
                    color: "black",
                    borderRadius: "5px",
                    alignItems: "center",
                    "&:hover": {
                      backgroundColor: showMessages ? "white" : "ghostwhite",
                    },
                    boxShadow: showMessages
                      ? "0px 2px 4px rgba(0,0,0,0.2)"
                      : "none",
                  }}
                  onClick={() => setShowMessages(true)}
                >
                  Chat
                </Button>
                <Button
                  variant={!showMessages ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: !showMessages ? "white" : "ghostwhite",
                    color: "black",
                    "&:hover": {
                      backgroundColor: !showMessages ? "white" : "ghostwhite",
                    },
                    boxShadow: !showMessages
                      ? "0px 2px 4px rgba(0,0,0,0.2)"
                      : "none",
                  }}
                  onClick={() => setShowMessages(false)}
                >
                  Groups
                </Button>
              </ButtonGroup>
            </Box>
          </Box>
          <Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Search sx={{ margin: "15px" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  sx={{ width: "100%", height: "44px" }}
                  placeholder="Search…"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Box>
          </Box>
          <Box>
            {showMessages ? (
              Contact.filter((contact) =>
                contact.Username.toLowerCase().includes(
                  searchTerm.toLowerCase()
                )
              ).map((contact) => (
                <Grid
                  item
                  xs={12}
                  key={contact.UserID}
                  onClick={() => handleContactClick(contact)}
                  sx={{ cursor: "pointer" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "1px solid #e0e0e0",
                      padding: "16px",
                      gap: "16px",
                      bgcolor:
                        activeUser === contact.UserID
                          ? " rgba(226, 241, 255, 1)"
                          : "white",
                      "&:hover": {
                        bgcolor: "rgba(226, 241, 255, 1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        alignItems: "center",
                        marginTop: "1%",
                      }}
                    >
                      <Box sx={{}}>
                        <Box sx={{ position: "relative", top: "10%" }}>
                          <Avatar
                            alt={contact.Username}
                            src={contact.ProfilePicture || undefined}
                            sx={
                              {
                                // position: "relative",
                                // mr: 2,
                                // width: "60px",
                                // height: "60px",
                              }
                            }
                          />
                        </Box>
                        {contact.isActive ? (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              bgcolor: "rgba(23, 178, 106, 1)",
                              border: "1.5px solid rgba(255, 255, 255, 1)",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              width: 10,
                              height: 10,
                              borderRadius: 5,
                              bgcolor: "rgba(208, 213, 221, 1)",

                              border: "1.5px solid rgba(255, 255, 255, 1)",
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "600",
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: "rgba(52, 64, 84, 1)",
                        }}
                      >
                        {contact.Username}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "400",
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: " rgba(71, 84, 103, 1)",
                        }}
                      >
                        {/* {contact.lastMessage || "No message"} */}
                        Some Text to write
                      </Typography>
                    </Box>
                    {/* {contact.isActive && (
                        <Typography variant="caption" color="green">
                          Online
                        </Typography>
                      )} */}
                  </Box>
                </Grid>
              ))
            ) : (
              <Box
                sx={{
                  overflow: "auto",
                  height: "310px",
                  "&::-webkit-scrollbar": {
                    width: "0",
                    transition: "width 0.3s ease",
                  },
                  "&:hover::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                }}
              >
                {groups
                  .filter((group) =>
                    group.GroupName.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )
                  )
                  .map((group) => (
                    <Grid
                      item
                      xs={12}
                      key={group.GroupID}
                      onClick={() => handleGroupClick(group)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderBottom: "1px solid #e0e0e0",
                          padding: "16px",
                          gap: "16px",
                          bgcolor:
                            activeGroup === group.GroupID
                              ? " rgba(226, 241, 255, 1)"
                              : "white",
                          "&:hover": {
                            bgcolor: "rgba(226, 241, 255, 1)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            alignItems: "center",
                            marginTop: "1%",
                          }}
                        >
                          <Box sx={{}}>
                            <Box sx={{ position: "relative", top: "10%" }}>
                              <Avatar alt={group.GroupName} />
                            </Box>
                            <Box
                            // sx={{
                            //   position: "absolute",
                            //   bottom: 0,
                            //   right: 0,
                            //   width: 10,
                            //   height: 10,
                            //   borderRadius: 5,
                            //   bgcolor: "rgba(23, 178, 106, 1)",
                            //   border: "1.5px solid rgba(255, 255, 255, 1)",
                            // }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "600",
                              fontSize: "14px",
                              lineHeight: "20px",
                              color: "rgba(52, 64, 84, 1)",
                            }}
                          >
                            {group.GroupName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "400",
                              fontSize: "14px",
                              lineHeight: "20px",
                              color: " rgba(71, 84, 103, 1)",
                            }}
                          >
                            {/* {contact.lastMessage || "No message"} */}
                            Some Text to write
                          </Typography>
                        </Box>
                        {/* {contact.isActive && (
                        <Typography variant="caption" color="green">
                          Online
                        </Typography>
                      )} */}
                      </Box>
                    </Grid>
                  ))}
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default ContactList;
