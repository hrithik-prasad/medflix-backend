const { PORT, MONGO_URI, BACKEND_URL, FRONTEND_URL, TOKEN_KEY } = process.env;

module.exports = {
    PORT,
    MONGO_URI,
    FRONTEND_URL,
    TOKEN_KEY,
    BACKEND_URL,
    ROOT: __dirname,
};
