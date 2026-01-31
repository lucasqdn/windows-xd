import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Track all connected users
  const users = new Map<string, string>(); // socketId -> username

  io.on("connection", (socket) => {
    // Generate and assign username
    const username = generateUsername();
    socket.data.username = username;
    users.set(socket.id, username);

    console.log(`User connected: ${username} (${socket.id})`);

    // Notify all users someone joined
    io.emit("user-joined", { username });

    // Send current user list to new user
    socket.emit("user-list", Array.from(users.values()));

    // Broadcast updated user list to everyone
    io.emit("user-list", Array.from(users.values()));

    // Handle incoming messages
    socket.on("message", (msg: string) => {
      console.log(`Message from ${username}: ${msg}`);
      io.emit("message", {
        username: socket.data.username,
        text: msg,
        timestamp: Date.now(),
        type: "message",
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${username} (${socket.id})`);
      users.delete(socket.id);
      io.emit("user-left", { username: socket.data.username });
      io.emit("user-list", Array.from(users.values()));
    });
  });

  server
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> Socket.IO server running`);
    });
});
