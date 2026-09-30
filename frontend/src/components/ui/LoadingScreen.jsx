import React from "react";

/**
 * Reusable full-screen loading indicator for asynchronous data fetches and AI generation.
 */
export const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#09090e] text-white">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
        <h1 className="text-xl font-bold tracking-tight text-slate-200">
          {message}
        </h1>
      </div>
    </main>
  );
};

export default LoadingScreen;
