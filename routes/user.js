const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { TOKEN_KEY } = require('../config');
const User = require('../databaseQueries/user');
const { handleJWT } = require('../middleware/handleJWT');
// const User = require("../models/user");

router.post('/create', (req, res) => {
    if (req.body.name) {
        const name = req.body.name;
        res.status(200).send({ user: name });
    } else {
        res.status(400).send({ message: 'Bad Request' });
    }
});

router.get('/check', handleJWT, async (req, res) => {
    try {
        const response = await User.find_users({ _id: req.user_id });
        if (response.code !== 200) {
            return res.status(400).redirect('/login');
        }
        res.status(200).send({
            full_name: response.data.full_name,
            email: response.data.email,
            token: response.data.token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'Some error' });
    }
});

router.get('/logout', handleJWT, (req, res) => {
    res.clearCookie('token')
        .status(200)
        .send({ status: 200, message: 'Logged Out' });
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const full_name = first_name + ' ' + last_name;
    if (!(first_name && email && password)) {
        res.status(400).send({ message: 'Send All Data' });
    }

    const encryPass = await bcrypt.hash(password, 10);

    const user_id = mongoose.Types.ObjectId();

    try {
        const token = jwt.sign({ user_id, email }, TOKEN_KEY, {
            expiresIn: '5h',
        });
        const user = await User.create_user({
            first_name,
            last_name,
            full_name,
            email: email.toLowerCase(),
            password: encryPass,
            token,
        });

        if (user.code !== 200) {
            return res.status(user.code).send({ message: user.message });
        }
        res.send({ message: 'User Created', id: user_id });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: err?.data });
    }
});

const checkTokenExp = (token) => {
    try {
        const data = verify(token, TOKEN_KEY);
        return true;
    } catch (err) {
        return false;
    }
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        try {
            const { data: user } = await User.find_users({ email });
            console.log(user, 'User');
            if (!user) {
                return res.status(401).send({
                    message: "User Dosn't Exist",
                });
            }
            const ver = await bcrypt.compare(password, user.password);
            // console.log('ver', ver);
            if (!ver) {
                return res.status(400).json({ message: 'PassWord is Wrong' });
            }
            console.log('Token Exp:', checkTokenExp(user.token));
            const token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
                expiresIn: '5h',
            });

            const response_update = await User.find_user_update_token(
                user.id,
                token
            );
            console.log('Response token', response_update);

            return res.send({
                full_name: user.full_name,
                email: user.email,
                token: token,
            });
        } catch (err) {
            console.log(err);
            return res.status(401).send({ err: 'Error' });
        }
    } else {
        res.status(401).send({ message: 'Provide Credentials' });
    }
});

module.exports = router;
