"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

// Mock data array
const cardData = [
    { id: "1", title: "notamuffin", token: "$notamuffin", launched: "Served fresh", image: "/poop.jpg" },
    { id: "2", title: "justababy", token: "$justababy", launched: "4 hours ago", image: "/baby.jpg" },
    { id: "3", title: "frog", token: "$frog", launched: "1 Day ago", image: "/frog.jpg" },
    { id: "4", title: "meounch", token: "$meounch", launched: "1 Day ago", image: "/cat.jpg" },
    { id: "5", title: "creep", token: "$creep", launched: "1 Day ago", image: "/creeper.jpg" },
    { id: "6", title: "babyshark", token: "$babyshark", launched: "1 Day ago", image: "/shark.jpeg" },
    { id: "7", title: "ye", token: "$ye", launched: "1 Day ago", image: "/ye.jpg" },
];

export default function Home() {
    const router = useRouter();
    const handleCreateClick = () => {
        router.push('/create');
    };

    return (
        <main className="relative flex flex-col h-full w-full overflow-x-hidden">
            <div className="flex flex-wrap justify-evenly items-start w-full h-screen mt-12 -mb-32 px-8 relative">
                <div className="w-full md:w-1/2 lg:w-auto mt-24">
                    <h1 className="font-bold font-mitr text-8xl leading-tight">
                        Launch<br />
                        unruggable<br />
                        tokens
                    </h1>
                </div>
                <div className="relative flex items-center w-full md:w-1/2 lg:w-auto max-w-lg">
                    <img
                        src="/pillow2.png"
                        alt="pillow"
                        className="relative -rotate-12 object-cover w-full h-auto"
                    />
                    <ol className="absolute flex flex-col justify-center items-start w-full h-full text-left text-xl mx-20 font-bold text-gray-800 space-y-6 px-12">
                        <li className="flex items-center">
                            <span
                                className="flex items-center justify-center bg-green-500 text-white rounded-full w-10 h-10 mr-4">
                                1
                            </span>
                            <div>
                                Launch a token<br /><span className="font-medium">Configure and deploy</span>
                            </div>
                        </li>
                        <li className="flex items-center">
                            <span
                                className="flex items-center justify-center bg-green-500 text-white rounded-full w-10 h-10 mr-4">
                                2
                            </span>
                            <div>
                                4% Insurance fee<br /><span className="font-medium">Taken from every swap</span>
                            </div>
                        </li>
                        <li className="flex items-center">
                            <span
                                className="flex items-center justify-center bg-green-500 text-white rounded-full w-10 h-10 mr-4">
                                3
                            </span>
                            <div>
                                Rug free<br /><span className="font-medium">Insurance paying off</span>
                            </div>
                        </li>
                    </ol>
                </div>
                <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2">
                    <svg className="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2"
                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            <div className="w-full px-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cardData.map((card, index) => (
                        <Link key={index} href={`/explore/${card.id}`} passHref legacyBehavior>
                            <a className="w-full h-48 flex shadow-md no-underline text-black">
                                <Card className="w-full h-48 flex shadow-md">
                                    <div>
                                        <img src={card.image} className="h-44 m-2 rounded-3xl" />
                                    </div>
                                    <div>
                                        <CardHeader>
                                            <CardTitle className="font-extrabold text-4xl font-mitr">{card.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{card.token}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <p>Launched {card.launched}</p>
                                        </CardFooter>
                                    </div>
                                </Card>
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="flex-col items-center text-center justify-center m-2 mb-4">
                <h2 className="text-4xl m-4 font-bold font-mitr">Ready to launch yours?</h2>
                <button
                    className="bg-customGreen px-4 py-2 rounded-3xl shadow-xl border border-4"
                    onClick={handleCreateClick}>Get
                    started
                </button>
            </div>
        </main>
    );
}
