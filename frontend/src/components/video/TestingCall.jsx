import { useNavigate } from "react-router-dom";

export default function TestingCall(){
    const navigate = useNavigate();
    return <div onClick={() => navigate("/videocall")}>Go to Video Call</div>
}

