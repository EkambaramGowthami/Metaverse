import { useNavigate } from "react-router-dom";

export default function TestingCall(){
    const navigate = useNavigate();
    return <div className="bg-red-500 text-3xl text-white">Go to Video Call</div>
}

