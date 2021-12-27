const { verify } = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config');

const handleJWT = async (req, res, next) => {
    try {
        const token = req.get('authorization');
        console.log('Token Called', token);
        if (!token) {
            // console.log('token not present');
            return res.status(401).send('Token not Present');
        }
        // console.log('Token is present ', token);
        const data = verify(token, TOKEN_KEY);
        // console.log(data, typeof data);
        req.user_id = data.user_id;
        // console.log(req);
        return next();
    } catch (error) {
        console.log('Err', error);
        res.status(400).json({ message: 'Error', error });
        // res.redirect('/login');
    }
};

module.exports = { handleJWT };
