const { handleJWT } = require('../middleware/handleJWT');
const patient = require('../databaseQueries/patient');
const { find_doc } = require('../databaseQueries/doctorQueries');
const { find_users } = require('../databaseQueries/user');
const router = require('express').Router();

router.post('/create', async (req, res) => {
    const {
        name,
        email,
        age,
        address,
        mobileNumber,
        gender,
        docId,
        docName,
        user_id,
        user_name,
    } = req.body;
    if (!user_id)
        return res.status(400).send({ message: 'Send All Data user' });
    if (!(name && email && age && address && mobileNumber && gender && docId)) {
        return res.status(400).send({ message: 'Send All Data' });
    }

    try {
        const user = await find_users({ _id: user_id });
        console.log(user);
        if (user.code !== 200)
            return res.status(401).send({ message: 'User Not Found' });
        const { data: response } = await patient.create_pt({
            name,
            email,
            age,
            address,
            gender,
            mobile_number: mobileNumber,
            pt_at: { id: user_id, name: user_name ?? user.data.name },
            doctor: {
                id: docId,
                name: docName,
            },
        });
        res.status(200).send(response);
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: 'cound not make pt ' });
    }
});

router.get('/all', handleJWT, async (req, res) => {
    try {
        const { user_id } = req;
        const response = await patient.find_all({
            'pt_at.id': user_id,
            isActive: true,
        });
        res.status(200).send(response);
    } catch (error) {
        console.log('Error at get all', error);
        res.status(400).send({ message: 'something went wrong !' });
    }
});

router.post('/all', handleJWT, async (req, res) => {
    try {
        const { user_id } = req;
        const { docId } = req.body;
        if (!docId) {
            return res.status(400).send({ message: 'Provide Doctor Id' });
        }
        const filter = {
            'pt_at.id': user_id,
            'doctor.id': docId,
        };
        const resp = await patient.find_all(filter);
        res.status(200).send(resp);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'something went wrong !' });
    }
});

router.delete('/at/:id', handleJWT, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: 'Bad Request' });
        }
        const update = await patient.findAndUpdate(id, { isActive: false });
        if (update.code !== 200) {
            return res.status(500).send({ message: 'Something Went Wrong!' });
        }
        res.send({ message: 'Succesfully Deleted' });
    } catch (error) {
        console.log('error on pt delete', error);
        return res.status(500).send({ message: 'Something Went Wrong!' });
    }
});

router.put('/at/:id', handleJWT, async (req, res) => {
    const data = req.body;
    const { id } = req.params;
    if (!id) {
        res.status(400).send({ message: 'Bad Request' });
        return;
    }
    console.log('update', data);
    const returnData = {};
    if (data.name) {
        returnData.name = data.name;
    }
    if (data.email) {
        returnData.email = data.email;
    }
    if (data.gender) {
        returnData.gender = data.gender;
    }
    if (data.address) {
        returnData.address = data.address;
    }
    if (data.age) {
        returnData.age = data.age;
    }
    if (data.mobileNumber) {
        returnData.mobile_number = data.mobileNumber;
    }
    if (data.docId) {
        returnData.doctor = {};
        returnData.doctor.id = data.docId;
        returnData.doctor.name = data.docName;
    }
    try {
        const response = await patient.findAndUpdate(id, returnData);
        if (response.code !== 200) {
            return res.status(500).send({
                message: "couldn't send the data",
                mes: response.data,
            });
        }
        res.send(response.data);
    } catch (error) {
        console.log('Final Data', error);
        res.status(500).send({
            message: "couldn't send the data",
            mes: error,
        });
    }
});

router.get('/at/:id', async (req, res) => {
    try {
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
        res.status(200).send(response.data);
    } catch (err) {
        console.log('Error on id', err);
        res.status(400).send({ message: "Coudn't make your request", err });
    }
});

module.exports = router;
