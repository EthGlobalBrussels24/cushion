"use client";
import dynamic from "next/dynamic";

const TokenForm = dynamic(() => import("~/components/ui/TokenForm"), {
  ssr: false,
});

export default function CreatePage() {
  return (
    <div className="container mx-auto flex-col justify-center p-4 text-center">
      <h1 className="mb-4 font-montserrat text-4xl font-bold">
        Launch Unruggable Token
      </h1>
      <TokenForm />
    </div>
  );
}
