import React from "react";
import EgFlow from "../components/home/EgFlow";

export default function Home() {
  return (
    <div className="w-full overflow-hidden flex flex-col">

      {/* HERO SECTION */}
      <section className="relative h-screen w-screen overflow-hidden pt-12 sm:pt-6">

        {/* GRAPH (fills section only) */}
        <div className="absolute inset-0 z-10">
          <EgFlow />
        </div>

        {/* CONTENT OVERLAY */}
        <div
          className="
            relative z-10
            h-[88%]
            sm:h-full
            flex
            justify-center
            items-center
            
          "
        >
          <div
            className="
              p-6
              w-full
              lg:max-w-[80%]
              bg-white/5
              backdrop-blur-xs
              rounded-2xl
            "
          >
            <h1 className="leading-tight font-extrabold">
              <span className="block text-5xl md:text-5xl lg:text-7xl ">
                Nerch <br /> Infrastructure Visualized.
              </span>

              <span className="block mt-4 text-3xl md:text-4xl bg-linear-to-r from-pink-300 to-purple-500 text-transparent bg-clip-text">
                Map. Route. Understand.
              </span>
            </h1>

            <p className="mt-5 text-xl text-muted-foreground">
              See your entire system as a connected living graph — services,
              traffic flows, and metadata in one interactive space.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">
              <button className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition">
                Launch Topology
              </button>

              <button className="border px-6 py-3 rounded-xl font-semibold hover:bg-black/5 transition">
                View Demo
              </button>
            </div>
          </div>
        </div>

      </section>

      {/* <section>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
        <div>ads</div>
      </section> */}

      
    </div>
  );
}
