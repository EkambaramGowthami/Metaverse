import { useNavigate } from "react-router-dom"
import NavBar from "./smallcomponents/NavBar";
import { AvatarAndMaps } from "./smallcomponents/AvatarAndMaps";
import { motion } from "framer-motion";
import VideocallAndChatting from "./smallcomponents/VideocallAndChatting";
import Typewriter from "typewriter-effect";
import AnimatedTooltip from "./ui/Animated-tooltip";
import College from "./smallcomponents/Collage";
import { useRef, useState } from "react";
import { BackgroundBeams } from "./ui/background-beams";
export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      designation: "3D Designer",
      image: "/spaceImages/ratna.jpg",
    },
    {
      id: 2,
      name: "Sofia Lee",
      designation: "Frontend Dev",
      image: "/spaceImages/raja.jpeg",
    },
    {
      id: 3,
      name: "Marcus Reed",
      designation: "Project Manager",
      image: "/spaceImages/kiran.jpg",
    },
    {
      id: 3,
      name: "Junnu",
      designation: "Devops Engineer",
      image: "/spaceImages/junnu.jpg",
    },
    {
      id: 3,
      name: "Manoj",
      designation: "Backend Dev",
      image: "/spaceImages/manoj.jpg",
    },
  ];
  return <div className="bg-black bg-opacity-90 min-h-screen w-full p-6 overflow-x-hidden">
    <div className="bg-black rounded-2xl h-full overflow-hidden">
      
      <div className="md:w-full h-[1000px] md:h-[800px] relative overflow-hidden">
      <BackgroundBeams />
        <div className="relative top-6 space-y-12 text-center">
          <NavBar targetRef={targetRef} />
        </div>
        <div className="relative top-20  space-y-12 flex flex-col md:flex-row justify-between p-12">
           <div className="relative text-white  z-20 text-4xl md:text-6xl font-bold animate-fadeInUp space-y-6"> 
             <p>Step into the future.</p>
            <span>
              Experience the{" "}
              <span className="inline-block w-[12ch] italic text-blue-800">
                <Typewriter
                  options={{
                    strings: ["Metaverse", "VOffice"],
                    autoStart: true,
                    loop: true,
                  }}

                />
              </span>
            </span>
            <div className="text-white font-normal italic text-lg">virtual.versatile.visionary.</div>
            <button className="text-lg rounded-lg px-12 py-2 text-center shadow-sm bg-blue-800 hover:border-2 hover:border-blue-900" onClick={()=>navigate("/space")}>
              Get Started
            </button>
            <div>
              <div className="text-white text-lg font-lg mb-4">Trusted By</div>
              <div className="flex"><AnimatedTooltip items={teamMembers} /></div>
            </div>

          </div>
          <div className="w-120 h-120 flex items-center "><College /></div>
        
      </div>
      </div>


    </div>
    <div className="min-h-screen px-2 md:px-16 mt-2 md:mt-24 space-y-24" ref={targetRef} >
      <div className="text-4xl md:6xl text-blue-800 text-center font-bold mt-8 md:mt-2">Why VOffice</div>
      <div className="space-y-6 md:space-y-4">
        <div className="flex justify-center items-center">
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <div className="group relative w-80 md:w-96  rounded-2xl shadow-2xl bg-black/90 p-3 hover:scale-105 hover:shadow-blue-800/50 transition-transform duration-300 ease-out space-y-4">
              <div className="w-full text-white text-2xl font-lg p-2 text-center">Metaverse Maps & Interactive Characters(Avatars)</div>
              <div className="bg-[#262626] rounded-xl [clip-path:polygon(0%_0%,100%_0%,100%_calc(100%-50px),calc(100%-50px)_100%,0%_100%)] p-4 text-gray-300  text-md text-center">
                <p>Explore stunning, interactive 3D office maps tailored to your workspace.</p>
                <p>Experience immersive navigation that feels like walking in a real office.</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 group relative w-80 md:w-96 rounded-2xl shadow-2xl bg-black/90 p-3 space-y-4 hover:scale-105 hover:shadow-blue-800/50 transition-transform duration-300 ease-out">
              <div className="w-full text-white text-2xl font-lg p-2 text-center">Real Metaverse Usage for Employees</div>
              <div className="bg-[#262626] rounded-xl [clip-path:polygon(0%_0%,100%_0%,100%_calc(100%-50px),calc(100%-50px)_100%,0%_100%)] p-6 text-gray-300 text-md text-center">
                <p>Boost team collaboration with a virtual office that feels real.</p>
                <p>Hold meetings, brainstorm, and network without physical barriers.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-col md:flex-row jusitfy-center md:space-x-12">
            <div className="group relative w-80 md:w-96  rounded-2xl shadow-2xl space-y-4 bg-black/90 p-3 hover:scale-105 hover:shadow-blue-800/50 transition-transform duration-300 ease-out">
              <div className="w-full text-white text-2xl font-lg p-2 text-center"> Group video Calls & Chatting Features</div>
              <div className="bg-[#262626] rounded-xl [clip-path:polygon(0%_0%,100%_0%,100%_calc(100%-50px),calc(100%-50px)_100%,0%_100%)] p-6 text-gray-300 text-md text-center">
                <p>Seamlessly host HD video calls directly inside the metaverse.</p>
                <p>Use instant chat for quick updates and real-time teamwork.</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0  group relative w-80 md:w-96 rounded-2xl shadow-2xl space-y-4 bg-black/90 p-3 hover:scale-105 hover:shadow-blue-800/50 transition-transform duration-300 ease-out overflow-hidden">
              <div className="w-full text-white text-2xl font-lg p-2 text-center">Immersive Virtual Events & Collaboration Spaces</div>
              <div className="bg-[#262626] rounded-xl [clip-path:polygon(0%_0%,100%_0%,100%_calc(100%-50px),calc(100%-50px)_100%,0%_100%)] p-6 text-gray-300 text-md text-center">
                <p>Create fully interactive environments for hosting conferences, product launches, training sessions, or team-building activities..</p>
              </div>
              </div>
          </div>
        </div>
      </div>
     <div className="w-full overflow-hidden">
      <div className="relative top-24 flex flex-row flex-wrap justify-center items-center gap-20 md:gap-60 scale-[0.7] sm:scale-[0.85] md:scale-100">
        
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: [0, 1, 1, 0], x: [-100, 0, 0, -100] }}
          transition={{
            duration: 6,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="flex flex-row items-center gap-3"
        >
          <img
            src="/spaceImages/ratna.jpg"
            className="rounded-full w-24 h-24 md:w-36 md:h-36 object-cover"
          />
          <div className="text-white bg-blue-500/30 px-3 py-2 rounded-lg text-sm md:text-base whitespace-nowrap">
            Hello, everyone <span className="text-lg ml-1">😊</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-100, 0, 0, -100] }}
          transition={{
            duration: 6,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="w-24 h-24 md:w-36 md:h-36"
        >
          <img
            src="/spaceImages/raja.jpeg"
            className="rounded-full w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: [0, 1, 1, 0], x: [100, 0, 0, 100] }}
          transition={{
            duration: 6,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="w-24 h-24 md:w-36 md:h-36"
        >
          <img
            src="/spaceImages/kiran.jpg"
            className="rounded-full w-full h-full object-cover"
          />
        </motion.div>
      </div>
      <div className="relative top-16 text-center text-xl sm:text-3xl md:text-5xl text-blue-800 font-bold">
        Connecting minds in the VOffice
      </div>
      <div className="relative top-20 flex flex-row flex-wrap justify-center items-center gap-20 md:gap-60 scale-[0.7] sm:scale-[0.85] md:scale-100">
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 1, 1, 0], y: [100, 0, 0, 100] }}
          transition={{
            duration: 6,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="w-24 h-24 md:w-36 md:h-36"
        >
          <img
            src="/spaceImages/junnu.jpg"
            className="rounded-full w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: [0, 1, 1, 0], y: [100, 0, 0, 100] }}
          transition={{
            duration: 6,
            times: [0, 0.3, 0.7, 1],
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="flex flex-row items-center gap-3"
        >
          <div className="text-white bg-blue-500/30 rounded-lg px-3 py-2 text-sm md:text-base whitespace-nowrap">
            Have you completed the task?
          </div>
          <img
            src="/spaceImages/manoj.jpg"
            className="rounded-full w-24 h-24 md:w-36 md:h-36 object-cover"
          />
        </motion.div>
      </div>

    </div>
    <div className="bg-black rounded-xl w-full mt-60 p-4 space-y-4 overflow-hidden text-center">
        <div className="flex justify-center space-x-16">
          <div className="text-blue-800 font-semibold text-2xl">VOffice</div>
          <div className="flex space-x-4 text-white">
            <img src="/AppIcons/discord.png" className="w-8 h-8" />
            <img src="/AppIcons/reddit.png" className="w-8 h-8" />
            <img src="/AppIcons/twitter (1).png" className="w-8 h-8" />
            <img src="/AppIcons/youtube.png" className="w-8 h-8" />

          </div>

        </div>
        {/* <div className="mt-2 pt-6 text-sm text-gray-500">
          Built with ❤️ for the future of virtual worlds.
        </div> */}
        
        <div className=" text-center mt-2 text-gray-500">All names and brands mentioned are owned by their respective companies and used here for reference only.  <br />VOffice is not affiliated with or responsible for any third-party products or services.
        </div>
        <div className="text-gray-500 text-sm">© 2025 VOffice. All rights reserved.</div>
        


      </div>
    


  </div>


}
