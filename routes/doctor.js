const { handleJWT } = require('../middleware/handleJWT');
const doctor = require('../databaseQueries/doctorQueries');
const router = require('express').Router();

router.post('/create', handleJWT, async (req, res) => {
    const { name, specialization, mobileNumber, gender, spec, position } =
        req.body;
    const { user_id, user_name } = req;
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
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'cound not make pt ' });
    }
});

router.put('/at/:id', handleJWT, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ message: 'Bad Request' });
    }
    const data = req.body;
    const returnData = {};
    if (data.name) {
        returnData.name = 'Dr. ' + data.name;
    }
    if (data.gender) {
        returnData.gender = data.gender;
    }
    if (data.spec) {
        returnData.spec = data.spec.split(',');
    }
    if (data.position) {
        returnData.position = data.position;
    }
    if (data.mobileNumber) {
        returnData.mobile_number = data.mobileNumber;
    }
    if (data.specialization) {
        returnData.specialization = data.specialization;
    }
    try {
        const response = await doctor.docFindAndUpdate(id, returnData);
        if (response.code !== 200) {
            return res
                .status(500)
                .send({ message: 'Count Not update', response });
        }
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Count Not update', error });
    }
});

router.post('/docs', async (req, res) => {
    try {
        const { user_id } = req.body;
        const response = await doctor.find_by_user(user_id);
        if (response.code !== 200) {
            return res.status(400).send(response.message);
        }
        return res.status(200).send(response);
    } catch (err) {
        console.log('Couldnot Find doc reg page', err);
        res.status(500).send({ message: 'Something went wrong' });
    }
});

router.get('/getDoc', handleJWT, async (req, res) => {
    const { user_id } = req;
    try {
        // console.log('user', user_id);
        const response = await doctor.find_by_user(user_id);
        // console.log('get doc', response);
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
