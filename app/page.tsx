"use client";

import { useState } from "react";
import { Desktop } from "@/app/components/Desktop";
import { BootupScreen } from "@/app/components/BootupScreen";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);

  if (!bootComplete) {
    return <BootupScreen onBootComplete={() => setBootComplete(true)} />;
  }

  return <Desktop />;
}
