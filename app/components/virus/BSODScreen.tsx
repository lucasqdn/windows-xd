"use client";

import { useEffect } from "react";

type BSODScreenProps = {
  onComplete: () => void;
};

export function BSODScreen({ onComplete }: BSODScreenProps) {
  useEffect(() => {
    // Auto-advance to ransomware after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-[#0000AA] text-white p-16 overflow-auto"
      style={{ 
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        fontSize: "16px",
        lineHeight: "1.4"
      }}
    >
      {/* Windows 98 BSOD Recreation */}
      <div className="max-w-4xl">
        {/* Title */}
        <div className="text-center mb-6 font-bold">
          Windows
        </div>

        {/* Main Error Message */}
        <div className="mb-6">
          A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +
          00010E36. The current application will be terminated.
        </div>

        {/* Instruction Lines */}
        <div className="mb-6">
          * Press any key to terminate the current application.
        </div>
        <div className="mb-6">
          * Press CTRL+ALT+DEL again to restart your computer. You will
          <br />
          &nbsp;&nbsp;lose any unsaved information in all applications.
        </div>

        {/* Status Line */}
        <div className="mb-8">
          Press any key to continue _
        </div>

        {/* Technical Details Section */}
        <div className="border-t border-white pt-4 mt-8 text-sm opacity-90">
          <div>Stack dump:</div>
          <div className="font-mono mt-2">
            0028:C0011E36 00000000 00000000 00000000 00000000
          </div>
          <div className="font-mono">
            0028:C0011E46 00000000 00000000 00000000 00000000
          </div>
          <div className="font-mono">
            0028:C0011E56 00000000 00000000 00000000 00000000
          </div>
        </div>
      </div>
    </div>
  );
}
