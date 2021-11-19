const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { PORT, MONGO_URI, FRONTEND_URL } = require('./config');
const User = require('./routes/user');
const cookieParser = require('cookie-parser');
const app = express();

const port = PORT || 5000;

const allowedOrigins = [
    'http://localhost:3000',
    'https://www.techbgs.live',
    'https://techbgs.live',
];

mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((response) => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.log('unable to connect to DB');
        console.log(error);
    });

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        credentials: true,
        origin: (origin, cb) => {
            console.log('Origin ', origin);
            if (allowedOrigins.indexOf(origin) == -1) {
                return cb(
                    Error(
                        `Can't take request from this url ${origin}`,
                        origin,
                        'should be among these',
                        allowedOrigins
                    ),
                    false
                );
            }
            return cb(null, true);
        },
    })
);

app.use('/user', User);

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Server Up and Running' });
});

app.listen(port, () => {
    console.log(`Server Up & Running on ${port}`);
});
