const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, default: null },
    email: { type: String, unique: true },
    logo: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        default: '',
    },
    punchLine: {
        type: String,
        default: '',
    },
    website: {
        type: String,
    },
    address: {
        type: String,
        default: '',
        required: true,
    },
    contact: {
        type: String,
        default: '',
        true: true,
    },
    password: { type: String },
    token: { type: String },
    //TODO: add hospital details img logo, name gstin, address etc;
    //TODO: add authorization to doc and hospital management
});

module.exports = mongoose.model('user', userSchema);
