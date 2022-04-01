const { PORT, MONGO_URI, BACKEND_URL, FRONTEND_URL, TOKEN_KEY } = process.env;
console.log("🚀 ~ file: config.js ~ line 2 ~ PORT, MONGO_URI, BACKEND_URL, FRONTEND_URL, TOKEN_KEY", PORT, MONGO_URI, BACKEND_URL, FRONTEND_URL, TOKEN_KEY)

module.exports = {
    PORT,
    MONGO_URI,
    FRONTEND_URL,
    TOKEN_KEY,
    BACKEND_URL,
    ROOT: __dirname,
};
