// Virus simulation types and configuration

export type VirusStage =
  | "notification"
  | "silent"
  | "sprites"
  | "glitch"
  | "bsod"
  | "ransomware";

export type NotificationVariant = {
  title: string;
  message: string;
  fileName: string;
  features: string[];
};

export const VIRUS_TIMING = {
  notificationDelay: 40000, // 40s after page load
  notificationRepeatDelay: 30000, // 30s if user clicks "Cancel"
  silentInfection: 3000, // 3s silent phase before starting
  virusSpawnDuration: 20000, // 20s total spawn phase
  virusMinInterval: 1, // Minimum spawn interval (0.001s)
  glitchDuration: 8000, // 8s glitch phase
  bsodDuration: 5000, // 5s blue screen display
  ransomwareCountdown: 600, // 10 minutes in seconds
};

export const NOTIFICATION_VARIANTS: NotificationVariant[] = [
  {
    title: "Windows Update",
    message: "New software has been automatically installed on your computer:",
    fileName: "Definitely_Not_A_Virus.exe",
    features: [
      "Make your computer 1000x faster",
      "Delete all your problems",
      "Definitely NOT steal your data",
    ],
  },
  {
    title: "🎉 Congratulations!",
    message: "You've won a FREE iPad!",
    fileName: "Claim_Your_Prize.exe",
    features: [
      "100% legitimate prize",
      "No strings attached",
      "Totally not a scam",
    ],
  },
  {
    title: "⚠️ URGENT SECURITY ALERT",
    message: "Your computer has 374 viruses detected!",
    fileName: "PC_Cleaner_Pro.exe",
    features: [
      "Remove all viruses instantly",
      "Boost performance by 500%",
      "Certified by Microsoft (not really)",
    ],
  },
  {
    title: "💘 Hot Singles Near You",
    message: "Someone special wants to meet you!",
    fileName: "Meet_Singles_Now.exe",
    features: [
      "Real profiles (definitely)",
      "No credit card required (yet)",
      "Your dream date awaits",
    ],
  },
  {
    title: "🎊 You're Our 1,000,000th Visitor!",
    message: "Claim your $1,000,000 prize NOW!",
    fileName: "Claim_Money_Fast.exe",
    features: [
      "Tax-free cash prize",
      "Instant bank transfer",
      "Totally legitimate lottery",
    ],
  },
  {
    title: "System Software Update",
    message: "Critical update required for your system:",
    fileName: "Definitely_Not_A_Virus.exe",
    features: [
      "Trusted by nobody",
      "100% safe (trust me bro)",
      "Your data is safe with us (it's not)",
    ],
  },
];

export type VirusSprite = {
  id: string;
  type: "butterfly" | "bonzibuddy";
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  message?: string; // For BonziBuddy speech bubbles
};
