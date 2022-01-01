const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    full_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    //TODO: add hospital details img logo, name gstin, address etc;
    //TODO: add authorization to doc and hospital management
});

module.exports = mongoose.model('user', userSchema);
