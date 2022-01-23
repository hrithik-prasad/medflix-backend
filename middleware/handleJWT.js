const { verify } = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config');

const handleJWT = async (req, res, next) => {
    try {
        const token = req.get('authorization');
        if (!token) {
            return res.status(401).send('Token not Present');
        }
        const data = verify(token, TOKEN_KEY);
        if (!data) {
            return res.status(401).send('Token not Present');
        }
        req.user_id = data.user_id;
        req.user_name = data.name;
        return next();
    } catch (error) {
        console.log('Err Token Expired', error);
        res.clearCookie('session')
            .status(400)
            .send({ message: 'Not Authenticated' });
    }
};

module.exports = { handleJWT };
