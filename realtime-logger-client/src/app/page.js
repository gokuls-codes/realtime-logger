import LogDisplay from "@/components/log-display";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" min-h-screen bg-black">
      <header className="flex justify-center items-center h-20">
        <h1 className=" text-4xl font-semibold text-white">Real-time Logs</h1>
      </header>
      <main className=" w-full mx-auto max-w-screen-xl min-h-[400px]">
        <LogDisplay />
      </main>
    </div>
  );
}
