const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// Create user
router.post('/', (req, res) => {
    const { name, username, password } = req.body;

    // Simple validation
    if (!name || !username || !password) {
        return res.status(400).send({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ username })
        .then((user) => {
            if (user) return res.status(400).send({ msg: 'User already exist' });

            const newUser = new User({
                name,
                username,
                password
            });

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then((user => {
                            jwt.sign(
                                { id: user.id },
                                config.get('jwtSecret'),
                                { expiresIn: 3600 },
                                (err, token) => {
                                    if (err) throw err;
                                    res.json({
                                        token,
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            username: user.username
                                        }
                                    });
                                }
                            )
                        }));
                });
            });
        });
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
        return res.status(400).send({ msg: 'Please enter all fields' });
    }

    // Check for existing user
    User.findOne({ username })
        .then(user => {
            if (!user) return res.status(400).send({ msg: 'User does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    username: user.username
                                }
                            });
                        }
                    )
                });
        });
});

module.exports = router;