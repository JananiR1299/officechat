import "./App.css";
// import Header from './components/chatpage/header'
import Chatpage from "./components/chatpage/chatpage";
import Login from "./components/LoginForm/LoginForm";
import { UserProvider } from "./components/context/UserContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VoiceCall from "./components/VoiceCall/Calls";
// import UserActivityTracker from "./components/UserActivityTracker"; // Import the component
// ort VisibilityHandler from "./components/VisibilityHandler"; // Import the component
// import VisibilityHandler from "./components/VisibilityHandler"; // Import the component
import VideoCall from "./components/videoCall/videoCall";
function App() {
  return (
    <UserProvider>
      <Router>
        {/* <UserActivityTracker /> {/* Include the component */}
        {/* <UserActivityTracker /> Include the component */}
        {/* <VisibilityHandler /> Include the component */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chatpage" element={<Chatpage />} />
          <Route path="/" exact element={<Login />} />
          <Route path="/call" exact element={<VoiceCall />} />
          <Route path="/video-call" element={<VideoCall />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
