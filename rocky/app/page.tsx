"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const Rocky = dynamic(() => import("./Rocky"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full text-orange-400 text-xl">
      Loading Rocky...
    </div>
  ),
});

export default function Home() {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="relative w-screen h-screen bg-[#000000] overflow-hidden">
      <Rocky />

      {/* Title Overlay */}
      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <h1 className="text-3xl font-bold text-[#ff6b35] drop-shadow-[0_0_10px_rgba(255,107,53,0.5)]">
          Rocky
        </h1>
        <p className="text-sm text-gray-300 opacity-80 mt-1">
          From <em>Project Hail Mary</em> by Andy Weir
        </p>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <p className="text-xs text-gray-500">
          Left Click + Drag to Rotate &middot; Right Click + Drag to Pan &middot; Scroll to Zoom
        </p>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-5 w-64 bg-[#141428]/90 border border-[#ff6b35]/30 rounded-xl p-4 text-gray-200 text-sm z-10 backdrop-blur-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[#ff6b35] font-semibold">Species: Astrogator</h3>
            <button
              style={{ border: "none", background: "transparent", cursor: "pointer" }}
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-white text-lg leading-none"
            >
              &times;
            </button>
          </div>
          <div className="space-y-2 leading-relaxed">
            <p><strong>Name:</strong> Rocky</p>
            <p><strong>Origin:</strong> 40 Eridani system</p>
            <p><strong>Anatomy:</strong> Pentapod (5 legs), rock like, friendly alien</p>
            <p><strong>Exoskeleton:</strong> Brown-grey, rough and hard core, temperature-sensitive</p>
            <p><strong>Traits:</strong> Brilliant engineer, speaks through musical tones</p>
            <p className="text-xs text-gray-400 italic pt-1">
              &ldquo;I am Ryland. I am friend.&rdquo;
            </p>
          </div>
        </div>
      )}

      {!showInfo && (
        <button
          onClick={() => setShowInfo(true)}
          className="absolute top-20 right-5 bg-[#141428]/90 border border-[#ff6b35]/30 rounded-lg px-4 py-2 text-[#ff6b35] text-sm z-10 hover:bg-[#1a1a30] transition-colors"
        >
          Show Info
        </button>
      )}
    </div>
  );
}

