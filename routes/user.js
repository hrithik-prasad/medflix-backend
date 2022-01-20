const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { TOKEN_KEY } = require('../config');
const User = require('../databaseQueries/user');
const { handleJWT } = require('../middleware/handleJWT');

router.get('/check', handleJWT, async (req, res) => {
    try {
        const response = await User.find_users({ _id: req.user_id });
        if (response.code !== 200) {
            return res.status(400).redirect('/login');
        }
        res.status(200).send({
            name: response.data.name,
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
    const {
        name,
        email,
        password,
        logo,
        subTitle,
        punchLine,
        website,
        address,
        contact,
    } = req.body;
    if (!(name && email && password && address && logo)) {
        return res.status(400).send({ message: 'Send All Data' });
    }
    const encryPass = await bcrypt.hash(password, 10);

    const user_id = mongoose.Types.ObjectId();

    try {
        const token = jwt.sign({ user_id, email, name }, TOKEN_KEY, {
            expiresIn: '5h',
        });
        const user = await User.create_user({
            name,
            email: email.toLowerCase(),
            password: encryPass,
            token,
            logo,
            subTitle,
            punchLine,
            website,
            address,
            contact,
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

router.get('/detail', async (req, res) => {
    try {
        const { user_id } = req.query;
        const response = await User.find_users({ _id: user_id });
        if (response.code !== 200)
            return res.status(401).send({ message: 'No user Found' });

        const responseData = {
            name: response.data.name,
            email: response.data.email,
            logo: response.data.logo,
            subTitle: response.data.subTitle,
            punchLine: response.data.punchLine,
            address: response.data.address,
            contact: response.data.contact,
        };
        res.send(responseData);
    } catch (err) {}
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        try {
            const { data: user } = await User.find_users({ email });

            if (!user) {
                return res.status(401).send({
                    message: "User Dosn't Exist",
                });
            }
            const ver = await bcrypt.compare(password, user.password);
            if (!ver) {
                return res.status(400).json({ message: 'PassWord is Wrong' });
            }
            console.log('Token Exp:', checkTokenExp(user.token));
            const token = jwt.sign(
                { user_id: user._id, email, name: user.name },
                TOKEN_KEY,
                {
                    expiresIn: '5h',
                }
            );
            const response_update = await User.find_user_update_token(
                user.id,
                token
            );
            console.log('Response token', response_update);

            return res.send({
                name: user.name,
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
