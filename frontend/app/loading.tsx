import React from "react";

const Loading = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60">
    <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Loading;
