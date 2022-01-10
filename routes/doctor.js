const { handleJWT } = require('../middleware/handleJWT');
const doctor = require('../databaseQueries/doctorQueries');
const router = require('express').Router();

router.post('/create', handleJWT, async (req, res) => {
    const { name, specialization, mobileNumber, gender, spec, position } =
        req.body;
    const { user_id, user_name } = req;
    console.log(req.body);

    if (!(name && mobileNumber && gender && spec, position)) {
        return res.status(400).send({ message: 'Send Complete Data' });
    }
    let specArray = spec.split(',');
    try {
        const { data: response } = await doctor.create_doc({
            name: 'Dr. ' + name,
            gender,
            mobile_number: mobileNumber,
            specialization,
            doc_at: { id: user_id, name: user_name },
            spec: specArray,
            position,
        });
        // console.log(response, 'DbCreated');
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'cound not make pt ' });
    }
});

router.get('/getDoc', handleJWT, async (req, res) => {
    const { user_id } = req;
    try {
        const response = await doctor.find_by_user(user_id);
        console.log('Doctor', response);
        if (response.data) {
            return res.status(200).send(response);
        }
        return res.status(400).send(response.message);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'something went wrong !' });
    }
});

module.exports = router;
