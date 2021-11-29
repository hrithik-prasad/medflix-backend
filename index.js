const express = require('express');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const cors = require('cors');
require('dotenv').config();
const { PORT, MONGO_URI, FRONTEND_URL } = require('./config');
const User = require('./routes/user');
const Patient = require('./routes/patient');
const DoctorRoute = require('./routes/doctor');
const cookieParser = require('cookie-parser');
const app = express();

const port = PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'https://techbgs.live'];

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
        origin: FRONTEND_URL,
    })
);

app.use('/user', User);
app.use('/patient', Patient);
app.use('/doctor', DoctorRoute);

app.get('/', (req, res) => {
    res.status(200).send({ message: 'Server Up and Running' });
});

app.listen(port, () => {
    console.log(`Server Up & Running on ${port}`);
});
