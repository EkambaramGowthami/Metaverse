import { useNavigate } from "react-router-dom"

export const Dashboard = ()=>{
    const navigate = useNavigate();
    return <div className="bg-black h-screen w-screen flex justify-center items-center text-white">
        <button className="bg-blue-500 rounded-xl px-4 py-2" onClick={() => navigate("/space")}>Get Started</button>
    </div>
}