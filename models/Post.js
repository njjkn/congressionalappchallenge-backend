const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    comments: Array,
    userID: String,
    likes: Array,
    title: String,
    content: String,
    date: String,
    status: String,
    grade: Number,
    isSchoolWide: Boolean,
    isApproved: Boolean,
})

module.exports = mongoose.model('Post', PostSchema);