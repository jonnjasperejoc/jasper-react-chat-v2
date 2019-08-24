const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require("http");
const socketio = require("socket.io");
const config = require('config');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = config.get('mongoURI');

// Connect to MongoDB
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})  // Adding new mongo url parser
    .then(() => console.log('MongoDB Connected'))
    .catch(() => console.log(err));

// Use routes
app.use('/api/chats', require('./routes/api/chats'));
app.use('/api/users', require('./routes/api/users'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Socket IO server, accepts chat arrays from client and return it by broadcasting to all connected users
io.on('connection', socket => {
    socket.on('receive_chats', (chats, callback) => {
        io.emit("return_chats", chats);
        callback();
    });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log('Server started on port ' + port));