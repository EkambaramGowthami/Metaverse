import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSignup = async () => {
    const email = emailRef.current.value;
    const password = password.current.value;
    try {
      const res = await axios.post(
        "https://metaverse-3joe.onrender.com/signup",
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
    <div>
      <h2>Signup</h2>
      <input placeholder="Email" ref={emailRef} />
      <input placeholder="Password" type="password" ref={passwordRef} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
