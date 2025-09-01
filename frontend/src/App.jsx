// import React, { useEffect, useRef, useState } from 'react';
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import  DisplayMap  from './components/DisplayMap';
// import  MyGallery  from './components/Space/MyGallery';
// import Signup from './components/Auth/Signup';
// export default function App() {
//   const [players, setPlayers] = useState([]);
//     return (
//     <BrowserRouter>
//     <Routes >
//       <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
//       <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
//       <Route path="/signup" element={<Signup />} />
//       {/* <Route path="/videocall" element={<VideoCallPage />} /> */}
//       <Route path="/videocall" element={<h1>Video Call Works</h1>} />
//     </Routes>
//   </BrowserRouter>

//   );
  

// }



import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your components
import DisplayMap from './components/DisplayMap';
import MyGallery from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import VideoCallPage from './components/video/VideoCallPage';

export default function App() {
  const [players, setPlayers] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Space routes */}
        <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
        <Route path="/space/room/:roomId" element={<DisplayMap players={players} setPlayers={setPlayers} />} />

        {/* Auth route */}
        <Route path="/signup" element={<Signup />} />

        {/* Video call route with /* to match query params or trailing slashes */}
        <Route path="/videocall/*" element={<VideoCallPage />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}


