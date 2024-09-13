import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Modal,
  Grid,
} from "@mui/material";
import { Message } from "./messagetypes";
import { Link } from "react-router-dom";
import moment from "moment";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface SingleChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const SingleChatContent: React.FC<SingleChatContentProps> = ({
  userDetails,
  messageList = [],
}) => {
  const [open, setOpen] = React.useState(false);
  const [imagename, setImagename] = React.useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = (filename: string) => {
    setImagename(filename);
    setOpen(true);
  };

  const handleClose = () => {
    setImagename("");
    setOpen(false);
  };

  const formatDay = (timestamp: string) => {
    return moment(timestamp).format("dddd, MMMM Do YYYY");
  };

  const formatTime = (timestamp: string) => {
    return moment(timestamp).format("hh:mm A");
  };

  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  const groupMessagesByDay = (messages: Message[]) => {
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

  const groupedMessages = groupMessagesByDay(messageList);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messageList]);

  return (
    <Container>
      <Box
        sx={{
          overflow: "auto",
          height: "320px",
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
        <Box
          sx={{
            padding: "10px",
            marginBottom: "10px",
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
                    margin: "0 8px",
                  },
                }}
              >
                {day}
              </Typography>
              <List>
                {messages.map((messageContent, index) => {
                  const isSender =
                    userDetails.UserID === messageContent.SenderID;
                  const isImage = isImageUrl(messageContent.Content);

                  const renderFilePreview = () => {
                    if (!messageContent.file) return null;

                    const { filetype, url, filename } = messageContent.file;
                    let preview;

                    if (filetype?.startsWith("image/")) {
                      preview = (
                        <Link onClick={() => handleOpen(filename)} to="#">
                          {filename}
                        </Link>
                      );
                    } else if (filetype?.startsWith("video/")) {
                      preview = (
                        <video
                          controls
                          src={url}
                          style={{ maxWidth: "200px" }}
                        />
                      );
                    } else if (filetype?.startsWith("audio/")) {
                      preview = <audio controls src={url} />;
                    } else {
                      preview = (
                        <ListItemText
                          primary={messageContent.Content}
                          secondary={
                            <Typography component="span" variant="body2" />
                          }
                        />
                      );
                    }

                    return <div style={{ marginTop: "10px" }}>{preview}</div>;
                  };

                  return (
                    <Grid
                      container
                      key={index}
                      justifyContent={isSender ? "flex-start" : "flex-end"}
                    >
                      <Grid item>
                        <ListItem
                          sx={{
                            flexDirection: "column",
                            alignItems: isSender ? "flex-start" : "flex-end",
                            padding: "0px",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            align={isSender ? "left" : "right"}
                            sx={{
                              marginBottom: "4px",
                              alignSelf: isSender ? "flex-end" : "flex-start",
                            }}
                          >
                            {formatTime(messageContent.SentAt)}
                          </Typography>
                          <Box
                            sx={{
                              padding: "0.75rem",
                              borderRadius: isSender
                                ? "0px 10px 10px 10px"
                                : "10px 0px 10px 10px",
                              backgroundImage: isSender
                                ? "linear-gradient(to right, #f4f3f1, #f4f3f1)"
                                : "linear-gradient(90deg, #8548D0 0%, #29BFFF 100%)",
                              color: isSender ? "black" : "white",
                              margin: "5px 0",
                              wordWrap: "break-word",
                              width: "270px",
                            }}
                          >
                            {messageContent.file ? (
                              <ListItemText>{renderFilePreview()}</ListItemText>
                            ) : (
                              <ListItemText
                                primary={
                                  isImage ? (
                                    <Link
                                      onClick={() =>
                                        handleOpen(messageContent.Content)
                                      }
                                      to="#"
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: isSender ? "black" : "white",
                                        }}
                                      >
                                        {messageContent.Content}
                                      </Typography>
                                    </Link>
                                  ) : (
                                    messageContent.Content
                                  )
                                }
                              />
                            )}
                          </Box>
                        </ListItem>
                      </Grid>
                    </Grid>
                  );
                })}
              </List>
            </React.Fragment>
          ))}
          <div ref={chatEndRef} />
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            alt="User avatar"
            src={process.env.REACT_APP_IMAGE_URL + "/" + imagename}
            style={{ maxWidth: "50%", maxHeight: "50%" }}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default SingleChatContent;
