import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  DisplayMap  from './components/DisplayMap';
import  MyGallery  from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import Test  from './components/Test';
import Hi from './components/video/Hi';





export default function App() {
  const [players, setPlayers] = useState([]);
    return (
    <BrowserRouter basename="/">
    <Routes path="/">
      <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
      <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<Test />} />
     <Route path="/hi" element={<Hi />} />
      <Route path="/videocall" element={<Test />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
      
     

    </Routes>
  </BrowserRouter>

  );
  

}