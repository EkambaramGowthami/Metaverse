import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import Test from './components/video/Test';
import VideoCallPage from './components/video/VideoCallPage';
import Dashboard from './components/Dashboard';
import { LogIn } from 'lucide-react';
import Login from './components/Auth/Login';
export default function App() {
  const [players, setPlayers] = useState([]);
    return (
  <BrowserRouter>
    <Routes>
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<Test />} />
      <Route path="/videocall" element={<VideoCallPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>

  );
}




