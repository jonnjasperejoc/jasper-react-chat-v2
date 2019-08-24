const express = require('express');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleWare/auth');

// Chat Model
const Chat = require('../../models/Chat');
// User Model
const User = require('../../models/User');

// Get Chats
router.get('/', auth, async (req, res) => {
    await Chat.find()
        .select('-date')
        .select('-__v')
        .sort({ date: 1 })
        .then(chats => res.send(chats))
});

// Add chat message
router.post('/', auth, async (req, res) => {
    const newChat = new Chat({
        message: req.body.message,
        owner: req.body.owner,
        ownerName: req.body.ownerName
    });

    await newChat.save().then(chat => res.send(chat));
});

module.exports = router;