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
  return <div className="bg-black bg-opacity-90 min-h-screen w-full overflow-x-hidden">
  <div className="bg-black rounded-2xl min-h-screen p-4 sm:p-6">
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-20 flex justify-center pt-6">
        <NavBar targetRef={targetRef} />
      </div>
      <div className="relative z-20 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 px-4 sm:px-8 lg:px-16 py-20">
        <div className="text-white space-y-6 max-w-xl text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
            Step into the future.
          </h1>

          <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Experience the{" "}
            <span className="inline-block italic text-blue-800">
              <Typewriter
                options={{
                  strings: ["Metaverse", "VOffice"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
          </div>

          <p className="italic text-base sm:text-lg">
            virtual. versatile. visionary.
          </p>

          <button
            className="inline-block rounded-lg px-8 sm:px-12 py-2 text-lg bg-blue-800 hover:border-2 hover:border-blue-900 transition"
            onClick={() => navigate("/space")}
          >
            Get Started
          </button>
          <div>
            <div className="text-lg mb-4">Trusted By</div>
            <AnimatedTooltip items={teamMembers} />
          </div>
        </div>

        {/* MODEL */}
        <div className="w-full max-w-md lg:max-w-lg flex justify-center">
          <College />
        </div>
      </div>
    </div>
  </div>
  <div
    ref={targetRef}
    className="min-h-screen px-4 sm:px-8 md:px-16 py-20 space-y-20"
  >
    <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800">
      Why VOffice
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center">
      {[
        {
          title: "Metaverse Maps & Interactive Characters",
          desc: [
            "Explore stunning, interactive 3D office maps.",
            "Navigate like a real office.",
          ],
        },
        {
          title: "Real Metaverse Usage for Employees",
          desc: [
            "Boost collaboration in a virtual office.",
            "Meet, brainstorm, and network freely.",
          ],
        },
        {
          title: "Group Video Calls & Chatting",
          desc: [
            "Host HD video calls inside the metaverse.",
            "Instant chat for real-time teamwork.",
          ],
        },
        {
          title: "Immersive Virtual Events",
          desc: [
            "Host conferences, launches, and training sessions.",
          ],
        },
      ].map((card, i) => (
        <div
          key={i}
          className="group w-full max-w-sm rounded-2xl bg-black/90 p-4 shadow-2xl transition hover:scale-105 hover:shadow-blue-800/50"
        >
          <div className="text-white text-xl sm:text-2xl text-center mb-3">
            {card.title}
          </div>
          <div className="bg-[#262626] rounded-xl p-4 text-gray-300 text-sm sm:text-base text-center space-y-1">
            {card.desc.map((d, idx) => (
              <p key={idx}>{d}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap justify-center items-center gap-16 pt-24">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: [0, 1, 1, 0], x: [-100, 0, 0, -100] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="flex items-center gap-3"
      >
        <img src="/spaceImages/ratna.jpg" className="w-20 h-20 rounded-full" />
        <div className="bg-blue-500/30 px-3 py-2 rounded-lg text-white">
          Hello, everyone 😊
        </div>
      </motion.div>
      <img src="/spaceImages/raja.jpeg" className="w-20 h-20 rounded-full" />
      <img src="/spaceImages/kiran.jpg" className="w-20 h-20 rounded-full" />
    </div>

    <h3 className="text-center text-2xl sm:text-4xl font-bold text-blue-800 pt-12">
      Connecting minds in the VOffice
    </h3>
    <div className="flex flex-wrap justify-center gap-12 pt-12">
      <img src="/spaceImages/junnu.jpg" className="w-20 h-20 rounded-full" />

      <div className="flex items-center gap-3">
        <div className="bg-blue-500/30 px-3 py-2 rounded-lg text-white">
          Have you completed the task?
        </div>
        <img src="/spaceImages/manoj.jpg" className="w-20 h-20 rounded-full" />
      </div>
    </div>
  </div>
  <footer className="bg-black rounded-xl w-full mt-32 p-6 text-center space-y-4">
    <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
      <div className="text-blue-800 text-2xl font-semibold">VOffice</div>
      <div className="flex gap-4">
        {["discord", "reddit", "twitter (1)", "youtube"].map((icon) => (
          <img
            key={icon}
            src={`/AppIcons/${icon}.png`}
            className="w-7 h-7"
          />
        ))}
      </div>
    </div>

    <p className="text-gray-500 text-sm max-w-2xl mx-auto">
      All names and brands mentioned are owned by their respective companies.
      VOffice is not affiliated with third-party services.
    </p>

    <p className="text-gray-500 text-sm">
      © 2025 VOffice. All rights reserved.
    </p>
  </footer>
</div>

}
