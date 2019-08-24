const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001;

io.on("connection", socket => {
    console.log("A user connected");
});

server.listen(port, () => {
    console.log(`Socket server is up on port ${port}!`);
});