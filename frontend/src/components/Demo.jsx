import DemoTileMap from "../maps/DemoTileMap";
export default function Demo() {
    return (<div className="grid grid-cols-1 md:grid-cols-[2fr_350px] gap-0 w-screen h-screen overflow-auto bg-black bg-opacity-80">
        {/* <div className="w-full h-screen bg-black text-white md:block hidden">hi</div> */}
        <div className="flex justify-center items-center overflow-auto w-full h-full  border-r border-black">
            <DemoTileMap
                mapUrl="/maps/woodenOffice.json"
                tilesetImageUrl="/maps/woodenOffice.jpeg"
                avatarUrl="/avatars/$ limp.png"
            />

        </div>
    </div>
    );

}