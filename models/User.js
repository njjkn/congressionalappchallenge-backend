const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    fullname: String,
    username: String,
    grade: Number,
    bio: String,
    profileImage: String,
    feedback: Array,
    comments: Array,
    isStudentRep: Boolean,
    posts: Array
})

module.exports = mongoose.model('User', UserSchema);