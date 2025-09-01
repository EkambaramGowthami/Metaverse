// import React, { useEffect, useRef, useState } from 'react';
// import { HashRouter as Router, Route, Routes } from "react-router-dom";
// import  DisplayMap  from './components/DisplayMap';
// import  MyGallery  from './components/Space/MyGallery';
// import Signup from './components/Auth/Signup';
// export default function App() {
//   const [players, setPlayers] = useState([]);
//     return (
//     <Router>
//     <Routes >
//       <Route path="/space" element={<MyGallery players={players} setPlayers={setPlayers} />} />
//       <Route path="/space/room/:roomId" element={<DisplayMap  players={players} setPlayers={setPlayers}/>} />
//       <Route path="/signup" element={<Signup />} />
//       {/* <Route path="/videocall" element={<VideoCallPage />} /> */}
//       <Route path="/videocall" element={<h1>Video Call Works</h1>} />
//     </Routes>
//   </Router>

//   );
  

// }

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/videocall" element={<h1>Video Call Works</h1>} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
