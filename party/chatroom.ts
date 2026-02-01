import type * as Party from "partykit/server";

type Message = {
  username: string;
  text: string;
  timestamp: number;
  type: "message" | "system";
};

function generateUsername(): string {
  const adjectives = [
    "Cool", "Retro", "Super", "Epic", "Mega", "Rad", "Awesome", "Groovy",
    "Funky", "Happy", "Lucky", "Snappy", "Zippy", "Bouncy", "Chirpy", "Jazzy"
  ];
  const nouns = [
    "User", "Gamer", "Fan", "Dude", "Legend", "Pro", "Wizard", "Ninja",
    "Knight", "Dragon", "Phoenix", "Tiger", "Eagle", "Wolf", "Bear", "Fox"
  ];
  const num = Math.floor(Math.random() * 100);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}${num}`;
}

export default class ChatroomServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  // Track connected users: connection.id -> username
  users = new Map<string, string>();

  onConnect(conn: Party.Connection) {
    // Generate username for new connection
    const username = generateUsername();
    this.users.set(conn.id, username);

    console.log(`User connected: ${username} (${conn.id})`);

    // Send username to the new user
    conn.send(JSON.stringify({ 
      type: "username-assigned", 
      username 
    }));

    // Notify all users someone joined
    this.room.broadcast(JSON.stringify({
      type: "user-joined",
      username
    }));

    // Send current user list to all users
    const userList = Array.from(this.users.values());
    this.room.broadcast(JSON.stringify({
      type: "user-list",
      users: userList
    }));
  }

  onMessage(message: string, sender: Party.Connection) {
    const username = this.users.get(sender.id);
    
    if (!username) {
      console.error(`Unknown user ${sender.id} sent message`);
      return;
    }

    console.log(`Message from ${username}: ${message}`);

    // Broadcast message to all users
    const msg: Message = {
      username,
      text: message,
      timestamp: Date.now(),
      type: "message"
    };

    this.room.broadcast(JSON.stringify(msg));
  }

  onClose(conn: Party.Connection) {
    const username = this.users.get(conn.id);
    
    if (!username) {
      return;
    }

    console.log(`User disconnected: ${username} (${conn.id})`);

    // Remove user
    this.users.delete(conn.id);

    // Notify all users someone left
    this.room.broadcast(JSON.stringify({
      type: "user-left",
      username
    }));

    // Send updated user list
    const userList = Array.from(this.users.values());
    this.room.broadcast(JSON.stringify({
      type: "user-list",
      users: userList
    }));
  }
}

ChatroomServer satisfies Party.Worker;
