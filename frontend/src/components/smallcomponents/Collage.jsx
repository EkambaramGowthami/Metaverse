import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0,duration:1 },
};

export default function College() {
  return (
    <div className="h-full grid grid-cols-2 gap-2">
      <div className=" w-38 h-42 md:w-60 md:h-120 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale:1.05 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative p-2 bg-white rounded-xl h-3/5 shadow-md overflow-hidden"
        >
          <img
            src="/spaceImages/first.webp"
            className="w-full h-full object-cover rounded-xl transition-transform duration-300"
            alt="Video calls"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black bg-opacity-50 font-bold text-white flex justify-center items-center rounded-xl pointer-events-none"
          >
            <p>Video calls</p>
          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, x: "-50%"}}
          animate={{ opacity: 1, x:0}}
          whileHover={{ scale:1.05 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative p-2 bg-white rounded-xl h-2/5 shadow-md overflow-hidden"
        >
          <img
            src="/spaceImages/chatting-removebg-preview.png"
            className="w-full h-full object-cover rounded-xl transition-transform duration-300"
            alt="Chatting"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black bg-opacity-50 font-bold text-white flex justify-center items-center rounded-xl pointer-events-none"
          >
            <p>Chatting</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-38 h-42 md:w-60 md:h-120 space-y-2">
        <motion.div
          initial={{ opacity: 0, x: "50%"}}
          animate={{ opacity: 1, x:0}}
          whileHover={{ scale:1.05 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative p-2 bg-white rounded-xl h-1/2 shadow-md overflow-hidden"
        >
          <img
            src="/spaceImages/library.png"
            className="w-full h-full object-cover rounded-xl transition-transform duration-300"
            alt="Office Maps"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black bg-opacity-50 font-bold text-white flex justify-center items-center rounded-xl pointer-events-none"
          >
            <p>Office Maps</p>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: "50%"}}
          animate={{ opacity: 1, y: 0}}
          whileHover={{ scale:1.05 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative p-2 bg-white rounded-xl h-1/2 shadow-md overflow-hidden"
        >
          <img
            src="/spaceImages/Copilot_20250910_192004 (1).png"
            className="w-full h-full object-cover rounded-xl transition-transform duration-300"
            alt="Meeting Halls"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black bg-opacity-50 font-bold text-white flex justify-center items-center rounded-xl pointer-events-none"
          >
            <p>Meeting Halls</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
