"use client";

import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter();
    const handleExploreClick = () => {
        router.push('/explore');
    };

    return (
        <main className="relative flex h-auto flex-col items-center justify-center overflow-hidden">
            <div className="fixed left-[-25%] top-1/5 -translate-y-1/2 transform -z-10 animate-float">
                <img
                    src="/pillow.png"
                    alt="pillow"
                    width="900"
                    className="-rotate-12"
                />
            </div>
            <div className="fixed right-[-25%] top-1/5 -translate-y-1/2 transform -z-10 animate-float-reverse">
                <img src="/pillow.png" alt="pillow" width="900" className="rotate-12"/>
            </div>
            <br/>
            <br/>
            <h1 className="font-pt-serif text-center text-8xl font-normal">
                Launch
                <br/>
                unruggable
                <br/>
                tokens
            </h1>
            <br/>
            <br/>
            <div
                className="group relative m-4 w-1/4 flex-col justify-center rounded-3xl bg-customLightPink p-4 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-200">
                <div className="absolute left-1/2 top-[-10px] -translate-x-1/2 transform">
                    <p className="min-w-max rounded-3xl bg-yellow-200 px-4 py-2 text-center font-montserrat font-medium text-black">
                        UNRUGGABLE KING👑
                    </p>
                </div>
                <div className="mt-8 flex">
                    <img
                        src="/cat.jpg"
                        alt="cat"
                        width={100}
                        className="m-2 rounded-lg"
                    />
                    <div className="h-full w-full flex-col justify-start align-middle">
                        <p className="m-2 font-montserrat font-semibold text-black">
                            meouch
                        </p>
                        <p className="m-2">$meouch</p>
                    </div>
                </div>
            </div>
            <button
                className="bg-customPastelDarkGreen m-8 rounded-full p-4 font-montserrat font-semibold text-white transition-all duration-300 hover:bg-customPink"
                onClick={handleExploreClick}
            >
                Explore more tokens
            </button>
        </main>
    );
}
