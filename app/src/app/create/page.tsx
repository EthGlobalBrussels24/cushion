// src/app/create/page.tsx
import dynamic from "next/dynamic";

const TokenForm = dynamic(() => import("~/components/ui/TokenForm"), { ssr: false });

export default function CreatePage() {
    return (
        <div className="container flex-col justify-center text-center mx-auto p-4">
            <h1 className="text-4xl font-bold font-montserrat mb-4">Launch Unruggable Token</h1>
            <TokenForm />
        </div>
    );
}
