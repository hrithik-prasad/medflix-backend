const { verify } = require('jsonwebtoken');
const { TOKEN_KEY } = require('../config');

const handleJWT = async (req, res, next) => {
    console.log(req);
    console.log(req.cookies);
    // const token = req.cookies.session;
    const token = req.get('authorization');
    if (!token) {
        return res.status(401).send({ message: 'Token Not Found' });
    }
    // console.log('Inside JWT');
    try {
        // console.log('token', TOKEN_KEY);
        const data = verify(token, TOKEN_KEY);
        // console.log('data Token', data);
        req.user_id = data.user_id;
        next();
    } catch (error) {
        console.log('Err', error);
        res.status(403).send({ message: 'Error' });
    }
};

module.exports = { handleJWT };
