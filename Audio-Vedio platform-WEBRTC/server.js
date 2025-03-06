const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const socketIo = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Peer Server
const peerServer = ExpressPeerServer(server, { debug: true });

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);

console.log("Server setup initialized...");

// Ignore favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes
app.get("/", (req, res) => {
  const roomId = uuidv4();
  console.log(`Redirecting to room: ${roomId}`);
  res.redirect(`/${roomId}`);
});

app.get("/:room", (req, res) => {
  console.log(`Room accessed: ${req.params.room}`);
  res.render("room", { roomId: req.params.room });
});

// WebSocket Handling
io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("join-room", (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      console.log(`Message received in ${roomId}: ${message}`);
      io.to(roomId).emit("createMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Start Server
const PORT = process.env.PORT || 3030;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on("error", (err) => {
  console.error("Server error:", err);
});
