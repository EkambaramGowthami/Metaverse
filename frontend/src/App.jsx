import React, { useEffect, useRef, useState } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  Dashboard  from './components/Dashboard';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import Test  from './components/Test';
import  VideoCallPage  from './components/video/VideoCallPage';
import  TestingCall  from './components/video/TestingCall';



export default function App() {
  const [players, setPlayers] = useState([]);
    return (
    <Router>
    <Routes>
      {/* <Route path="/displaymap" element={<DisplayMap />} /> */}
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<Test />} />
      <Route path="/calltesting" element={<TestingCall />} />
      <Route path="/videocall" element={<VideoCallPage />} />
      
     

    </Routes>
  </Router>

  );
  

}