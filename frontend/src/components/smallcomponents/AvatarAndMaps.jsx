export function AvatarAndMaps() {
    return (
      <div className="w-[500px] p-6">
        <div className="relative flex justify-end bg-red-500">
          <div className=" absolute z-10 rounded-xl w-[250px] h-[180px] transform translate-y-20 translate-x-5 animate-slideInRight">
            <img src="/avatars/girl-removebg-preview.png" />
            </div>
        </div>
  
        <div className="rounded-xl bg-white animate-slideFromLeft animate-zoomOut">
          <div className="w-full h-full rounded-xl ">
            <img src="/spaceImages/library.png" className="w-full h-full rounded-xl " />
          </div>
        </div>
  
        
        <div className="w-[250px] h-[180px] h-40 rounded-xl transform -translate-y-20 translate-x-5 animate-slideInLeft">
            <img src="/spaceImages/Copilot_20250910_192004 (1).png" className="w-full h-full overflow-hidden" />
        </div>
      </div>
    );
  }
  