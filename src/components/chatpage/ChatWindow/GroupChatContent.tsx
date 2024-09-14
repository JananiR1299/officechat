import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Modal,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Message } from "./messagetypes";
import moment from "moment";
import { useUser } from "../../context/UserContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface GroupChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const GroupChatContent: React.FC<GroupChatContentProps> = ({
  userDetails,
  messageList,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user, selectActiveUser } = useUser();

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  // Helper function to format time
  const formatTime = (timestamp: string) => {
    return moment(timestamp).format("hh:mm A");
  };

  // Helper function to format day
  const formatDay = (timestamp: string) => {
    return moment(timestamp).format("dddd, MMMM Do YYYY");
  };

  // Function to determine if a string is an image URL
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  const handleOpenImage = (url: string) => {
    setSelectedImage(url);
    setOpen(true);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setOpen(false);
  };

  // Function to sort messages by timestamp and then group by day
  const groupMessagesByDay = (messages) => {
    console.log("groupmessages", messages);
    if (messages.error) {
      console.log("Error");
    }
    const sortedMessages = [...messages].sort((a, b) =>
      moment(a.SentAt).diff(moment(b.SentAt))
    );

    const groupedMessages: { [key: string]: Message[] } = {};

    sortedMessages.forEach((message) => {
      const day = formatDay(message.SentAt);
      if (!groupedMessages[day]) {
        groupedMessages[day] = [];
      }
      groupedMessages[day].push(message);
    });

    return groupedMessages;
  };
  // Check if messageList contains an error
  if ("error" in messageList) {
    console.log("5345345", messageList);
    return (
      <Container>
        <Box
          sx={{
            height: "310px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="error" align="center">
            {" "}
            "There is no messages in this group."
            {/* {messageList.error} */}
          </Typography>
        </Box>
      </Container>
    );
  }
  const groupedMessages = groupMessagesByDay(messageList);
  console.log("singlechatcontent", messageList);
  // if (messageList === "There is No messages in this group.") {
  //   return (
  //     <Container>
  //       <Box>
  //         <Typography>There is No messages in this group.</Typography>
  //       </Box>
  //     </Container>
  //   );
  // }
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messageList]);
  return (
    <Container>
      <Box
        sx={{
          // flex: 1,
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
        {Object.entries(groupedMessages).map(([day, messages]) => (
          <React.Fragment key={day}>
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
                  height: "1px",
                  backgroundColor: "rgba(234, 236, 240, 1)",
                  margin: "0 8px", // Adjust the spacing between the text and the line
                },
              }}
            >
              {day}
            </Typography>
            <List>
              {messages?.map((messageContent, index) => {
                const isSender =
                  user?.userdata?.UserID === messageContent.SenderID;
                const isImage = isImageUrl(messageContent.Content);

                return (
                  <ListItem
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isSender ? "flex-end" : "flex-start",
                      padding: "0px",
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      align={isSender ? "left" : "right"}
                      sx={{
                        marginBottom: "4px",
                        alignSelf: isSender ? "flex-start" : "flex-end",
                        marginLeft: isSender ? "320px" : "0px",
                        marginRight: isSender ? "0px" : "320px",
                      }}
                    >
                      {formatTime(messageContent.SentAt)}
                    </Typography>
                    <Box
                      sx={{
                        maxWidth: "40%",
                        minWidth: "40%",
                        padding: "0.75rem",
                        borderRadius: isSender
                          ? "0px 10px 10px 10px"
                          : "10px 0px 10px 10px",
                        backgroundImage: isSender
                          ? "linear-gradient(to right, #f4f3f1, #f4f3f1)"
                          : "linear-gradient(to right, #6a11cb 25%, #2575fc 100%)",
                        color: isSender ? "black" : "white",
                        textAlign: isSender ? "left" : "left",
                        margin: "5px",
                        wordWrap: "break-word",
                      }}
                    >
                      <ListItemText
                        primary={
                          isImage ? (
                            <img
                              src={messageContent.Content}
                              alt="Chat Image"
                              style={{ maxWidth: "100%", cursor: "pointer" }}
                              onClick={() =>
                                handleOpenImage(messageContent.Content)
                              }
                            />
                          ) : (
                            messageContent.Content
                          )
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {isSender ? "You" : messageContent.author}
                            </Typography>
                          </>
                        }
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </React.Fragment>
        ))}
        <div ref={chatEndRef} />
      </Box>

      {/* Modal to display the image */}
      <Modal
        open={open}
        onClose={handleCloseImage}
        aria-labelledby="modal-image-title"
        aria-describedby="modal-image-description"
      >
        <Box sx={style}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default GroupChatContent;
