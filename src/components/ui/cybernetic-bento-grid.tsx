"use client";

import React, { useEffect, useRef } from "react";

interface BentoItemProps {
  className?: string;
  children: React.ReactNode;
}

const BentoItem = ({ className = "", children }: BentoItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    };

    item.addEventListener("mousemove", handleMouseMove);

    return () => item.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={itemRef}
      className={`bento-item bg-white/5 p-6 rounded-xl shadow-lg transition hover:scale-[1.02] hover:bg-white/10 ${className}`}
    >
      {children}
    </div>
  );
};

export const CyberneticBentoGrid = () => {
  return (
    <div className="relative text-white py-20 px-4 bg-zinc-900 overflow-hidden">
      {/* Background gradient mashup */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-800 via-purple-900 to-rose-800 opacity-40 blur-3xl" />
        <div className="absolute -left-20 top-10 w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-20 rounded-full filter blur-3xl" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-gradient-to-tr from-rose-400 to-orange-400 opacity-15 rounded-full filter blur-3xl" />
       
      </div>

      <div className="w-full max-w-6xl mx-auto z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-12">
          Core Features
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bento-grid">
          {/* Real-Time Chat */}
          <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between bg-white/5">
            <h2 className="text-2xl font-bold mb-2">Real-Time Chat</h2>
            <p className="text-gray-400 text-sm mb-4">
              Communicate instantly with your team.
            </p>
           
          </BentoItem>

          {/* Task Boards */}
          <BentoItem>
            <h2 className="text-xl font-bold mb-2">Task Boards</h2>
            <p className="text-gray-400 text-sm">
              Organize projects efficiently.
            </p>
           
          </BentoItem>

          {/* Document Collaboration */}
          <BentoItem>
            <h2 className="text-xl font-bold mb-2">Document Collaboration</h2>
            <p className="text-gray-400 text-sm">
              Edit documents together in real-time.
            </p>
           
          </BentoItem>

          {/* Video & Whiteboard */}
          <BentoItem className="row-span-2">
            <h2 className="text-xl font-bold mb-2">Video & Whiteboard</h2>
            <p className="text-gray-400 text-sm">
              Connect face-to-face and brainstorm visually.
            </p>
           
          </BentoItem>

          {/* Optional features */}
          <BentoItem>
            <h2 className="text-xl font-bold mb-2">Secure Auth</h2>
            <p className="text-gray-400 text-sm">
              Enterprise-grade authentication built-in.
            </p>
          </BentoItem>

          <BentoItem className="col-span-2">
            <h2 className="text-xl font-bold mb-2">Serverless Functions</h2>
            <p className="text-gray-400 text-sm">
              Run your backend code without managing servers.
            </p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold mb-2">CLI Tool</h2>
            <p className="text-gray-400 text-sm">
              Manage your infrastructure from the command line.
            </p>
          </BentoItem>
        </div>
      </div>
    </div>
  );
};
