const { verify } = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config');

const handleJWT = async (req, res, next) => {
    const token = req.cookies.token || req.cookies.session;
    if (!token) {
        return res.status(401).send({ message: 'Token Not Found' });
    }
    // console.log('Inside JWT');
    try {
        const data = verify(token, TOKEN_KEY);
        console.log('data Token', data.user_id);
        req.user_id = data.user_id;
        return next();
    } catch (error) {
        console.log('Err', error);
        res.status(403).send({ message: 'Error' });
    }
};

module.exports = { handleJWT };
