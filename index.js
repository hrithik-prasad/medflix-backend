const express = require('express');
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { PORT, MONGO_URI, FRONTEND_URL } = require('./config');
const User = require('./routes/user');
const Patient = require('./routes/patient');
const Reports = require('./routes/reports');
const pugController = require('./controllers/pugController/pugpdf');
const DoctorRoute = require('./routes/doctor');
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'pug');

const port = PORT || 5000;

// const allowedOrigins = ['http://localhost:3000', 'https://techbgs.live'];

(async () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((response) => {
            console.log('DB Connected');
        })
        .catch((error) => {
            console.log('unable to connect to DB');
            console.log(error);
        });
})();

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
app.use('/reports', Reports);
app.get('/pugtest', (req, res) => {
    const payload = {
        items: [
            {
                name: 'paste',
                cost: 40,
                quantity: 1,
                amount: 40,
            },
        ],
        customerDetails: {
            name: 'Muthu',
            area: '8/91, main street',
            city: 'chennai',
            state: 'Tamil nadu',
            country: 'India',
        },
        invoiceNumber: 12332523,
        dateofissue: '12/10/2020',
        invoiceTotal: 47.2,
        tax: 7.2,
        subtotal: 40,
        amountDue: 47.2,
    };
    res.render('index.pug', { payload });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/pug', pugController);
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Server Up and Running' });
});

app.listen(port, () => {
    console.log(`Server Up & Running on ${port}`);
});
