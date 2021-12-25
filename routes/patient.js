const { handleJWT } = require('../middleware/handleJWT');
const patient = require('../databaseQueries/patient');

const router = require('express').Router();

router.post('/create', handleJWT, async (req, res) => {
    const { name, email, age, address, mobileNumber, gender, docId } = req.body;
    const { user_id } = req;

    if (!(name && email && age && address && mobileNumber && gender && docId)) {
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
            docId,
        });
        console.log(response, 'DbCreated');
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'cound not make pt ' });
    }
});

router.get('/:id', async (req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
    if (!id) {
        res.status(400).send({ message: 'Send Proper Query' });
        return;
    }
    const response = await patient.find_pt(id);
    if (response.code === 401) {
        res.status(400).send({ message: 'Something Went Wrong!' });
        return;
    }
    console.log(response.data);
    res.status(200).send(response.data);
});

router.get('/all', handleJWT, async (req, res) => {
    const { user_id } = req;

    try {
        const response = await patient.find_all({ pt_at: user_id });
        // console.log('Data', response);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'something went wrong !' });
    }
});

router.post('/all', handleJWT, async (req, res) => {
    const { user_id } = req;
    const { docId } = req.body;
    if (!docId) {
        return res.status(400).send({ message: 'Provide Doctor Id' });
    }
    const filter = {
        pt_at: user_id,
        docId,
    };
    try {
        const resp = await patient.find_all(filter);
        // console.log('Data', res);
        res.status(200).send(resp);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'something went wrong !' });
    }
});

module.exports = router;
