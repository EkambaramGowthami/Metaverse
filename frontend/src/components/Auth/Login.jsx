import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function Login(){
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const BackendUrl = import .meta.env.VITE_BACKEND_URL;
    const handleLogin = async () =>{
        const email=emailRef.current.value;
        const password=passwordRef.current.value;
        try{
            const res = await axios.post(`${BackendUrl}/signin`,{email,password},{headers:{"Content-Type":"application/json"},withCredentials:true});
            if(res.data){
                localStorage.setItem("username",res.data.username);
                localStorage.setItem("userId",res.data.userId);
                navigate("/dashboard");
            }
        }
        catch(err){
            console.log(err);
            alert(err.response?.data?.message || "Login failed");
        }
    }
    return (
       <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4">
  <div className="relative w-full max-w-md bg-[#262626] rounded-xl p-4 md:p-6 space-y-4">
    <div className="text-3xl text-blue-800 font-semibold text-center">
      Login
    </div>

    <label className="text-white text-lg">Username:</label>
    <input
      type="text"
      placeholder="Email or username"
      className="w-full px-4 py-3 rounded-xl bg-black bg-opacity-80 text-white focus:outline-none"
      ref={emailRef}
    />

    <label className="text-white text-lg">Password:</label>
    <input
      type="password"
      placeholder="Password"
      className="w-full px-4 py-3 rounded-xl bg-black bg-opacity-80 text-white focus:outline-none"
      ref={passwordRef}
    />

    <button
      className="w-full bg-blue-800 text-white text-lg rounded-xl hover:border hover:border-blue-900 shadow-xl py-3"
      onClick={handleLogin}
    >
      Login
    </button>
  </div>
</div>


    );
}
