export default function VideocallAndChatting(){
    return (
        <div className="w-[500px] p-6">
          <div className="relative flex justify-end bg-red-500">
            <div className="absolute z-10 rounded-xl w-[250px] h-[250px] transform translate-y-40 animate-slideInRight">
              <img src="/spaceImages/chatting-removebg-preview.png" />
              </div>
          </div>
    
          <div className="rounded-xl bg-white animate-slideFromLeft animate-zoomOut">
            <div className="w-3/4 rounded-xl ">
              <img src="/spaceImages/first.webp" className="w-full h-full rounded-xl " />
            </div>
          </div>
          <div className="bg-red-500">

          </div>
        </div>
      );
}