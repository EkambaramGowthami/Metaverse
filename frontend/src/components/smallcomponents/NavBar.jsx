import { useRef, useState } from "react";
import { Menu,X } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function ({ targetRef }) {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const handleScroll = (e) => {
        e.preventDefault();
        if(targetRef.current){
            targetRef?.current.scrollIntoView({ behavior:'smooth'});
            setIsOpen(false);
        }
    }
    return (
        <nav className="flex justify-center items-center z-10 " >
            <div className="hidden md:flex relative flex tems-center  justify-between gap-24 px-6 py-2 bg-[#262626] text-white rounded-full">
                    <div className="flex items-center">
                        <div className="text-white"><img src="/spaceImages/Gemini_Generated_Image_y6obppy6obppy6ob-removebg-preview.png" className="rounded-full w-12 h-12 mr-2" /></div>
                        <a className="font-bold text-blue-800 text-xl">VOffice</a>
                        
                    </div>
                <div className="flex space-x-6 items-center">
                    <a href="">Home</a>
                    <a href="" onClick={handleScroll}>About</a>
                    <a href="" onClick={() => navigate("/demo")}>Demo</a>
                    <button className="px-4 py-2 rounded-full border-2 border-neutral-300" onClick={()=>navigate("/signup")}>Signup</button>
                    <button className="px-4 py-2 rounded-xl bg-blue-800 text-white transition-colors text-neutral-900 shadow-sm" onClick={() =>navigate("/login")}>Login</button>
                </div>

            </div>
<div
  className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-black/80 backdrop-blur-md text-white shadow-lg"
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</div>

{/* Overlay */}
{isOpen && (
  <div
    className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    onClick={() => setIsOpen(false)}
  />
)}

<div
  className={`md:hidden fixed top-0 left-0 z-50 h-screen w-[85%] max-w-xs
    bg-[#1f1f1f] text-white
    transform transition-transform duration-300 ease-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
  <div className="flex flex-col h-full px-6 pt-16 pb-8 space-y-6">
    <span className="text-2xl font-bold text-blue-500 tracking-wide">
      VOffice
    </span>

    <div className="h-px bg-white/10" />
    <nav className="flex flex-col space-y-4 text-base">
      <a
        href="#"
        className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
        onClick={() => setIsOpen(false)}
      >
        Home
      </a>

      <a
        href="#"
        className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
        onClick={() => {
          handleScroll();
          setIsOpen(false);
        }}
      >
        About
      </a>

      <a
        href="#"
        className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
        onClick={() => {
          navigate("/demo");
          setIsOpen(false);
        }}
      >
        Demo
      </a>

      <a
        href="#"
        className="px-3 py-2 rounded-lg hover:bg-white/10 transition"
        onClick={() => {
          navigate("/signup");
          setIsOpen(false);
        }}
      >
        Signup
      </a>
    </nav>
    <div className="mt-auto">
      <button
        className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-600 font-semibold transition shadow-md"
        onClick={() => {
          navigate("/login");
          setIsOpen(false);
        }}
      >
        Login
      </button>
    </div>
  </div>
</div>

        </nav>
    )
}
