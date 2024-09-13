import React, {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  Grid,
  TextField,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "../../context/UserContext";
import io, { Socket } from "socket.io-client";
import { Message } from "./messagetypes";

interface FooterProps {
  userDetails: any;
  setMessageList: React.Dispatch<React.SetStateAction<Message[]>>;
}

const socket: Socket = io(process.env.REACT_APP_SOCKET_URL);

const Footer: React.FC<FooterProps> = ({ userDetails, setMessageList }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { user } = useUser();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = async () => {
    const currentTime = new Date();
    let formData = {};

    if (selectedFile) {
      const base64File = await fileToBase64(selectedFile);
      const fileBlob = base64File.split(",")[1];

      formData = {
        fileBlob,
        filename: selectedFile.name,
        filetype: selectedFile.type,
        filesize: selectedFile.size,
      };
      setSelectedFile(null);
      setFilePreview(null);
    }
    console.log("userDetails userid", user?.userdata?.UserID);
    const messageData = {
      author: user?.userdata?.UserName,
      receiverID: userDetails.UserID ? userDetails.UserID : undefined,
      groupID: userDetails.GroupID ? userDetails.GroupID : undefined,
      SenderID: user?.userdata?.UserID,
      Content: currentMessage ? currentMessage : selectedFile.name,
      SentAt: currentTime,
      IsDeleted: false,
      IsPinned: false,
      isGroupChat: userDetails.GroupID ? true : false,
      file: formData,
    };
    if (currentMessage || selectedFile) {
      socket.emit("send_message", messageData);
      console.log("messageData", messageData);
      setcurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    socket.on("disconnect", async () => {
      console.log("Connected to server:", socket.id);
    });

    const handleMessageReceive = (data) => {
      console.log("Message received on client:", data);
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handleMessageReceive);
    return () => {
      socket.off("receive_message", handleMessageReceive);
    };
  }, [userDetails.UserID, setMessageList]);

  return (
    <Container>
      <Grid item>
        <Box>
          <Box>
            <TextField
              fullWidth
              variant="outlined"
              value={currentMessage}
              placeholder="Send a message"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setcurrentMessage(event.target.value);
              }}
              onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              InputProps={{
                endAdornment: (
                  <Box>
                    <Box sx={{ position: "relative", height: "104px" }}>
                      <Box
                        sx={{
                          position: "absolute",
                          display: "flex",
                          bottom: 6,
                          right: 0,
                        }}
                      >
                        <IconButton onClick={handleClick}>
                          <AttachFileIcon sx={{ transform: "rotate(45deg)" }} />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={sendMessage}
                          sx={{
                            backgroundColor: "#0074d9",
                            borderRadius: "8px",
                          }}
                          // endIcon={<SendIcon />}
                        >
                          Send
                        </Button>
                      </Box>
                    </Box>
                    <Box>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            id="upload-file"
                          />
                          <label htmlFor="upload-file">
                            <Button
                              component="span"
                              variant="outlined"
                              color="primary"
                            >
                              Select File
                            </Button>
                          </label>
                        </MenuItem>
                        <MenuItem>
                          <Button variant="outlined" color="primary">
                            Attach Cloud Files
                          </Button>
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default Footer;
