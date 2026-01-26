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
  return <div className="bg-black bg-opacity-95 min-h-screen w-full overflow-x-hidden text-white">

  {/* ================= HERO ================= */}
  <section className="relative min-h-screen">
    <BackgroundBeams />

    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

      {/* NAV */}
      <div className="pt-6 flex justify-center">
        <NavBar targetRef={targetRef} />
      </div>

      {/* HERO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24">

        {/* TEXT */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight">
            Step into the future.
          </h1>

          <div className="text-2xl sm:text-3xl xl:text-4xl font-bold">
            Experience the{" "}
            <span className="italic text-blue-600">
              <Typewriter
                options={{
                  strings: ["Metaverse", "VOffice"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
          </div>

          <p className="italic text-gray-300 text-base sm:text-lg">
            virtual. versatile. visionary.
          </p>

          <button
            onClick={() => navigate("/space")}
            className="inline-block bg-blue-600 hover:bg-blue-700 transition rounded-lg px-10 py-3 text-lg font-medium shadow-lg"
          >
            Get Started
          </button>

          {/* TRUST */}
          <div className="pt-6">
            <p className="text-gray-300 mb-3">Trusted By</p>
            <AnimatedTooltip items={teamMembers} />
          </div>
        </div>

        {/* MODEL */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <College />
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* ================= WHY VOFFICE ================= */}
  <section
    ref={targetRef}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-28 space-y-16"
  >
    <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">
      Why VOffice
    </h2>

    {/* CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {[
        {
          title: "Metaverse Maps & Avatars",
          desc: [
            "Interactive 3D office maps",
            "Real-world navigation feel",
          ],
        },
        {
          title: "Employee Collaboration",
          desc: [
            "Meet and brainstorm virtually",
            "No physical boundaries",
          ],
        },
        {
          title: "Video Calls & Chat",
          desc: [
            "Built-in HD meetings",
            "Instant team messaging",
          ],
        },
        {
          title: "Virtual Events",
          desc: [
            "Conferences, launches & training",
          ],
        },
      ].map((card, i) => (
        <div
          key={i}
          className="rounded-2xl bg-[#0e0e11] p-6 shadow-xl hover:shadow-blue-600/40 transition hover:-translate-y-1"
        >
          <h3 className="text-xl font-semibold text-center mb-4">
            {card.title}
          </h3>
          <div className="text-gray-300 text-center space-y-1">
            {card.desc.map((d, idx) => (
              <p key={idx}>{d}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* ================= SOCIAL / AVATARS ================= */}
  <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0d]">
    <div className="max-w-6xl mx-auto flex flex-col items-center gap-14">

      {/* TOP CHAT */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: [0, 1, 1, 0], x: [-80, 0, 0, -80] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="flex items-center gap-4"
      >
        <img src="/spaceImages/ratna.jpg" className="w-16 h-16 rounded-full" />
        <div className="bg-blue-600/30 px-4 py-2 rounded-lg">
          Hello, everyone 😊
        </div>
      </motion.div>

      {/* CENTER AVATARS */}
      <div className="flex gap-10">
        <img src="/spaceImages/raja.jpeg" className="w-16 h-16 rounded-full" />
        <img src="/spaceImages/kiran.jpg" className="w-16 h-16 rounded-full" />
      </div>

      <h3 className="text-2xl sm:text-4xl font-bold text-blue-600 text-center">
        Connecting minds in the VOffice
      </h3>

      {/* BOTTOM CHAT */}
      <div className="flex items-center gap-4">
        <img src="/spaceImages/junnu.jpg" className="w-16 h-16 rounded-full" />
        <div className="bg-blue-600/30 px-4 py-2 rounded-lg">
          Have you completed the task?
        </div>
        <img src="/spaceImages/manoj.jpg" className="w-16 h-16 rounded-full" />
      </div>
    </div>
  </section>

  {/* ================= FOOTER ================= */}
  <footer className="bg-black py-10 border-t border-white/10">
    <div className="max-w-6xl mx-auto text-center space-y-4 px-4">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        <span className="text-blue-600 text-2xl font-semibold">VOffice</span>
        <div className="flex gap-4">
          {["discord", "reddit", "twitter (1)", "youtube"].map((icon) => (
            <img key={icon} src={`/AppIcons/${icon}.png`} className="w-6 h-6" />
          ))}
        </div>
      </div>

      <p className="text-gray-500 text-sm max-w-3xl mx-auto">
        All names and brands mentioned are owned by their respective companies.
        VOffice is not affiliated with third-party services.
      </p>

      <p className="text-gray-600 text-sm">
        © 2025 VOffice. All rights reserved.
      </p>
    </div>
  </footer>
</div>


}
