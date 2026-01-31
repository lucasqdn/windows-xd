export type Message = {
  username: string;
  text: string;
  timestamp: number;
  type?: "message" | "system";
};

export type ChatState = {
  messages: Message[];
  users: string[];
  username: string;
  connected: boolean;
};
