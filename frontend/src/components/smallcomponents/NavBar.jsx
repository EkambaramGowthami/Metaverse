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
            <div className="bg-black md:hidden absolute top-0 left-0 px-4 flex items-center text-white " onClick={() => setIsOpen(!isOpen)}>
                {
                    isOpen ? <X size="24" /> : <Menu size="24" />
                }
            </div>
            {
                isOpen === true && <div className="absolute z-10 top-6 left-0 w-full  h-screen md:hidden flex flex-col space-y-6 px-4 pb-2 bg-[#262626] text-white text-sm rounded-xl">
                <a className="font-bold text-blue-800 text-lg">VOffice</a>
                <a href="#" className="hover:text-blue-800 hover:bg-gray-500 hover:bg-opacity-50 rounded-xl">Home</a>
                <a href="#" className="hover:text-blue-800 " onClick={handleScroll}>About</a>
                <a href="#" className="hover:text-blue-800 " onClick={() => navigate("/demo")}>Demo</a>
                <a href="#" className="hover:text-blue-800 " onClick={()=>navigate("/signup")}>Signup</a>
                <button className="px-4 py-2 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-800 transition-colors" onClick={() =>navigate("/login")}>
                    Login
                </button>

            </div>
            
            }
        </nav>
    )
}