import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DisplayMap } from './components/DisplayMap';
import { Dashboard } from './components/Dashboard';
import { MyGallery } from './components/Space/MyGallery';
import Signup from './components/Auth/Signup';
import { Test } from './components/Test';



export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/displaymap" element={<DisplayMap />} /> */}
      <Route path="/space" element={<MyGallery />} />
      <Route path="/space/room/:roomId" element={<DisplayMap />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/test" element={<Test />} />
      
     

    </Routes>
  </BrowserRouter>

  );
  

}