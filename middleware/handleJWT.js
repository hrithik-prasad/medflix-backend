const { verify } = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config');

const handleJWT = async (req, res, next) => {
    console.log('REQ', req.cookies);

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: 'Token Not Found' });
    }
    console.log('Inside JWT');
    try {
        const data = verify(token, TOKEN_KEY);
        console.log('data Token', data);
        return next();
    } catch (error) {
        console.log('Err', error);
        res.status(403).send({ message: 'Error' });
    }
};

module.exports = { handleJWT };
