import axios from "axios";
import React, { MouseEvent, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CloseIcon from "@mui/icons-material/Close";
import { User } from "./messagetypes";
import GroupIcon from "@mui/icons-material/Group";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useUser } from "../../context/UserContext";
import io from "socket.io-client";
import Suggestions from "../Header/Suggestions";
import AgoraClient from "../../VoiceCall/AgoraClient";
import { AgoraRTCProvider } from "agora-rtc-react";
import CallIcon from "@mui/icons-material/Call";
import CallPopup from "../../VoiceCall/CallPopup";
import ActionModal from "./ActionModal";
import AgoraRTC, { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
// import { IconButton } from '@mui/material';
import CallEndIcon from "@mui/icons-material/CallEnd";

const socket = io(process.env.REACT_APP_SOCKET_URL);
const rtcClient: any = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

interface HeaderProps {
  selectedUser: User;
  onGroupCreate;
  Title: string | null;
}

const Header: React.FC<HeaderProps> = ({ selectedUser, onGroupCreate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // State for child popover
  const [childAnchorEl, setChildAnchorEl] = useState<null | HTMLElement>(null);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUserIDs, setSelectedUserIDs] = useState<number[]>([]);
  const [, setGroupDetails] = useState();
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [secondary] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    actionText: "",
    onConfirm: () => {},
  });

  const {
    setGroups,
    setActiveGroup,
    setActiveUser,
    setselectActiveUser,
    user,
    headerTitle,
    activeUser,
  } = useUser();
  const [channelName, setChannelName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  // const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [incomingCall, setIncomingCall] = useState<string | null>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const [, setIsCallPopupVisible] = useState(false);
  const [callDuration, setCallDuration] = useState<number>(0); // Call duration in seconds
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [, setCallData] = useState<{
    CallerID: number;
    ReceiverID: number | undefined;
    StartTime: Date;
    EndTime: Date | null;
    CallType: string;
    ScreenShared: boolean;
  } | null>(null);

  const [showCallPopup, setShowCallPopup] = useState(false);

  const handleChildClick = (event: React.MouseEvent<HTMLElement>) => {
    setChildAnchorEl(event.currentTarget);
  };

  const handleChildClose = () => {
    setChildAnchorEl(null);
  };
  var callerdetail;

  useEffect(() => {
    // console.log(activeUser);
    socket.emit("register", user?.userdata?.UserID);

    socket.on(
      "incomingCall",
      async (data: {
        channelName: string;
        token: string;
        callerId: string;
      }) => {
        setChannelName(data.channelName);
        setToken(data.token);
        setIncomingCall(data.callerId);

        console.log("Incoming call data", data);
      }
    );

    socket.on("callAccepted", ({ channelName, callerId }) => {
      console.log(`Call accepted by ${callerId}`);
      setChannelName(channelName);
      setToken(token);
    });

    socket.on("callRejected", ({ callerId }) => {
      console.log(`Call rejected by ${callerId}`);
      setIncomingCall(null);
      setChannelName("");
      setToken("");
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }
    });

    if (incomingCall) {
      setShowCallPopup(true);
    }

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callRejected");
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [token, user, incomingCall]);

  const startCallTimer = () => {
    setCallDuration(0); // Reset the timer
    callTimerRef.current = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const startCall = async () => {
    if (!selectedUser) return; // Handle case where selectedUser might be null

    const generatedChannelName = "testChannel";
    const callerId = user?.userdata?.UserID;
    const receiverId = selectedUser?.UserID;

    console.log("Starting call with:", {
      channelName: generatedChannelName,
      callerId,
      receiverIds: [receiverId],
    });

    socket.emit("callUsers", {
      channelName: generatedChannelName,
      callerId,
      receiverIds: [receiverId],
    });

    try {
      const callData = {
        CallerID: user?.userdata?.UserID as number,
        ReceiverID: selectedUser?.UserID,
        StartTime: new Date(),
        EndTime: null,
        CallType: "audio",
        ScreenShared: false,
      };

      setCallData(callData);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/postCall`,
        callData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Call data stored successfully:", response.data);
    } catch (error) {
      console.error("Error storing call data:", error);
    }
  };

  const handleCallAccepted = async () => {
    startCallTimer();
    try {
      console.log("Call accepted");
      setCallAccepted(true);
      setIsCallPopupVisible(false);
      setShowCallPopup(false);
      socket.emit("callAccepted", { channelName, callerId: incomingCall });
      const appId: string = "1369151da2df4f33bdd842b8c0797085";
      // Ensure user joins the Agora channel before publishing
      const uid = await rtcClient.join(
        appId,
        channelName,
        token,
        user?.userdata?.UserID
      );
      console.log("User joined the channel:", uid);
      // Start the local audio track
      const localAudioTrack: IMicrophoneAudioTrack =
        await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localAudioTrack;

      // Publish the audio track
      await rtcClient.publish([localAudioTrack]);
      console.log("Audio track published successfully");
    } catch (error) {
      console.error("Error accepting the call:", error);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      console.log("Call rejected");
      // alert("call end");
      socket.emit("callRejected", { channelName, callerId: incomingCall });
      setIncomingCall(null);
      setChannelName("");
      setToken("");
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }
    }
  };

  const handlePopoverOpen = async (event: MouseEvent<HTMLElement>) => {
    console.log("currenttarget", selectedUser?.GroupID);
    setAnchorEl(event.currentTarget);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/groupmembers/${selectedUser?.GroupID}`
      );
      setGroupMembers(response.data);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate("/video-call");
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const fetchSuggestions = async (searchQuery) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/usernamesugggestions`,
        {
          params: { query: searchQuery },
        }
      );
      console.log("resssssssssssss", response.data);
      setSuggestions(response.data);
      setSuggestionsVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value); // Update the query state
    if (value) {
      fetchSuggestions(value); // Fetch suggestions if there's input
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  const handleCreateGroup = async () => {
    console.log("Selected User IDs:", selectedUserIDs);
    console.log("Logged-in User ID:", (selectedUser as User).UserID);

    const loggedInUserId = user?.userdata?.UserID || null;

    const namesArray = query
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    const groupname = [(selectedUser as User).Username, ...namesArray].join(
      ", "
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/creategroup`,
        {
          GroupName: groupname,
          Username: [(selectedUser as User).Username, ...namesArray],
          CreatedBy: loggedInUserId,
          CreatedAt: new Date(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response", response.data);
      setGroupDetails(response.data);
      const newGroup = response.data;

      setGroups((prevGroups) => [newGroup, ...prevGroups]);
      setActiveGroup(response.data.GroupID);
      setActiveUser(null);
      setselectActiveUser(null);
      onGroupCreate(newGroup); // Pass the new group information
      setQuery(""); // Clear the input

      handlePopoverClose(); // Close the popover after action
    } catch (error: any) {
      console.error("Error sending data:", error);
    }
  };

  const { GroupID } = selectedUser;
  const namesArray = query
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/addUsers?`,
        {
          // Email: groupEmail,
          GroupID: GroupID,
          Usernames: namesArray || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedGroup = response.data.group;
      setGroupDetails(updatedGroup); // Update with new group details
      setActiveGroup(updatedGroup.GroupID); // Ensure active group is updated
      setActiveUser(null);
      // setGroupDetails(response.data.group);
      // setHeaderTitle(response.data.group.GroupName);
    } catch (error: any) {
      console.error("Error sending data:", error);
    }
  };

  const handleSelectUser = (username) => {
    setQuery(username);
    setSelectedUserIDs(username);
    setSuggestions([]);
    setSuggestionsVisible(false);
  };

  const endCall = () => {
    if (incomingCall) {
      console.log("Call rejected");
      // alert("call end");
      socket.emit("callRejected", { channelName, callerId: incomingCall });
      setIncomingCall(null);
      setChannelName("");
      setToken("");
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleDelete = async (userId: number, groupId: number) => {
    try {
      // Make API call to delete user from the group
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/groups/${groupId}/members/${userId}`
      );

      // Update local state to remove the deleted user
      setGroupMembers((prevMembers) =>
        prevMembers.filter((member) => member.UserID !== userId)
      );
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle the error, e.g., show a notification
    }
  };

  const handleOpenModal = (
    actionType: "delete" | "leave",
    userId: number,
    groupId: number
  ) => {
    const isDeleteAction = actionType === "delete";
    setModalContent({
      title: isDeleteAction ? "Remove User" : "Leave Group",
      description: isDeleteAction
        ? "Are you sure you want to remove this user from the group?"
        : "Are you sure you want to leave this group?",
      actionText: isDeleteAction ? "Remove" : "Leave",
      onConfirm: () => handleDelete(userId, groupId),
    });
    setOpenModal(true);
  };

  console.log("selectedUser", selectedUser?.isActive);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {selectedUser ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              height: "80px",
              borderBottom: "1px solid #ccc",
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "20px",
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
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      alt={
                        selectedUser.UserID
                          ? selectedUser.Username
                          : selectedUser.GroupName
                      }
                      src={selectedUser.ProfilePicture || undefined}
                      sx={{ width: "56px", height: "56px" }}
                    />
                  </Box>
                  {selectedUser?.isActive ? (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: "2%",
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
                        bottom: "2%",
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
                {/* {selectedUser.isActive && ( */}
              </Box>
              <Box>
                {/* )} */}
                <Typography variant="h6" color="black">
                  {headerTitle
                    ? headerTitle
                    : selectedUser.UserID
                    ? selectedUser.Username
                    : selectedUser.GroupName}
                </Typography>
                <span
                  style={{
                    // position: "absolute",
                    //marginLeft: "10px",
                    // top: "17%",
                    // left: "36%",
                    width: "49px",
                    height: "22px",
                    borderRadius: "10%",
                    border: "1px solid #ccc",
                    textAlign: "center",
                    padding: "2px 6px 2px 6px",
                  }}
                >
                  online
                </span>
              </Box>
            </Box>
            <AgoraRTCProvider client={rtcClient}>
              <div>
                {showCallPopup && (
                  <CallPopup
                    incomingCall={incomingCall!}
                    caller={callerdetail}
                    onAccept={handleCallAccepted}
                    onReject={rejectCall}
                  />
                )}

                {callAccepted && channelName && token && (
                  <div>
                    <AgoraClient channelName={channelName} token={token} />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3, // You can adjust the gap value as needed
                      }}
                    >
                      <div>Call Duration: {formatTime(callDuration)}</div>
                      <IconButton
                        onClick={() => endCall()} // Your function to end the call
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          marginBottom: "20px",
                        }}
                      >
                        <CallEndIcon />
                      </IconButton>
                    </Box>
                  </div>
                )}
              </div>
            </AgoraRTCProvider>
            {/* <Box sx={{ gap: "10px", display: "flex" }}>
              <IconButton
                sx={{
                  // marginLeft: "550px",
                  backgroundImage:
                    "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)",
                  color: "white", // Optionally change the text/icon color if needed
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #29BFFF 0%,  #8548D0 100%)", // Optional hover effect
                  },
                }}
                onClick={startCall}
              >
                <CallIcon />
              </IconButton>
              <IconButton
                sx={{
                  padding: "8px", // Adjust padding for proper size
                  backgroundImage:
                    "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)",
                  color: "white", // Ensure icon color is visible against the gradient
                  borderRadius: "50%", // Make the background round
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #29BFFF 0%,  #8548D0 100%)", // Optional hover effect
                  },
                }}
                onClick={handleVideoClick}
              >
                <VideocamIcon sx={{ fontSize: 25 }} />
              </IconButton>

              <IconButton
                sx={{
                  padding: "8px", // Adjust padding for proper size
                  backgroundImage:
                    "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)",
                  color: "white", // Ensure icon color is visible against the gradient
                  borderRadius: "50%", // Make the background round
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #29BFFF 0%,  #8548D0 100%)", // Optional hover effect
                  },
                }}
                onClick={handlePopoverOpen}
              >
                <PersonAddAltIcon sx={{ fontSize: 25 }} />
              </IconButton>

              <IconButton
                sx={{
                  backgroundImage:
                    "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)",
                  color: "white", // Change the text color if needed
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #29BFFF 0%,  #8548D0 100%)", // Optional hover effect
                  },
                }}
              >
                <MoreVertOutlinedIcon
                  sx={{
                    backgroundImage:
                      "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)",
                    "&:hover": {
                      backgroundImage:
                        "linear-gradient(180deg, #29BFFF 0%,  #8548D0 100%)", // Optional hover effect
                    },
                  }}
                />
              </IconButton>
            </Box> */}

            <Box sx={{ gap: "10px", display: "flex" }}>
              <IconButton
                sx={{
                  backgroundColor: "white", // Changed to white for the icon color
                  color: "#8548D0", // Changed to the original background color
                  border: "2px solid #8548D0",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)", // Optional hover effect
                    color: "white", // Ensure text color is visible
                    border: "2px solid white",
                  },
                }}
                onClick={startCall}
              >
                <CallIcon />
              </IconButton>

              <IconButton
                sx={{
                  padding: "8px", // Adjust padding for proper size
                  backgroundColor: "white", // Changed to white for the icon color
                  color: "#8548D0", // Changed to the original background color
                  borderRadius: "50%", // Make the background round
                  border: "2px solid #8548D0",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)", // Optional hover effect
                    color: "white", // Ensure text color is visible
                    border: "2px solid white",
                  },
                }}
                onClick={handleVideoClick}
              >
                <VideocamIcon sx={{ fontSize: 25 }} />
              </IconButton>

              <IconButton
                sx={{
                  padding: "8px", // Adjust padding for proper size
                  backgroundColor: "white", // Changed to white for the icon color
                  color: "#8548D0", // Changed to the original background color
                  borderRadius: "50%", // Make the background round

                  border: "2px solid #8548D0",
                  "&:hover": {
                    backgroundImage:
                      "linear-gradient(180deg, #8548D0 0%, #29BFFF 100%)", // Optional hover effect
                    color: "white", // Ensure text color is visible
                    border: "2px solid white",
                  },
                }}
                onClick={handlePopoverOpen}
              >
                <PersonAddAltIcon sx={{ fontSize: 25 }} />
              </IconButton>

              <IconButton>
                <MoreVertOutlinedIcon
                  sx={{
                    color: "black",
                    width: "30px", // Adjust width as needed
                    height: "30px",
                  }}
                />
              </IconButton>
            </Box>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{ p: 2 }}
            >
              {selectedUser.UserID ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: 2,
                    position: "relative", // This ensures that suggestions are positioned relative to the box
                  }}
                >
                  <TextField
                    label="Enter Username"
                    type="email"
                    value={query}
                    onChange={handleEmailChange}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                  {suggestionsVisible && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "100%", // Position the suggestions below the TextField
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        backgroundColor: "white", // Ensure it's visible
                        boxShadow: 3,
                        borderRadius: 1,
                      }}
                    >
                      <Suggestions
                        suggestions={suggestions}
                        onSelect={handleSelectUser}
                      />
                    </Box>
                  )}
                  <Button variant="contained" onClick={handleCreateGroup}>
                    Create Group
                  </Button>
                </Box>
              ) : (
                <Box sx={{ width: "200px" }}>
                  <Typography sx={{ padding: "10px" }}>
                    People({groupMembers.length})
                  </Typography>

                  <List>
                    {groupMembers.map((member) => (
                      <ListItem
                        key={member.UserID}
                        sx={{
                          height: "50px",
                          "&:hover": {
                            backgroundColor: "#f0f0f0", // Change to your desired hover color
                            cursor: "pointer",
                          },
                        }}
                        onMouseEnter={() => setHoveredUserId(member.UserID)}
                        onMouseLeave={() => setHoveredUserId(null)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon
                              sx={{ width: "20px", height: "20px" }}
                            />
                          </Avatar>
                        </ListItemAvatar>
                        {/* <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon> */}
                        <ListItemText
                          primary={member.Username} // Ensure this matches the correct property name in your data
                          secondary={
                            member.UserID === user?.userdata?.UserID
                              ? "You"
                              : null
                          }
                        />{" "}
                        {hoveredUserId === member.UserID &&
                          member.UserID !== user?.userdata?.UserID && (
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                handleOpenModal(
                                  "delete",
                                  member.UserID,
                                  member.GroupID
                                )
                              }
                              // onClick={() =>
                              //   handleDelete(member.UserID, member.GroupID)
                              // } // Add your delete logic here
                              size="small"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                      </ListItem>
                    ))}
                    <hr></hr>
                    <ListItem
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f0f0f0", // Change to your desired hover color
                          cursor: "pointer",
                        },
                      }}
                      onClick={handleChildClick}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <GroupAddIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Add People" // Ensure this matches the correct property name in your data
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>

                    <ListItem
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f0f0f0", // Change to your desired hover color
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        handleOpenModal(
                          "leave",
                          user?.userdata?.UserID,
                          selectedUser.GroupID
                        )
                      }

                      // onClick={() =>
                      //   handleDelete(
                      //     user?.userdata?.UserID,
                      //     selectedUser.GroupID
                      //   )
                      // }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonAddAltIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Leave" // Ensure this matches the correct property name in your data
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                  </List>

                  {/* Reusable Modal */}
                  <ActionModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    title={modalContent.title}
                    description={modalContent.description}
                    actionText={modalContent.actionText}
                    onConfirm={modalContent.onConfirm}
                  />

                  {/* </Demo> */}
                </Box>
              )}
            </Popover>
          </Box>
        ) : (
          <Typography variant="h5" sx={{ p: 2 }}></Typography>
        )}
      </Box>
    </>
  );
};

export default Header;
