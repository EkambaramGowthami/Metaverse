import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log("BackendUrl", BackendUrl);
  const handleSignup = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const res = await axios.post(
        `${BackendUrl}/signup`
        ,
        { email, password }, 
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, 
        }
      );

      if (res.data) {
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("userId", res.data.userId);
        navigate("/space");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-black bg-opacity-90 h-screen w-screen flex items-center justify-center">
        <div className="relative bg-[#262626] w-96 rounded-xl p-6 space-y-4">
          <div className="text-3xl text-blue-800 font-semibold text-center ">Signup</div>
          <label className="text-white text-lg">Username:</label>
          <input type="text" placeholder="Email or username" className="px-12 py-4 rounded-xl bg-black bg-opacity-80 text-white" ref={emailRef} />
          <label className="text-white text-lg">Password:</label>
          <input type="password" placeholder="Password" className="px-12 py-4 rounded-xl bg-black bg-opacity-80 text-white" ref={passwordRef} />
          <button className="bg-blue-800 text-white text-lg rounded-xl hover:border hover:border-blue-900 shadow-xl w-full py-4" onClick={handleSignup}>Create account</button>
          <div className="text-center"><span className="text-white text-lg">Already have an account ?   </span><span className="text-lg text-blue-800 font-bold">Login</span></div>
             
          </div>

        </div>
   
  );
}
