const mongoose = require('mongoose');
const { Schema } = mongoose; // const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleID: String,
    displayName: String,
    loginCount: Number,
    lastLogin: Date
});

mongoose.model('user', userSchema);