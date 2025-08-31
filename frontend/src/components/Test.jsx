import { useNavigate } from "react-router-dom"
import VideoCallPage from "./video/VideoCallPage";

export default function Test() {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center bg-red-500 text-black text-2xl">
            <p>hit there</p>
            <button className="px-12 py-4 bg-green-500 text-white">hi there</button>
            <button
                className="px-12 py-4 bg-green-500 text-white"
                onClick={() => navigate("/videocall")}
            >
                Go to Video Call
            </button>
            <div className="bg-green-500"><VideoCallPage /></div>


        </div>
    )
}   