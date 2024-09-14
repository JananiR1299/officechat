import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Footer from "./Footer";
import Header from "./Header";
import ChatComponent from "./RenderChatComponent";
import { Message, User } from "./messagetypes";
import axios from "axios";
import { useUser } from "../../context/UserContext";

interface ChatAreaProps {
  userDetails: User; // Adjust type if needed
}

const ChatArea: React.FC<ChatAreaProps> = ({ userDetails }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Set initial loading state to true
  const [noConversation, setNoConversation] = useState<boolean>(false);

  const { activeGroup, activeUser, headerTitle, setHeaderTitle, user } =
    useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Start loading before fetching messages
      // setNoConversation(false); // Reset noConversation state
      console.log("activeUser");
      try {
        let response;
        if (userDetails?.GroupID) {
          response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/groupmessages?groupid=${userDetails.GroupID}`
          );
        } else if (activeUser) {
          response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/messages/${activeUser}`
          );
        } else if (activeGroup) {
          response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/groupmessages?groupid=${userDetails.GroupID}`
          );
        } else {
          return;
        }
        console.log("responsedata", response.data);

        if (
          response.data.error ||
          response.data.length === 0 ||
          response.data === undefined
        ) {
          console.log("No messages found:", response.data || "Empty data");

          setMessageList(response.data);
          setLoading(false);
        } else {
          console.log("response.data", response.data);

          setMessageList(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        if (error.response && error.response.status === 404) {
          console.log("No messages found, 404 error", error.response.data);
          setMessageList(error.response.data); // Set custom error message for 404
        } else {
          console.error("Error fetching messages:", error);
          setMessageList(error.response.data); // Set generic error message
        }
      } finally {
        setLoading(false); // Stop loading state in both success and error cases
      }
    };

    fetchMessages();
  }, [userDetails?.GroupID, activeUser, activeGroup, setHeaderTitle]);

  const handleGroupCreate = (newGroup: User) => {
    setSelectedUser({
      ...newGroup,
      GroupID: newGroup.GroupID,
      GroupName: newGroup.GroupName,
    });
    setHeaderTitle(newGroup.GroupName);
    setMessageList([]);
  };

  useEffect(() => {
    if (userDetails) {
      setHeaderTitle(userDetails.GroupName || userDetails.Username);
      // setMessageList([]);
    }
  }, [userDetails]);
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Header
          Title={headerTitle}
          selectedUser={selectedUser || userDetails}
          onGroupCreate={handleGroupCreate}
        />
        {loading ? (
          <Box sx={{ height: "320px" }}>
            <Typography
              variant="body1"
              sx={{
                height: "320px",
                display: "flex", // Use flexbox
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
              }}
            >
              Loading...
            </Typography>
          </Box>
        ) : (
          <ChatComponent
            userDetails={selectedUser || userDetails}
            messageList={messageList}
          />
        )}
        <Footer
          userDetails={selectedUser || userDetails}
          setMessageList={setMessageList}
        />
      </Box>
    </>
  );
};

export default ChatArea;
