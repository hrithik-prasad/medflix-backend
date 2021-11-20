const { handleJWT } = require('../middleware/handleJWT');
const patient = require('../databaseQueries/patient');

const router = require('express').Router();

router.post('/create', handleJWT, async (req, res) => {
    const { name, email, age, address, mobileNumber, gender } = req.body;
    const { user_id } = req;

    if (!(name && email && age && address && mobileNumber && gender)) {
        return res.status(400).send({ message: 'Send All Data' });
    }

    try {
        const { data: response } = await patient.create_pt({
            name,
            email,
            age,
            address,
            gender,
            mobile_number: mobileNumber,
            pt_at: user_id,
        });
        console.log(response, 'DbCreated');
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'cound not make pt ' });
    }
});

router.get('/all', handleJWT, async (req, res) => {
    const { user_id } = req;

    try {
        const response = await patient.find_all(user_id);
        console.log('Data', response);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'something went wrong !' });
    }
});

module.exports = router;
