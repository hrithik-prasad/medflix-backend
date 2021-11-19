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
    // console.log(req.cookies.session);
    const session = req.cookies.session;
    const decoded = jwt.verify(session, TOKEN_KEY);
    // console.log(decoded, 'Decoded');
    try {
        const { data: user } = await User.find_users({ _id: decoded.user_id });
        // console.log(user, 'User');
        res.status(200).send({
            full_name: user.full_name,
            email: user.email,
            token: user.token,
        });
    } catch (err) {
        console.log(err);
        res.status(401).send({ message: 'Some error' });
    }
});
router.get('/clear', (req, res) => {
    console.log('called clear cookie');
    res.clearCookie('token').send({ message: 'Cleared' });
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
        console.log(user);
        res.send({ message: 'Hello', id: user_id, token });
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: err?.data });
    }
});

router.post('/login', async (req, res) => {
    console.log(process.env.NODE_ENV);
    const { email, password } = req.body;
    if (email && password) {
        try {
            const { data: user } = await User.find_users({ email });
            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign(
                    { user_id: user._id, email },
                    TOKEN_KEY,
                    {
                        expiresIn: '5h',
                    }
                );
                const update_token = await User.find_user_update_token(
                    user.id,
                    token
                );

                return res
                    .cookie('token', token, {
                        path: '/',
                        httpOnly: true,
                        maxAge: 1800000,
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .send({
                        full_name: user.full_name,
                        email: user.email,
                        token: user.token,
                    });
            }
            res.send({ message: 'Password Wrong!' });
        } catch (err) {
            console.log(err);
            return res.send({ err: 'Error' });
        }
    } else {
        res.status(400).send({ message: 'Provide Credentials' });
    }
});

module.exports = router;
