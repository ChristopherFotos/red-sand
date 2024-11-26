// server-side code using Socket.IO

const express = require("express");
const path = require("path");
const { createServer } = require("http");
const handleChangesToMain = require("./changes-to-main");
const { Server } = require("socket.io");

const app = express();
app.use("/changes-to-main-branch", express.raw({ type: "application/json" }));
app.use(express.static(path.join(__dirname, "/public")));
app.post("/changes-to-main-branch", handleChangesToMain);

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Someone has connected");

  socket.on("draw", (data) => {
    console.log("MESSAGE RECEIVED: ", data);
    // Send to all clients, including the sender
    socket.broadcast.emit("update", data);
  });

  socket.on("touchdraw", (data) => {
    console.log("TOUCH DRAW RECEIVED: ", data);
    socket.broadcast.emit("update", data);
  });
});

server.listen(8080, function () {
  console.log("Listening on http://0.0.0.0:8080");
});
