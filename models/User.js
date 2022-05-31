const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    fullname: String,
    grade: Number,
    feedback: Array,
    comments: Array,
    isStudentRep: Boolean,
    posts: Array
})

module.exports = mongoose.model('User', UserSchema);