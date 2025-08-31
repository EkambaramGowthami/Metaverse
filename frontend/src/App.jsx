import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  Dashboard  from './components/Dashboard';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import Test  from './components/Test';
import  VideoCallPage  from './components/video/VideoCallPage';
import  TestingCall  from './components/video/TestingCall';
import ZegoVideoConference from './components/video/VideoCallPage';



export default function App() {
  const [players, setPlayers] = useState([]);
    return (
    <BrowserRouter basename="/">
    <Routes path="/">
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<Test />} />
      <Route path="/calltesting" element={<TestingCall />} />
      <Route path="/videocall" element={<ZegoVideoConference />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
      
     

    </Routes>
  </BrowserRouter>

  );
  

}