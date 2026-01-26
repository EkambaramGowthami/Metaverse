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
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#262626] text-white flex flex-col px-6 pt-20 space-y-6 text-sm">
          
          <span className="font-bold text-lg text-blue-500">
            VOffice
          </span>

          <a
            href="#"
            className="hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </a>

          <a
            href="#"
            className="hover:text-blue-400"
            onClick={() => {
              handleScroll();
              setIsOpen(false);
            }}
          >
            About
          </a>

          <a
            href="#"
            className="hover:text-blue-400"
            onClick={() => {
              navigate("/demo");
              setIsOpen(false);
            }}
          >
            Demo
          </a>

          <a
            href="#"
            className="hover:text-blue-400"
            onClick={() => {
              navigate("/signup");
              setIsOpen(false);
            }}
          >
            Signup
          </a>

          <button
            className="mt-4 px-4 py-2 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-700 transition-colors"
            onClick={() => {
              navigate("/login");
              setIsOpen(false);
            }}
          >
            Login
          </button>
        </div>
      )}
        </nav>
    )
}
